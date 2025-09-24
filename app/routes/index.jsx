import React, { useState } from "react";
import { sql } from "../api/sql";
import { useNavigate } from "react-router";

export default function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [chatCode, setChatCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ← nový stav
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !surname) {
      setMessage("Vyplň jméno i příjmení!");
      return;
    }

    await sql(`
      INSERT INTO users_SMMMSJ (name, surname)
      VALUES ('${name}', '${surname}')
    `);
    setMessage("✅ Registrace úspěšná!");
  };

  const handleLogin = async () => {
    if (!name || !surname) {
      setMessage("Vyplň jméno i příjmení!");
      return;
    }

    const result = await sql(`
      SELECT * FROM users_SMMMSJ
      WHERE name='${name}' AND surname='${surname}'
      LIMIT 1
    `);

    if (result && result.length > 0) {
      setMessage("✅ Přihlášení úspěšné!");
      setIsLoggedIn(true); // ← přihlášení povoleno
    } else {
      setMessage("❌ Uživatel nenalezen.");
      setIsLoggedIn(false); // ← přihlášení zamítnuto
    }
  };

  const handleEnterChat = async () => {
    if (!isLoggedIn) {
      setMessage("❌ Musíš se nejprve přihlásit!");
      return;
    }

    if (!chatCode) {
      setMessage("Zadej 4-místný kód!");
      return;
    }

    const result = await sql(`
      SELECT * FROM chats_SMMMSJ
      WHERE chat_code='${chatCode}'
      LIMIT 1
    `);

    if (result && result.length > 0) {
      // mapování kódů na URL chatů
      const chatMap = { 1234: "1", 5678: "2", 9999: "secret" };
      const chatId = chatMap[chatCode];

      if (chatId) {
        navigate(`/chat/${chatId}?code=${chatCode}`);
      }
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
      />
      <br />
      <input
        type="text"
        placeholder="Příjmení"
        value={surname}
        onChange={(e) => setSurname(e.target.value)}
      />
      <br />

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
