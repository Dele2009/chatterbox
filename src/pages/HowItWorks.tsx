import { FaWallet, FaBarcode, FaGift } from "react-icons/fa"; // React-Icons
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="w-full pt-20">
      {/* Top Instructions */}
      <div className="flex justify-around mb-8 text-center">
        <Link to="/unlock-wallet">
          <FaBarcode className="text-2xl md:text-7xl mx-auto mb-2 text-gray-300" />
          <p className="text-gray-300 text-xs md:text-md">
            Paste your Passphrase
          </p>
        </Link>
        <Link to="/unlock-wallet">
          <FaWallet className="text-2xl md:text-7xl mx-auto mb-2 text-gray-300" />
          <p className="text-gray-300 text-xs md:text-md">Unlock your wallet</p>
        </Link>
        <Link to="/unlock-wallet">
          <FaGift className="text-2xl md:text-7xl mx-auto mb-2 text-gray-300" />
          <p className="text-gray-300 text-xs md:text-md">Get your Airdrop</p>
        </Link>
      </div>

      {/* Main Section */}
      <div className="m-auto grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
        {/* Wallet Image */}
        <div className="flex justify-center items-center">
          <img
            src="/how-it-works.png"
            alt="Wallet with money"
            className="h-full"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <h3 className="text-lg text-gray-400 mb-2">How it Works</h3>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get <span className="text-pink-500">Crypto</span> easy & <br />
            <span className="text-pink-500">free.</span>
          </h1>
          <p className="text-gray-300 mb-6">
            Link your Pi account and have your bonus in minutes. It's super easy
            & fast.
          </p>
          <ul className="mb-6">
            <li className="text-gray-300 flex items-center gap-2">✔ Free</li>
            <li className="text-gray-300 flex items-center gap-2">✔ Secure</li>
          </ul>

          {/* CTA Button */}
          <Button
            as={Link}
            to="/unlock-wallet"
            size="lg"
            className="text-white !bg-[#FF5EA2] !w-fit font-bold"
          >
            <div className="!flex !items-center">
              <img
                // key={index}
                src="/box.png"
                alt="Box-present"
                className={`h-8`}
              />
              CLAIM 614 PI NETWORK COINS
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
