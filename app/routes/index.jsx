import React, { useState } from "react";
import { sql } from "../api/sql";

export default function App() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [chatCode, setChatCode] = useState("");
  const [message, setMessage] = useState("");

  // Registrace uživatele
  const handleRegister = async () => {
    if (!name || !surname) {
      setMessage("Vyplň jméno i příjmení!");
      return;
    }

    const query = `
      INSERT INTO users_SMMMSJ (name, surname)
      VALUES ('${name}', '${surname}')
    `;
    await sql(query);
    setMessage("✅ Registrace úspěšná!");
  };

  // Login uživatele
  const handleLogin = async () => {
    if (!name || !surname) {
      setMessage("Vyplň jméno i příjmení!");
      return;
    }

    const query = `
      SELECT * FROM users_SMMMSJ
      WHERE name='${name}' AND surname='${surname}'
      LIMIT 1
    `;
    const result = await sql(query);
    if (result && result.length > 0) {
      setMessage("✅ Přihlášení úspěšné!");
    } else {
      setMessage("❌ Uživatel nenalezen.");
    }
  };

  // Připojení do chatu podle kódu
  const handleEnterChat = async () => {
    if (!chatCode) {
      setMessage("Zadej 4místný kód!");
      return;
    }

    const query = `
      SELECT * FROM chats_SMMMSJ
      WHERE chat_code='${chatCode}'
      LIMIT 1
    `;
    const result = await sql(query);
    if (result && result.length > 0) {
      setMessage(`✅ Připojen do chatu s kódem ${chatCode}`);
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
