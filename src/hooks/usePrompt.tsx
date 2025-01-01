import { useState } from "react";
import PromptModal from "../components/PromptModal";

export const usePrompt = () => {
  const [dialogState, setDialogState] = useState<{
    message: string;
    resolve: (value: string | null) => void;
  } | null>(null);

  const showPrompt = (message: string): Promise<string | null> => {
    return new Promise((resolve) => {
      setDialogState({ message, resolve });
    });
  };

  const handleClose = () => {
    if (dialogState) dialogState.resolve(null);
    setDialogState(null);
  };

  const handleSubmit = (value: string) => {
    if (dialogState) dialogState.resolve(value);
    setDialogState(null);
  };

  const PromptComponent = () =>
    dialogState ? (
      <PromptModal
        message={dialogState.message}
        onSubmit={handleSubmit}
        onClose={handleClose}
      />
    ) : null;

  return { showPrompt, PromptComponent };
};
