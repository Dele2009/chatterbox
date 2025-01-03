import React, { useState } from "react";
import { Button, TextInput, Alert, Clipboard } from "flowbite-react";
import { FaComments, FaRocket, FaInfoCircle, FaUsers } from "react-icons/fa";
import {
  AiOutlineLoading3Quarters,
  AiOutlineExclamationCircle,
} from "react-icons/ai";
import { MdOutlineRoom } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GetStarted = () => {
  const navigate = useNavigate();

  const [roomID, setRoomID] = useState("");
  const [view, setView] = useState("home"); // 'home' | 'create-room-success' | 'enter-room' | 'error'
  const [role, setRole] = useState("guest");
  const [id, setId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const URL_HOST = `${window.location.origin}/room/${roomID}`;

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
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-2">
          <FaComments className="text-blue-500" /> Welcome to ChatterBox
        </h1>
        <p className="text-lg text-gray-600">
          Connect, collaborate, and chat seamlessly with ChatterBox.
        </p>
      </header>
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <Button
          onClick={handleCreateRoom}
          className="w-64 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <AiOutlineLoading3Quarters className="animate-spin" />
          ) : (
            <>
              <FaRocket className="h-6 mr-2" />
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
      <section className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Why Choose ChatterBox?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded shadow-md">
            <FaUsers className="text-4xl text-blue-500 mb-4" />
            <h3 className="text-xl font-semibold">Collaborate</h3>
            <p className="text-gray-600">
              Work together with teams and friends seamlessly.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <FaComments className="text-4xl text-green-500 mb-4" />
            <h3 className="text-xl font-semibold">Chat Effortlessly</h3>
            <p className="text-gray-600">
              Enjoy smooth, high-quality audio and video conversations.
            </p>
          </div>
          <div className="bg-white p-6 rounded shadow-md">
            <FaInfoCircle className="text-4xl text-yellow-500 mb-4" />
            <h3 className="text-xl font-semibold">Easy to Use</h3>
            <p className="text-gray-600">
              Get started in minutes with an intuitive and user-friendly design.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  const renderCreateRoomSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-6 rounded shadow-md text-center w-full max-w-lg">
        <h2 className="text-2xl font-bold text-green-500 mb-4 flex items-center gap-2">
          <FaComments /> Room Created Successfully
        </h2>
        <p className="text-lg text-gray-700 mb-4">
          Share the link below to invite others to your ChatterBox room!
        </p>
        <div className="flex flex-col justify-center items-center gap-4 mb-4">
          <div className="relative w-full">
            <TextInput type="text" value={`${roomID}`} disabled readOnly />
            <Clipboard.WithIconText valueToCopy={`${roomID}`} />
          </div>
          <div className="relative w-full">
            <TextInput type="text" value={URL_HOST} disabled readOnly />
            <Clipboard.WithIconText valueToCopy={URL_HOST} />
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

export default GetStarted;
