import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function Chat() {
  const { receiverId, listingId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const socket = useRef(null);
  const bottomRef = useRef(null);

  // Connect Socket
  useEffect(() => {
    socket.current = io("http://localhost:5000");

    socket.current.on("connect", () => {
      console.log("✅ Socket Connected:", socket.current.id);

      socket.current.emit("join-room", listingId);
    });

    socket.current.on("receive-message", (message) => {
      console.log("📩 Received:", message);

      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [listingId]);

  // Load Previous Messages
  useEffect(() => {
    fetchMessages();
  }, [receiverId, listingId]);

  // Auto Scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get(
        `/messages/${receiverId}/${listingId}`
      );

      setMessages(data.messages);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load messages");
    }
  };

  const sendMessage = async () => {
    if (!text.trim()) return;

    try {
      const { data } = await api.post("/messages", {
        receiver: receiverId,
        listing: listingId,
        message: text,
      });

      socket.current.emit("send-message", {
        roomId: listingId,
        ...data.data,
      });

      // Show instantly on sender side
      setMessages((prev) => [...prev, data.data]);

      setText("");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to send message"
      );
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h1>Chat</h1>

      <div
        style={{
          border: "1px solid gray",
          height: "450px",
          overflowY: "auto",
          padding: "20px",
        }}
      >
        {messages.map((msg) => {
          const senderId =
            typeof msg.sender === "string"
              ? msg.sender
              : msg.sender?._id;

          const isMine = senderId === user.id;

          return (
            <div
              key={msg._id}
              style={{
                textAlign: isMine ? "right" : "left",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  background: isMine ? "#EEEEEE" : "#EEEEEE",
                  padding: "10px",
                  borderRadius: "10px",
                  display: "inline-block",
                  maxWidth: "70%",
                }}
              >
                {msg.message}
              </span>
            </div>
          );
        })}

        <div ref={bottomRef}></div>
      </div>

      <br />

      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        style={{
          width: "80%",
          padding: "10px",
        }}
      />

      <button
        onClick={sendMessage}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
        }}
      >
        Send
      </button>
    </div>
  );
}

export default Chat;