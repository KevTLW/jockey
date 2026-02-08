"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import QRCodeModal from "@/components/party/qr-code-modal";

export default function QRCodeModalToggler() {
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
}
