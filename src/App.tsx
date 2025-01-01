// Install dependencies for styling and WebRTC
// npm install tailwindcss react-icons flowbite-react peerjs
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/Home";
import VideoRoomPage from "./pages/VideoRoom";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room/:roomID" element={<VideoRoomPage />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

// Vite-specific setup:
// 1. Ensure you have a vite.config.js or vite.config.ts in the root directory.
// 2. Install necessary plugins if required, like React support:
//    npm install @vitejs/plugin-react
// 3. Update scripts in package.json:
//    "dev": "vite",
//    "build": "vite build",
//    "preview": "vite preview"
