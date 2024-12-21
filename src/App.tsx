import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Main from "./layouts/Main";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import UnlockWallet from "./pages/UnlockWallet";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>}>
          <Route index element={<Home/>} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="unlock-wallet" element={<UnlockWallet />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
