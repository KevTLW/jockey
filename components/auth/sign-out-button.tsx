"use client";

import { useAuth } from "@/hooks/use-auth";
import Link from "@/components/ui/link";

export default function SignOutButton() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Link href="/" theme="danger" onClick={handleSignOut}>
      sign out
    </Link>
  );
}
