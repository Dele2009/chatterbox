import React from "react";
import { Button } from "flowbite-react";
import { FaComments, FaRocket, FaShieldAlt, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center text-white">
      {/* Header Section */}
      <header className="w-full px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">ChatterBox</h1>
        <nav>
          <ul className="hidden md:flex space-x-6">
            <li>
              <a href="#features" className="hover:underline">
                Features
              </a>
            </li>
            <li>
              <a href="#about" className="hover:underline">
                About
              </a>
            </li>
            {/* <li>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </li> */}
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-grow flex flex-col items-center justify-center text-center px-6 py-8">
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Connect, Collaborate, Communicate
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl">
          Join the conversation with ChatterBox—your ultimate platform for
          seamless chat and collaboration. Designed for professionals,
          educators, and teams worldwide.
        </p>
        <div className="flex space-x-4">
          <Button
            as={Link}
            to="/get-started"
            size="lg"
            gradientDuoTone="greenToBlue"
            className="border-2 border-white"
          >
            <FaUserPlus className="mr-2 h-7" /> Create or Join a Room
          </Button>
          {/* <Button
            as={Link}
            to="/get-started"
            size="lg"
            outline
            gradientDuoTone="greenToBlue"
          >
            <FaUserPlus className="mr-2" /> Join a Room
          </Button> */}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="w-full bg-white text-gray-800 py-16 px-6"
      >
        <h3 className="text-3xl font-bold text-center mb-12">Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col items-center">
            <FaRocket className="text-5xl mb-4 text-green-500" />
            <h4 className="text-xl font-semibold">Easy Room Creation</h4>
            <p className="text-center mt-2">
              Quickly create rooms for instant collaboration.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaComments className="text-5xl mb-4 text-blue-500" />
            <h4 className="text-xl font-semibold">Real-Time Chat</h4>
            <p className="text-center mt-2">
              Engage in live discussions and exchange ideas seamlessly.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaShieldAlt className="text-5xl mb-4 text-red-500" />
            <h4 className="text-xl font-semibold">Secure Communication</h4>
            <p className="text-center mt-2">
              End-to-end encryption ensures your privacy and security.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaUserPlus className="text-5xl mb-4 text-yellow-500" />
            <h4 className="text-xl font-semibold">Effortless Joining</h4>
            <p className="text-center mt-2">
              Invite others and join rooms with just a single click.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">About ChatterBox</h3>
          <p className="text-lg leading-relaxed">
            ChatterBox is built to make communication effortless and secure.
            Whether you're a professional, educator, or part of a team, our
            mission is to enable seamless interaction through an intuitive
            platform.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      {/*<section
        id="contact"
        className="w-full bg-gray-900 text-white py-16 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
          <p className="mb-6">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <Button gradientDuoTone="greenToBlue">Contact Us</Button>
        </div>
      </section>*/}

      {/* Footer Section */}
      <footer className="w-full bg-gray-800 text-white py-4">
        <div className="text-center">
          &copy; {new Date().getFullYear()} ChatterBox. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
