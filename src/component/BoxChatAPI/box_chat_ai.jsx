import React, { useState, useRef, useEffect } from "react";
import "./box_chat_ai.scss"; // Style kéo thả trong đây
import generateContent from "../../config/ai_studio.config";
import icon from "../../www/icons/chatboxicon.png";

export default function Chatbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Chào bạn! Mình là Vibe! Bạn cần giúp gì không?",
    },
  ]);
  const chatEndRef = useRef(null);
  const chatboxRef = useRef(null);

  const toggleChatbox = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen, messages]);

  // Escape HTML để tránh lỗi XSS
  const escapeHTML = (html) => {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const processResponse = (text) => {
    const codeRegex = /```(\w*)\n([\s\S]*?)```/;
    const match = text.match(codeRegex);

    if (match) {
      const language = match[1];
      const codeContent = match[2];
      return `<pre><code class="language-${language}">${escapeHTML(
        codeContent
      )}</code></pre>`;
    }
    return `<div>${escapeHTML(text)}</div>`;
  };

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    scrollToBottom();

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Chatbot đang trả lời..." },
    ]);
    scrollToBottom();

    const aiReply = await generateContent(text);

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { sender: "bot", text: aiReply },
    ]);
    scrollToBottom();
  };

  // Kéo thả Chatbox
  useEffect(() => {
    const chatbox = chatboxRef.current;
    if (!chatbox) return;

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    const handleMouseDown = (e) => {
      isDragging = true;
      offsetX = e.clientX - chatbox.getBoundingClientRect().left;
      offsetY = e.clientY - chatbox.getBoundingClientRect().top;
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      chatbox.style.left = `${e.clientX - offsetX}px`;
      chatbox.style.top = `${e.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      isDragging = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    const header = chatbox.querySelector(".chatbox-header");
    if (header) {
      header.style.cursor = "move";
      header.addEventListener("mousedown", handleMouseDown);
    }

    return () => {
      if (header) header.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen]);

  return (
    <div className="chatbox">
      {isOpen && (
        <div
          className="chatbox-container"
          ref={chatboxRef}
          style={{ position: "absolute", top: "100px", left: "100px" }}
        >
          <div className="chatbox-header">
            <span>Vibe Chat</span>
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
                dangerouslySetInnerHTML={{
                  __html:
                    msg.sender === "bot"
                      ? processResponse(msg.text)
                      : `<div>${escapeHTML(msg.text)}</div>`,
                }}
              />
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
        src={icon}
        alt="avatar"
        className="chatbox-toggle"
        onClick={toggleChatbox}
      />
    </div>
  );
}
