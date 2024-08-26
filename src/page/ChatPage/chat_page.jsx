import React, { useState, useRef, useEffect } from "react";
import {
  FaUserCircle,
  FaFacebookMessenger,
  FaVideo,
  FaPhoneAlt,
  FaEllipsisV,
  FaStop,
  FaMicrophone,
  FaUserLock,
  FaFileDownload,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import "./chat_page.scss";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import ContactMessengerItem from "../../layout/ContactMessengerItem/contact_messenger_item";
import { Link } from "react-router-dom";
import { MdDeleteForever, MdPermMedia } from "react-icons/md";
import { LuCopyPlus } from "react-icons/lu";
import { FilePond } from "react-filepond";
import "filepond/dist/filepond.min.css";
import { RiChatVoiceFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import WaveSurfer from "wavesurfer.js";
import Waveform from "../../component/WaveSurfer/wave_surfer";
import { FaSignalMessenger } from "react-icons/fa6";
import Draggable from "react-draggable";
import { ImReply } from "react-icons/im";

function ChatMessengerPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [showFilePond, setShowFilePond] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [messages, setMessages] = useState([]); // State for messages
  const audioChunks = useRef([]);
  const waveformRef = useRef();

  useEffect(() => {
    if (waveformRef.current) {
      const wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
      });
      console.log(wavesurfer);
    }
  }, []);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        audioChunks.current = [];
        handleSendAudio(url); // Send audio when recording stops
      };
    }
  }, [mediaRecorder]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  const handleSend = () => {
    const newMessages = [...messages];
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    if (message.trim()) {
      if (urlRegex.test(message)) {
        const formattedMessage = message.replace(
          urlRegex,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        );
        newMessages.push({ type: "link", content: formattedMessage });
      } else {
        newMessages.push({ type: "text", content: message });
      }
    }

    files.forEach((file) => {
      const url = URL.createObjectURL(file.file);
      const fileType = file.file.type;
      let messageType;

      if (fileType.startsWith("image/")) {
        messageType = "image";
      } else if (fileType.startsWith("video/")) {
        messageType = "video";
      } else if (fileType.startsWith("audio/")) {
        messageType = "audio";
      } else {
        messageType = "other";
      }

      newMessages.push({
        type: messageType,
        content: url,
        name: file.file.name,
      });
    });

    setMessages(newMessages);
    setMessage("");
    setFiles([]);
    setShowFilePond(false);
  };

  const handleSendAudio = (audioUrl) => {
    const newMessages = [...messages, { type: "audio", content: audioUrl }];
    setMessages(newMessages);
  };

  useEffect(() => {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const icon = document.querySelector(".icon-list-chat");
    const sidebar = document.querySelector(".sidebar");

    const handleToggle = () => {
      sidebar.classList.toggle("active");
    };

    if (icon) {
      icon.addEventListener("click", handleToggle);
    }

    return () => {
      if (icon) {
        icon.removeEventListener("click", handleToggle);
      }
    };
  }, []);

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="chat-messenger">
        <Draggable>
          <div>
            <FaSignalMessenger
              className="icon-list-chat"
              style={{ fontSize: "2rem", cursor: "pointer" }}
            />
          </div>
        </Draggable>
        <div className="sidebar">
          <div className="sidebar-header">
            <FaFacebookMessenger size={28} /> Nhắn tin
            <AiOutlineSearch size={24} />
          </div>
          <div className="search-bar">
            <input type="text" placeholder="Tìm kiếm trên Messenger" />
          </div>
          <ul className="chat-list">
            <ContactMessengerItem />
          </ul>
        </div>
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-user-info active">
              <div className="avt-img">
                <img
                  src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg"
                  alt=""
                />
              </div>
              <div>
                <div className="chat-user-name">Dasha Taran</div>
                <div className="chat-user-status">Đang hoạt động</div>
              </div>
            </div>
            <div className="chat-actions">
              <Link
                to="/messenger/audio-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaPhoneAlt />
              </Link>
              <Link
                to="/messenger/video-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaVideo />
              </Link>
              <FaEllipsisV onClick={() => setShowInfo(!showInfo)} />
            </div>
          </div>
          <ul className="chat-messages">
            <li className="message sender">
              <div className="message-content">
                <p>Chào bạn</p>
              </div>
            </li>
            <li className="message">
              <div className="message-content">
                <p>Chào Mạnh</p>
                <ImReply className="reply-icon" />
              </div>
            </li>
            <li className="message sender">
              <div className="message-content reply">
                <p>Chào Mạnh</p>
              </div>
            </li>
            <li className="message sender">
              <div className="message-content">
                <p>Bạn ăn cơm chưa ?</p>
              </div>
            </li>
            {messages.map((msg, index) => (
              <li key={index} className="message sender">
                <div className="message-content">
                  {msg.type === "text" && <p>{msg.content}</p>}
                  {msg.type === "link" && (
                    <p dangerouslySetInnerHTML={{ __html: msg.content }}></p>
                  )}
                  {msg.type === "image" && (
                    <img src={msg.content} alt="content" />
                  )}
                  {msg.type === "video" && (
                    <video controls muted src={msg.content} alt="content" />
                  )}
                  {msg.type === "audio" && <Waveform audioUrl={msg.content} />}
                  {msg.type === "other" && (
                    <div className="file-container">
                      <FaFileDownload />
                      <a href={msg.content} download={msg.name}>
                        {msg.name}
                      </a>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <i style={{ fontSize: "12px" }} className="writting">
            Dasha Taran đang nhắn ...
          </i>
          <div className="reply-context">
            <div className="messenger-reply">
              <p>Chào bạn</p>
            </div>
            <ImReply />
          </div>
          <div className="chat-input">
            {showFilePond && (
              <FilePond
                files={files}
                allowMultiple={true}
                onupdatefiles={setFiles}
                labelIdle='Kéo và Thả tệp phương tiện or <span class="filepond--label-action">Duyệt</span>'
              />
            )}
            {showAudio && (
              <div
                className="hear"
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? (
                  <>
                    <FaStop /> Đang nghe...
                  </>
                ) : (
                  <>
                    <FaMicrophone /> Bấm để ghi âm
                  </>
                )}
              </div>
            )}
            <div className="input-container">
              <RiChatVoiceFill onClick={() => setShowAudio(!showAudio)} />
              <MdPermMedia onClick={() => setShowFilePond(!showFilePond)} />
              <input
                type="text"
                placeholder="Aa"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <div className="btn-func">
                <IoSend className="send-btn" onClick={handleSend} />
              </div>
            </div>
          </div>
        </div>
        {showInfo && (
          <div className="chat-info-panel">
            <div className="user-profile">
              <img
                className="avt-img"
                src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg"
                alt=""
              />
              <div className="user-name">Dương Ánh</div>
              <div className="user-status">Đang hoạt động</div>
              <p className="key-info">
                <FaUserLock /> Mã hóa tin nhắn
              </p>
              <Link>
                <p className="direct-info">
                  <FaUserCircle /> Xem trang cá nhân
                </p>
              </Link>
            </div>
            <div className="chat-info">
              <p>File phương tiện & file</p>
              <ul className="list-media">
                <li>
                  <img
                    src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg"
                    alt=""
                  />
                </li>
                <li>
                  <div className="more">
                    <LuCopyPlus />
                  </div>
                </li>
              </ul>
              <p className="delete">
                <MdDeleteForever /> Xóa đoạn chat
              </p>
            </div>
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default ChatMessengerPage;
