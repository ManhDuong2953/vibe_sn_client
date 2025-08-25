import React, { useState, useRef, useEffect } from "react";
import "./box_chat_ai.scss";
import generateContent from "../../config/ai_studio.config";
import icon from "../../www/icons/chatboxicon.png";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Chào bạn! Mình là Vibe Chatbox AI, hãy nhắn gì đó cho mình!",
    },
  ]);
  const chatEndRef = useRef(null);

  const toggleChatbox = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  const sendMessage = async (text) => {
    // Thêm tin nhắn của người dùng
    setMessages((prev) => [...prev, { sender: "user", text }]);
    scrollToBottom();

    // Chatbot đang trả lời
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Chatbot đang trả lời..." },
    ]);
    scrollToBottom();

    const aiReply = await generateContent(text);

    // Cập nhật câu trả lời từ AI
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { sender: "bot", text: aiReply },
    ]);
    scrollToBottom();
  };

  return (
    <div className="chatbox">
      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <span>Vibe AI</span>
            <button onClick={toggleChatbox} className="chatbox-close">
              &times;
            </button>
          </div>
          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbox-message ${
                  msg.sender === "user" ? "user" : "bot"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>
          <div className="chatbox-footer">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  sendMessage(e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      )}
      <img
        onError={(e) => {
          e.target.src =
            "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
        }}
        src={icon}
        alt="avatar"
        className="chatbox-toggle"
        onClick={toggleChatbox}
      />
    </div>
  );
}
