import { useState } from "react";
import Button from "../ui/Button.client";
import QRCodeModal from "./QRCodeModal.client";

export const QRCodeModalToggler = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button theme="primary" className="mt-4" onClick={handleClick}>
        join party
      </Button>
      <QRCodeModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default QRCodeModalToggler;
