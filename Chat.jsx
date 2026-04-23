import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

// ✅ Create socket ONLY once
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default function Chat() {
  const { sessionId } = useParams();
  const { user } = useAuth();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const chatEndRef = useRef(null);

  // ✅ Join room
  useEffect(() => {
    if (sessionId) {
      socket.emit("joinRoom", String(sessionId));
    }
  }, [sessionId]);

  // ✅ Receive messages (NO DUPLICATES)
  useEffect(() => {
    const handleMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);

  // ✅ Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = () => {
    if (!message.trim()) return;

    const data = {
      roomId: String(sessionId),
      message: message,
      sender: user?.name || "User",
    };

    socket.emit("sendMessage", data);

    // ❌ DO NOT add manually → prevents duplicates
    setMessage("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Session Chat</h2>

      {/* Chat box */}
      <div
        style={{
          border: "1px solid #ddd",
          height: "350px",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map((msg, index) => {
          const isMe = msg.sender === user?.name;

          return (
            <div
              key={index}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                background: isMe ? "#007bff" : "#eee",
                color: isMe ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "10px",
                marginBottom: "6px",
                maxWidth: "60%",
              }}
            >
              {!isMe && (
                <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                  {msg.sender}
                </div>
              )}
              {msg.message}
            </div>
          );
        })}

        {/* 🔽 Auto scroll target */}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex" }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type message..."
          style={{
            flex: 1,
            marginRight: "10px",
            padding: "10px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            background: "#28a745",
            color: "white",
            padding: "10px 20px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}