import React, { useRef, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import {
  FaPhoneSlash,
  FaMicrophoneSlash,
  FaCommentDots,
  FaMicrophone,
  FaVideoSlash,
  FaVideo,
} from "react-icons/fa";
import { Button, Modal, TextInput } from "flowbite-react";
import Peer, { MediaConnection } from "peerjs";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePrompt } from "../hooks/usePrompt";

interface User {
  peerID: string;
  userId: string;
  name: string;
}

const VideoRoomPage = () => {
  const navigate = useNavigate();

  const { showPrompt, PromptComponent } = usePrompt();
  const role = (localStorage.getItem("role") || "guest") as "host" | "guest";
  const userId = localStorage.getItem("id") || "";
  const { roomID } = useParams();

  const [name, setName] = useState<string>("");
  const [peerId, setPeerId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [isHost, setIsHost] = useState<boolean>(role === "host");
  const [connected, setConnected] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<
    { sender: string; message: string; name: string }[]
  >([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const [isVideoBlocked, setIsVideoBlocked] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const localVideo = useRef<HTMLVideoElement | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  const socket = useRef<Socket | null>(null);
  const peerInstance = useRef<Peer | null>(null);
  const currentCalls = useRef<{ [key: string]: MediaConnection }>({});
  const localStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    let peer: Peer | null;

    const initialize = async () => {
      const username = await showPrompt("Enter your display name:");
      const defaultName = isHost ? "Host" : "Guest";
      const finalName = username || defaultName;
      setName(finalName);

      // Initialize socket connection
      socket.current = io(`${import.meta.env.VITE_API_URL}`);
      peer = new Peer();

      peer.on("open", (id) => {
        setPeerId(id);

        socket.current?.emit(
          "join-room",
          { roomID, peerID: id, userId, name: finalName },
          (response: { error?: string; users?: User[] }) => {
            if (response.error) {
              toast.error(response.error, { position: "bottom-right" });
            } else {
              const { users: existingUsers } = response;
              setUsers(existingUsers || []);
              setConnected(true);
              toast.success("Connected to the room!", {
                position: "top-center",
              });

              navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                  localStream.current = stream;
                  if (localVideo.current) {
                    localVideo.current.srcObject = stream;
                  }
                  existingUsers?.forEach((user) =>
                    callUser(user.peerID, stream, peer)
                  );
                })
                .catch((err) => {
                  toast.error("Failed to access media devices", {
                    position: "bottom-right",
                  });
                  console.error("Media access error:", err);
                });
            }
          }
        );
      });

      // Handle incoming calls
      const handleIncomingCall = (call: MediaConnection) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            call.answer(stream);
            call.on("stream", (remoteStream) => {
              if (videoRefs.current[call.peer]) {
                videoRefs.current[call.peer].srcObject = remoteStream;
              }
            });
            currentCalls.current[call.peer] = call;
          })
          .catch((err) => {
            console.error("Error answering call:", err);
          });
      };

      peer.on("call", handleIncomingCall);

      // Handle user joining
      socket.current?.on("user-joined", ({ peerID, userId, name }: User) => {
        setUsers((prev) => [...prev, { peerID, userId, name }]);
        toast.info(`${name} has joined the room!`, { position: "top-right" });
        if (localStream.current) {
          callUser(peerID, localStream.current, peer!);
        }
      });

      // Handle chat messages
      socket.current?.on("new-message", ({ sender, message, name }) => {
        if (sender === peerId) return;
        console.log("new message", { sender, message, name });
        setMessages((prev) => [...prev, { sender, message, name }]);
      });

      // Handle user disconnection
      socket.current?.on(
        "user-disconnected",
        ({ peerID }: { peerID: string }) => {
          setUsers((prev) => prev.filter((user) => user.peerID !== peerID));
          toast.warn("A user has left the room.", { position: "top-right" });

          if (currentCalls.current[peerID]) {
            currentCalls.current[peerID].close();
            delete currentCalls.current[peerID];
          }
        }
      );

      peerInstance.current = peer;
    };

    initialize();

    return () => {
      // Cleanup
      peer?.off("call");
      peer?.destroy();
      socket.current?.off("user-joined");
      socket.current?.off("new-message");
      socket.current?.off("user-disconnected");
      socket.current?.disconnect();

      Object.values(currentCalls.current).forEach((call) => call.close());
      currentCalls.current = {};
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomID, userId]);

  const callUser = (peerID: string, stream: MediaStream, peer: Peer) => {
    const call = peer.call(peerID, stream);
    currentCalls.current[peerID] = call;
    call.on("stream", (remoteStream) => {
      if (videoRefs.current[peerID]) {
        videoRefs.current[peerID].srcObject = remoteStream;
      }
    });
  };

  const handleEndCall = () => {
    Object.values(currentCalls.current).forEach((call) => call.close());
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
    }
    socket.current?.emit("leave-room", { roomID});
    setConnected(false);
    toast.success("Call ended.", { position: "top-center" });
    localStorage.clear();
    navigate("/");
  };

  const handleMuteAll = () => {
    if (isHost && localStream.current) {
      users.forEach(({ peerID }) => {
        socket.current?.emit("mute-user", { peerID });
      });
      toast.info("Muted all users.", { position: "top-center" });
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && socket.current) {
      socket.current.emit("chat-message", {
        sender: peerId,
        message: newMessage,
        roomID,
        name,
      });
      console.log("new message sent", "\n \n", {
        sender: peerId,
        message: newMessage,
        roomID,
        name,
      });
      setMessages((prev) => [
        ...prev,
        { name: "You", sender: peerId, message: newMessage },
      ]);
      setNewMessage("");
    }
  };

  // Function to toggle video
  const toggleVideo = () => {
    if (localStream.current) {
      const videoTrack = localStream.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoBlocked(!videoTrack.enabled);
        toast.info(`Video ${videoTrack.enabled ? "enabled" : "disabled"}`, {
          position: "top-right",
        });
      }
    }
  };

  // Function to toggle audio
  const toggleAudio = () => {
    if (localStream.current) {
      const audioTrack = localStream.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioMuted(!audioTrack.enabled);
        toast.info(`Audio ${audioTrack.enabled ? "enabled" : "muted"}`, {
          position: "top-right",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <PromptComponent />
      <h1 className="text-2xl font-bold mb-4">Room: {roomID}</h1>
      <div className="relative flex-grow w-full flex flex-col">
        <div className="absolute bottom-4 right-4 w-32 h-32 md:w-44 md:h-44">
          <div className="relative group w-full h-full">
            <video
              ref={localVideo}
              autoPlay
              muted
              className="bg-black border rounded w-full h-full"
            />
            <span className="absolute bottom-3 left-3 font-semibold text-white bg-black rounded p-2">
              You
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {users.map((user) => (
            <div key={user.peerID} className="relative group w-full h-full">
              <video
                ref={(el) => (videoRefs.current[user.peerID] = el)}
                autoPlay
                className="bg-black border rounded w-full h-full"
              />
              <span className="absolute bottom-3 left-3 font-semibold text-white bg-black rounded p-2">
                {user.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center align-center gap-4">
        {isHost ? (
          <>
            <Button color="failure" onClick={handleEndCall}>
              <FaPhoneSlash className="mr-2 h-6" /> End Call
            </Button>
            <Button color="dark" onClick={handleMuteAll}>
              <FaMicrophoneSlash className="mr-2 h-6" /> Mute All
            </Button>
          </>
        ) : (
          <Button color="gray" onClick={handleEndCall}>
            <FaPhoneSlash className="mr-2 h-6" /> Leave Room
          </Button>
        )}
        <Button color="info" onClick={toggleVideo}>
          {isVideoBlocked ? (
            <>
              <FaVideoSlash className="mr-2 h-6" /> Enable Video
            </>
          ) : (
            <>
              <FaVideo className="mr-2 h-6" /> Disable Video
            </>
          )}
        </Button>

        {/* Toggle Audio Button */}
        <Button color="info" onClick={toggleAudio}>
          {isAudioMuted ? (
            <>
              <FaMicrophoneSlash className="mr-2 h-6" /> Unmute
            </>
          ) : (
            <>
              <FaMicrophone className="mr-2 h-6" /> Mute
            </>
          )}
        </Button>
        <Button color="info" onClick={() => setIsChatOpen(!isChatOpen)}>
          <FaCommentDots className="mr-2 h-6" /> Chat
        </Button>
      </div>

      <Modal show={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <Modal.Header>Chat</Modal.Header>
        <Modal.Body>
          <div className="h-64 overflow-y-scroll bg-gray-200 p-4 rounded">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.sender === peerId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`mb-2 flex ${
                    msg.sender === peerId
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                  } p-2 rounded`}
                >
                  <strong>{msg.name}:</strong> <span>{msg.message}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <TextInput
              type="text"
              className="w-full"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>Send</Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default VideoRoomPage;
