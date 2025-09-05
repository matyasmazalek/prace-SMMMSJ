import { useState } from "react";
import { useNavigate, Outlet } from "react-router";

export default function Index() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  // Kódy a jejich cílové chaty
  const chatCodes = {
    1234: "/chat/1",
    5678: "/chat/2",
    9999: "/chat/secret",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (chatCodes[code]) {
      navigate(chatCodes[code]); // přesměrování na chat
    } else {
      alert("Neplatný kód!");
    }
  };

  return (
    <div>
      <main>
        {/* Formulář pro zadání 4místného kódu */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength={4}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Zadej 4místný kód"
          />
          <button type="submit">Odeslat</button>
        </form>

        <Outlet />
      </main>
    </div>
  );
}
