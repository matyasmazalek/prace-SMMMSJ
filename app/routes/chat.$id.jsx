import { useParams, useLocation, useNavigate } from "react-router";
import { useState } from "react";

export default function ChatRoom() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  const chatCodes = { 1234: "1", 5678: "2", 9999: "secret" };
  const expectedChatId = chatCodes[code];

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  if (!expectedChatId || expectedChatId !== id) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>🚫 Přístup zamítnut</h1>
        <p>Musíš zadat správný kód na úvodní stránce.</p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { text: newMessage }]);
    setNewMessage("");
  };

  const goToLogin = () => navigate("/");

  return (
    <div style={{ padding: "2rem" }}>
      <h1>💬 Chat {id}</h1>
      <button
        onClick={goToLogin}
        style={{ marginBottom: "1rem" }}>
        🔑 Přejít do jiného chatu
      </button>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          minHeight: 200,
          marginBottom: "1rem",
        }}>
        {messages.length === 0 ? (
          <p style={{ color: "#888" }}>Žádné zprávy...</p>
        ) : (
          messages.map((m, i) => <p key={i}>{m.text}</p>)
        )}
      </div>

      <input
        type="text"
        placeholder="Napiš zprávu..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSendMessage();
        }}
        style={{ width: "80%", marginRight: "1rem" }}
      />
      <button onClick={handleSendMessage}>Odeslat</button>
    </div>
  );
}
