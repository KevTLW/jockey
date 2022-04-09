import EmptyState from "../../components/party/EmptyState.client";

const Party = () => {
  return (
    <main className="grid min-h-screen grid-cols-1 gap-2 md:grid-cols-2 md:gap-8">
      <EmptyState type="create" />
      <EmptyState type="join" />
    </main>
  );
};

export default Party;
