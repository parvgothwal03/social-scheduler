export default function MissingConfiguration() {
  return (
    <main>
      <h1>Application configuration is incomplete</h1>
      <p>
        The Clerk publishable key is missing. Set
        <code> VITE_CLERK_PUBLISHABLE_KEY </code>
        in the deployment environment and rebuild the client.
      </p>
    </main>
  );
}
