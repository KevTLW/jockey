import PartyLobby from "@/components/ui/party-lobby";

export const metadata = {
  title: "jockey: party lobby",
};

export default async function PartyLobbyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PartyLobby partyId={id} />;
}
