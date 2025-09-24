import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { sql } from "../api/sql";

export default function Chat() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("chatUser"));
  const bottomRef = useRef(null);

  // ⬇️ načti zprávy z databáze
  const loadMessages = async () => {
    const query = `
      SELECT * FROM chats_SMMMSJ
      WHERE chat_code='${code}'
      ORDER BY time ASC, id ASC
    `;
    const result = await sql(query);
    if (result) setMessages(result);
  };

  // ⬇️ pošli zprávu do databáze
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const fullMsg = `${user.name} ${user.surname}: ${newMessage}`;
    const query = `
      INSERT INTO chats_SMMMSJ (chat_code, messages, time)
      VALUES ('${code}', '${fullMsg}', NOW())
    `;
    await sql(query);
    setNewMessage("");
    loadMessages(); // refresh po odeslání
  };

  // Auto-scroll na konec
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Refresh zpráv každé 3s
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>💬 Chat {code}</h1>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "1rem" }}
      >
        🔑 Přejít do jiného chatu
      </button>

      {/* Zprávy */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "1rem",
          minHeight: 300,
          maxHeight: 400,
          overflowY: "auto",
          marginBottom: "1rem",
          background: "#fafafa",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ color: "#888" }}>Žádné zprávy...</p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              style={{
                margin: "5px 0",
                padding: "8px 12px",
                borderRadius: "12px",
                background: m.messages.startsWith(
                  `${user?.name} ${user?.surname}`
                )
                  ? "#d1ffd6"
                  : "#fff",
                alignSelf: "flex-start",
                maxWidth: "70%",
                wordWrap: "break-word",
              }}
            >
              <span>{m.messages}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex" }}>
        <input
          type="text"
          placeholder="Napiš zprávu..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Odeslat
        </button>
      </div>
    </div>
  );
}

