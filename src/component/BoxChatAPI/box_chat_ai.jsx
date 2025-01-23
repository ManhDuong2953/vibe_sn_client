import React, { useState, useRef, useEffect } from "react";
import "./box_chat_ai.scss";
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

  const toggleChatbox = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [isOpen]);

  // Hàm escape HTML để bảo vệ và hiển thị nội dung an toàn
  const escapeHTML = (html) => {
    return html
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  // Hàm xử lý response từ AI và render nội dung
  const processResponse = (text) => {
    const codeRegex = /```(\w*)\n([\s\S]*?)```/; // Regex tìm code Markdown
    const match = text.match(codeRegex);

    if (match) {
      const language = match[1]; // Ngôn ngữ (html, js, ...)
      const codeContent = match[2]; // Nội dung code
      return `<pre><code class="language-${language}">${escapeHTML(
        codeContent
      )}</code></pre>`;
    }

    // Nếu không phải mã code, trả về nội dung dạng văn bản
    return `<div>${escapeHTML(text)}</div>`;
  };

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
            <span>Vibe Chat</span>
            <button onClick={toggleChatbox} className="chatbox-close">
              &times;
            </button>
          </div>
          <div className="chatbox-body">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chatbox-message ${msg.sender === "user" ? "user" : "bot"
                  }`}
                dangerouslySetInnerHTML={{
                  __html:
                    msg.sender === "bot"
                      ? processResponse(msg.text) // Xử lý nội dung trả về từ AI
                      : `<div>${escapeHTML(msg.text)}</div>`, // Escape nội dung người dùng
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
