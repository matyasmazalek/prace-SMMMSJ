import { useState } from "react";
import { useNavigate } from "react-router";
import { sql } from "../api/sql";

export default function Index() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [chatCode, setChatCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !surname) {
      setMessage("❌ Vyplň jméno i příjmení!");
      return;
    }

    await sql(`
      INSERT INTO users_SMMMSJ (name, surname)
      VALUES ('${name}', '${surname}')
    `);

    const newUser = { name, surname };
    localStorage.setItem("chatUser", JSON.stringify(newUser));
    setMessage("✅ Registrace úspěšná! Jsi přihlášen.");
    setIsLoggedIn(true);
  };

  const handleLogin = async () => {
    if (!name || !surname) {
      setMessage("❌ Vyplň jméno i příjmení!");
      return;
    }

    const result = await sql(`
      SELECT * FROM users_SMMMSJ
      WHERE name='${name}' AND surname='${surname}'
      LIMIT 1
    `);

    if (result && result.length > 0) {
      const loggedUser = { name, surname };
      localStorage.setItem("chatUser", JSON.stringify(loggedUser));
      setMessage("✅ Přihlášení úspěšné!");
      setIsLoggedIn(true);
    } else {
      setMessage("❌ Uživatel nenalezen.");
      setIsLoggedIn(false);
    }
  };

  const handleEnterChat = async () => {
    if (!isLoggedIn) {
      setMessage("❌ Musíš se nejprve přihlásit!");
      return;
    }

    if (!chatCode) {
      setMessage("❌ Zadej 4-místný kód!");
      return;
    }

    const result = await sql(`
      SELECT * FROM chats_SMMMSJ
      WHERE chat_code='${chatCode}'
      LIMIT 1
    `);

    if (result && result.length > 0) {
      navigate(`/chat/${chatCode}`);
    } else {
      setMessage("❌ Chat s tímto kódem neexistuje.");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "0 auto" }}>
      <h1>Login / Registrace</h1>

      <input
        type="text"
        placeholder="Jméno"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Příjmení"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      /><br />

      <button onClick={handleRegister}>Registrovat</button>
      <button onClick={handleLogin}>Login</button>

      <h2>Připojit se do chatu</h2>
      <input
        type="text"
        placeholder="Zadej 4-místný kód"
        value={chatCode}
        onChange={(e) => setChatCode(e.target.value)}
      />
      <button onClick={handleEnterChat}>Odeslat</button>

      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}
