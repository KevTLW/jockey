import EmptyState from "@/components/party/empty-state";
import SignOutButton from "@/components/auth/sign-out-button";

export const metadata = {
  title: "jockey: start or join a party",
};

export default function PartyPage() {
  return (
    <main className="min-h-screen p-4">
      <div className="mb-4 flex justify-end">
        <SignOutButton />
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <EmptyState type="create" />
        <EmptyState type="join" />
      </div>
    </main>
  );
}
