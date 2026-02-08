"use client";

import { useConvexAuth } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import AuthModal from "@/components/auth/auth-modal";
import Button from "@/components/ui/button";
import Link from "@/components/ui/link";

export default function CallToAction() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [authModalIsOpen, setAuthModalIsOpen] = useState(false);

  const partyId = searchParams.get("party");
  const redirectTo = partyId ? `/party/${partyId}` : "/party";

  const handleCallToActionUnauthed = () => {
    setAuthModalIsOpen(true);
  };

  if (isLoading) {
    return (
      <Button theme="primary" disabled>
        loading...
      </Button>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Link theme="primary" href={redirectTo}>
          use jockey
        </Link>
      ) : (
        <Button theme="primary" onClick={handleCallToActionUnauthed}>
          use jockey
        </Button>
      )}
      <AuthModal
        isOpen={authModalIsOpen}
        setIsOpen={setAuthModalIsOpen}
        redirectTo={redirectTo}
      />
    </>
  );
}
