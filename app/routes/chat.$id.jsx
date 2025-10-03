import { useParams, useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { sql } from "../api/sql";

export default function Chat() {
  const { id } = useParams(); // chatCode z URL
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("chatUser"));
  const bottomRef = useRef(null);

  // Načíst zprávy z DB
  const loadMessages = async () => {
    if (!id) return;
    const result = await sql(`
      SELECT * FROM chats_SMMMSJ
      WHERE chat_code='${id}'
      ORDER BY time ASC, id ASC
    `);

    if (Array.isArray(result)) setMessages(result);
  };

  // Poslat zprávu
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    const fullMsg = `${user.name} ${user.surname}: ${newMessage}`;
    await sql(`
      INSERT INTO chats_SMMMSJ (chat_code, messages, time)
      VALUES ('${id}', '${fullMsg}', NOW())
    `);

    setNewMessage("");
    loadMessages();
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "0 auto" }}>
      <h1>💬 Chat {id}</h1>
      <button
        onClick={() => navigate("/")}
        style={{ marginBottom: "1rem" }}>
        🔑 Přejít do jiného chatu
      </button>

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
        }}>
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
              }}>
              <span>{m.messages}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

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
          }}>
          Odeslat
        </button>
      </div>
    </div>
  );
}
