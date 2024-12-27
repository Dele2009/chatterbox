import React, { useRef, useState, useEffect } from "react";
import { io } from "socket.io-client";
import { FaVideo, FaPhoneSlash } from "react-icons/fa";
import { Button } from "flowbite-react";
import Peer from "peerjs";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VideoRoomPage = () => {
  const role = localStorage.getItem("role") || '';
  const userId = localStorage.getItem("id") || "";
  console.log(userId)
  const { roomID } = useParams();

  const [peerId, setPeerId] = useState("");
  const [users, setUsers] = useState([]);
  const [isHost, setIsHost] = useState(role === "host");
  const [connected, setConnected] = useState(false);

  const localVideo = useRef(null);
  const videoRefs = useRef({});
  const socket = useRef(null);
  const peerInstance = useRef(null);
  const currentCalls = useRef({});
  const localStream = useRef(null);

  useEffect(() => {
    // Initialize socket
    socket.current = io("https://qqx4bjc0-5000.uks1.devtunnels.ms");

    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
      console.log('peer id', id, '\n \n \n \n', 'userId:', userId);
      socket.current.emit(
        "join-room",
        { roomID, peerID: id, userId },
        (response) => {
          if (response.error) {
            toast.error(response.error, { position: "bottom-right" });
          } else {
            const { users: existingUsers } = response;
            setUsers(existingUsers);
            toast.success("Connected to the room!", { position: "top-center" });

            // Set up local video stream and call users
            navigator.mediaDevices
              .getUserMedia({ video: true, audio: true })
              .then((stream) => {
                localStream.current = stream;
                if (localVideo.current) {
                  localVideo.current.srcObject = stream;
                }
                existingUsers.forEach((user) => callUser(user.peerID, stream, peer));
              });
          }
        }
      );
    });

    // Handle incoming calls
    peer.on("call", (call) => {
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
        });
    });

    // Handle new users joining
    socket.current.on("user-joined", ({ peerID, userId }) => {
      setUsers((prev) => [...prev, { peerID, userId }]);
      toast.info("A new user has joined the room!", { position: "top-right" });
      if (localStream.current) {
        callUser(peerID, localStream.current, peer);
      }
    });

    // Handle user disconnections
    socket.current.on("user-disconnected", ({ peerID }) => {
      setUsers((prev) => prev.filter((user) => user.peerID !== peerID));
      toast.warn("A user has left the room.", { position: "top-right" });

      if (currentCalls.current[peerID]) {
        currentCalls.current[peerID].close();
        delete currentCalls.current[peerID];
      }
    });

    peerInstance.current = peer;

    return () => {
      // Cleanup
      peer.destroy();
      socket.current.disconnect();
      if (localStream.current) {
        localStream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [roomID, userId]);

  const callUser = (peerID, stream, peer) => {
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
    setConnected(false);
    toast.success("Call ended.", { position: "top-center" });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Room: {roomID}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <video ref={localVideo} autoPlay muted className="border rounded w-full h-full"></video>
        {users.map((user) => (
          <video
            key={user.peerID}
            ref={(el) => (videoRefs.current[user.peerID] = el)}
            autoPlay
            className="border rounded w-full h-full"
          />
        ))}
      </div>
      <Button color="failure" onClick={handleEndCall} className="mt-4">
        <FaPhoneSlash className="mr-2" /> End Call
      </Button>
    </div>
  );
};

export default VideoRoomPage;


// {/* <div key={user.peerID} className="relative">
//   <video
//     ref={(el) => (videoRefs.current[user.peerID] = el)}
//     autoPlay
//     className="border rounded w-full h-full"
//   ></video>
//   {isHost && (
//     <button
//       className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded"
//       onClick={() =>
//         socket.emit("mute-user", {
//           roomID,
//           targetUserId: user.userId,
//         })
//       }
//     >
//       Mute
//     </button>
//   )}
// </div>; */}