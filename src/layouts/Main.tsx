import { Link, Outlet } from "react-router-dom";
import { FaApple, FaGooglePlay } from "react-icons/fa"; // App Store, Google Play, Email Icons
import { Button, TextInput } from "flowbite-react";

const Footer = () => {
  // const date = new Date()
  // const year =
  return (
    <footer className="bg-[#260C4A] text-white py-12 mt-20 px-6 border-t border-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Left Section - Text */}

        {/* App Store and Google Play */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Link to="/">
              <img src="/logo.jpg" alt="logo" className="h-8 rounded-md" />
            </Link>
            <h2 className="text-2xl font-semibold">Pi Network</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Join the decentralized movement. Stay secure and in control.
          </p>
          {/* <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} All rights reserved.
          </p> */}
        </div>

        {/* Middle Section - Subscribe */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Stay Updated</h2>
          <p className="text-gray-400 mb-4">
            Enter your email to receive relevant and timely updates.
          </p>
          <div className="flex items-center space-x-2">
            <TextInput
              type="email"
              placeholder="Enter your email"
              className="w-full"
            />
            <Button size="sm" className="!bg-pink-500 text-white font-bold">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Right Section - Branding */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Don't have Pi yet?</h1>
          <p className="text-gray-400 mb-4">Download the app here:</p>
          <div className="space-y-4">
            <a
              target="_blank"
              href="https://apps.apple.com/us/app/pi-network/id1445472541"
              className="flex items-center text-gray-300 hover:text-white"
            >
              <FaApple className="text-2xl mr-2" /> Download on the
              <span className="font-semibold ml-1">App Store</span>
            </a>
            <a
              target="_blank"
              href="https://play.google.com/store/apps/details?id=pi.browser"
              className="flex items-center text-gray-300 hover:text-white"
            >
              <FaGooglePlay className="text-2xl mr-2" /> Get it on
              <span className="font-semibold ml-1">Google Play</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

function Main() {
  return (
    <div className="bg-[#260C4A]  text-white px-4">
      <header className="sticky top-0 flex justify-center items-center gap-2 w-full bg-purple-700 py-3 rounded-md mb-10 z-50">
        {/* <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
          <span className="text-lg font-bold text-[#260C4A]">π</span>
        </div> */}
        <Link to="/">
          <img src="/logo.jpg" alt="logo" className="h-8 rounded-md" />
        </Link>
        <h1 className="text-lg font-bold text-yellow-400">Pi Network</h1>
      </header>
      <Outlet />
      <Footer />
    </div>
  );
}

export default Main;
