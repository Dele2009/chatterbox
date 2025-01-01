import React, { useState } from "react";
import { Button, TextInput, Alert, Clipboard } from "flowbite-react";
import { FaVideo, FaHome } from "react-icons/fa";
import {
  AiOutlineLoading3Quarters,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { MdOutlineRoom } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const [roomID, setRoomID] = useState("");
  const [view, setView] = useState("home"); // 'home' | 'create-room-success' | 'enter-room' | 'error'
  const [role, setRole] = useState("guest");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEnterRoom = () => {
    if (roomID.trim()) {
      localStorage.setItem("role", role);
      localStorage.setItem("id", id);
      navigate(`/room/${roomID}`);
    }
  };

  const handleCreateRoom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-room`
      );
      setRoomID(data.roomID);
      setRole(data.role);
      setId(data.userId);
      setView("create-room-success");
    } catch (err) {
      setError(
        (err as any).response?.data?.error ||
          "Failed to create a room. Please try again."
      );
      setView("error");
    } finally {
      setLoading(false);
    }
  };

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FaVideo className="text-green-500" /> Video Room
      </h1>
      <Button
        onClick={handleCreateRoom}
        className="w-64 mb-4 flex items-center justify-center gap-2"
        disabled={loading}
      >
        {loading ? (
          <AiOutlineLoading3Quarters className="animate-spin" />
        ) : (
          <>
            <FaVideo className="h-6 mr-2" />
            Create Room
          </>
        )}
      </Button>
      <Button
        color="blue"
        onClick={() => setView("enter-room")}
        className="w-64 flex items-center justify-center gap-2"
      >
        <MdOutlineRoom className="h-6 mr-2" /> Enter Room
      </Button>
    </div>
  );

  const renderCreateRoomSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded shadow-md text-center w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
          <FaVideo /> Room Created Successfully
        </h2>
        {/* <p className="text-lg text-gray-700 mb-4">
          Room ID: <strong>{roomID}</strong>
        </p> */}
        <div className="flex flex-col justify-center items-center gap-4 mb-4">
          <div className="relative w-full">
            <TextInput type="text"  value={`${roomID}`} disabled readOnly />
            <Clipboard.WithIconText valueToCopy={`${roomID}`} />
          </div>
          <div className="relative w-full">
            <TextInput
              type="text" 
              value={`${import.meta.env.VITE_DOMAIN_URL}/room/${roomID}`}
              disabled
              readOnly
            />
            <Clipboard.WithIconText
              valueToCopy={`${import.meta.env.VITE_DOMAIN_URL}/room/${roomID}`}
            />
          </div>
        </div>
        <Button
          color="blue"
          onClick={handleEnterRoom}
          className="w-full flex items-center justify-center gap-2"
        >
          <MdOutlineRoom className="h-6 mr-2" /> Enter Room Now
        </Button>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <Alert color="failure" icon={AiOutlineExclamationCircle} className="mb-4">
        {error}
      </Alert>
      <Button
        color="gray"
        onClick={() => setView("home")}
        className="w-64 flex items-center justify-center gap-2"
      >
        <FaHome className="h-6 mr-2" /> Go Back Home
      </Button>
    </div>
  );

  const renderEnterRoom = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdOutlineRoom /> Enter Room
      </h2>
      <TextInput
        type="text"
        placeholder="Enter Room ID"
        className="mb-4 w-64"
        onChange={(e) => setRoomID(e.target.value)}
      />
      <Button
        color="blue"
        onClick={handleEnterRoom}
        className="w-64 flex items-center justify-center gap-2"
      >
        <MdOutlineRoom className="h-6 mr-2" /> Join Room
      </Button>
    </div>
  );

  switch (view) {
    case "home":
      return renderHome();
    case "create-room-success":
      return renderCreateRoomSuccess();
    case "error":
      return renderError();
    case "enter-room":
      return renderEnterRoom();
    default:
      return null;
  }
};

export default HomePage;
