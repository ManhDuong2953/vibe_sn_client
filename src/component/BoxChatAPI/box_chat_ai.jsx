import React, { useState, useRef, useEffect } from "react";
import "./box_chat_ai.scss";
import generateContent from "../../config/ai_studio.config";


export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Chào bạn! Mình là AiStudio ChatBox, hãy nhắn gì đó cho mình!",
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
    setMessages((prev) => [...prev.slice(0, -1), { sender: "bot", text: aiReply }]);
    scrollToBottom();
  };

  return (
    <div className="chatbox">
      {isOpen && (
        <div className="chatbox-container">
          <div className="chatbox-header">
            <span>AiStudio ChatBox</span>
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
        src="https://png.pngtree.com/png-vector/20230104/ourmid/pngtree-chatbot-customer-service-clipart-element-png-image_6551134.png"
        alt="avatar"
        className="chatbox-toggle"
        onClick={toggleChatbox}
      />
    </div>
  );
}
