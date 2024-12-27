import React, { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { FaVideo } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";

const HomePage = () => {
  const navigate = useNavigate();

  const [roomID, setRoomID] = useState("");
  const [view, setView] = useState("home"); // home | create-room | enter-room | room
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnterRoom = () => {
    if (roomID.trim()) {
      localStorage.setItem("role", "guest");
      localStorage.setItem("id", "");
      navigate(`/room/${roomID}`);
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://qqx4bjc0-5000.uks1.devtunnels.ms/create-room"
      );
      setRoomID(data.roomID);
      setRole(data.role);
      localStorage.setItem("role", data.role);
      localStorage.setItem("id", data.userId);
      setView("create-room-success");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create room");
      setView("create-room-error");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = () => {
    setView("enter-room");
  };

  if (view === "home") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Welcome</h1>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleCreateRoom}
        >
          {loading ? (
            <AiOutlineLoading className="animate-spin" />
          ) : (
            "Create Room"
          )}
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleJoinRoom}
        >
          Enter Room
        </button>
      </div>
    );
  }

  if (view === "create-room-success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Room Created</h2>
        <p className="mb-2">
          Room ID: <strong>{roomID}</strong>
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleEnterRoom}
        >
          Enter Room Now
        </button>
      </div>
    );
  }

  if (view === "create-room-error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error}</p>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          onClick={() => setView("home")}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (view === "enter-room") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-xl font-bold mb-4">Enter Room</h2>
        <TextInput
          type="text"
          placeholder="Room ID"
          className="border px-4 py-2 rounded mb-4"
          onChange={(e) => setRoomID(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleEnterRoom}
        >
          Join Room
        </button>
      </div>
    );
  }

  return null;
};

export default HomePage;
