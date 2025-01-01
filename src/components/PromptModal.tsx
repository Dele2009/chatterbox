import { Button, TextInput } from "flowbite-react";
import React, { useState } from "react";

type PromptModalProps = {
  message: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
};

const PromptModal = ({ message, onSubmit, onClose }: PromptModalProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg">
        <p className="mb-4">{message}</p>
        <TextInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full mb-4"
          placeholder="Type your input..."
        />
        <div className="flex gap-2 justify-end">
          <Button
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            onClick={onClose}
            className="!bg-gray-500"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;