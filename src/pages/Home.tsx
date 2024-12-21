// import { FaGift } from "react-icons/fa"; // React Icons
import { Button } from "flowbite-react"; // Flowbite React components
import { Link } from "react-router-dom";

const PiNetworkAirdrop = () => {
  return (
    <>
      {/* Header Section */}

      <div className="w-full max-w-7xl m-auto ">
        {/* Hero Section */}
        <main className="m-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Text Content */}
          <div className="max-w-lg flex flex-col justify-center">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Pi Network first <br /> Airdrop this Season
            </h2>
            <p className="text-gray-300 mb-6">
              The official Pi Network has reached 2 million pioneers! To get
              closer to the mainnet and activate and attract more pioneers, they
              will be holding an airdrop, awarding a total of <b>614π</b>
              /pioneer prizes to those who successfully complete KYC.
            </p>
            <p className="text-gray-300">
              The future looks very exciting as the Pi community continues to
              build the Web3 Pi ecosystem full of amazing apps and utilities on
              top of the Pi browser.
            </p>
            {/* Button */}
            <Button
              as={Link}
              to="/how-it-works"
              className="mt-6 !w-fit "
              color="yellow"
              size="lg"
            >
              {/* <FaGift className="mr-2 h-6" size={16} /> */}
              <div className="!flex !items-center">
                <img
                  // key={index}
                  src="/box.png"
                  alt="Box-present"
                  className={`h-8`}
                />
                Participate in Airdrop
              </div>
            </Button>
          </div>

          {/* Image */}
          <div className="flex justify-center relative overflow-hidden">
            <img
              src="/hero.png"
              alt="Santa with Pi Network"
              className="h-full"
            />

            <img
              // key={index}
              src="/box.png"
              alt="Box-present"
              className={`h-72 absolute -bottom-32 right-[50%]`}
            />
          </div>
        </main>
      </div>
    </>
  );
};

export default PiNetworkAirdrop;
