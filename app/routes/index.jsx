import { Link, Outlet } from "react-router";

export default function Index() {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/chat">Chat</Link>
          <Link to="/users">Users</Link>
        </nav>
      </header>
      <main>
        <Outlet /> {/* Tohle místo bude vykreslovat obsah jednotlivých rout */}
      </main>
    </div>
  );
}