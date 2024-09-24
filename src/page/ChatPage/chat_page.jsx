import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
} from "react";
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
import { Link, useParams } from "react-router-dom";
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
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import { IoMdCloseCircle } from "react-icons/io";
import {
  API_CREATE_KEYSPAIR,
  API_DELETE_KEYS_PAIR,
  API_GET_ALL_MESSAGE,
  API_GET_INFO_USER_PROFILE_BY_ID,
  API_GET_PRIVATE_KEY,
  API_IS_EXIST_KEYSPAIR,
  API_SEND_MESSAGE,
} from "../../API/api_server";
import { deleteData, getData, postData } from "../../ultils/fetchAPI/fetch_API";

function ChatMessengerPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State for messages
  const { id_receiver } = useParams();
  const [files, setFiles] = useState([]);
  const [showFilePond, setShowFilePond] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [infoReceiver, setInfoReceiver] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const audioChunks = useRef([]);
  const waveformRef = useRef();
  const socket = useSocket();
  const dataOwner = useContext(OwnDataContext);
  const [isVerifiedCode, setIsVerifiedCode] = useState(false);
  const [isHasCode, setIsHasCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [PIN, setPIN] = useState(["", "", "", "", "", ""]);
  const private_key = localStorage.getItem("private_key");
  const [isOnline, setIsOnline] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    if (socket && dataOwner && id_receiver) {
      socket.emit("registerUser", { user_id: dataOwner?.user_id });

      // Kiểm tra trạng thái online khi component được mount
      socket.on("onlineUsers", (data) => {
        setIsOnline(data.includes(id_receiver));
      });

      const getAllMessages = async () => {
        try {
          const response = await postData(API_GET_ALL_MESSAGE(id_receiver), {
            private_key: localStorage.getItem("private_key"),
          });
          if (response?.status === true) {
            setMessages(response?.data);
          }
        } catch (error) {
          console.log("Error: " + error);
        }
      };

      getAllMessages();

      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender_id: data?.sender_id,
            receiver_id: id_receiver,
            content_text: data?.content_text,
            content_type: data?.content_type,
            name_file: data?.name_file ?? "Không xác định",
          },
        ]);
        setMessage(""); // Reset input
      });

      // Dọn dẹp khi component bị hủy
      return () => {
        socket.off("connect");
        socket.off("registerUser");
        socket.off("onlineUsers");
      };
    }
  }, [socket, dataOwner, id_receiver]);
  console.log("messages: ", messages);

  useEffect(() => {
    const getDataReceiver = async () => {
      try {
        if (id_receiver) {
          const response = await getData(
            API_GET_INFO_USER_PROFILE_BY_ID(id_receiver)
          );
          if (response?.status) {
            setInfoReceiver(response?.data);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getDataReceiver();
  }, []);

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

  const handleSendAudio = (audioUrl) => {
    const newMessages = [
      ...messages,
      {
        content_type: "audio",
        content_text: audioUrl,
        sender_id: dataOwner && dataOwner?.user_id,
        receiver_id: id_receiver,
      },
    ];
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

  //PIN Input

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return; // Chỉ chấp nhận 1 ký tự mỗi ô

    const newPIN = [...PIN];
    newPIN[index] = value;
    setPIN(newPIN);

    if (value && index < PIN.length - 1) {
      document.getElementById(`PIN-input-${index + 1}`).focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !PIN[index] && index > 0) {
      document.getElementById(`PIN-input-${index - 1}`).focus();
    }
  };

  const verifyPIN = () => {
    if (PIN.every((digit) => digit !== "")) {
      getPrivateKey();
    } else {
      alert("Điền mã xác thực hợp lệ!");
    }
  };

  //Kiểm tra nếu người dùng đã có cặp key, lấy privatekey
  const getPrivateKey = async () => {
    try {
      setLoading(false);
      if (isHasCode) {
        const response = await postData(API_GET_PRIVATE_KEY, {
          code: PIN.join(""),
        });
        setLoading(true);
        if (response?.status) {
          if (response?.data?.private_key) {
            localStorage.setItem("private_key", response?.data?.private_key);
            window.location.reload();
          }
        }
      }
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };

  //Tạo cặp key
  const handleCreateKeyPair = async () => {
    try {
      setLoading(true);
      const response = await postData(API_CREATE_KEYSPAIR, {
        code: PIN.join(""),
      });
      setLoading(false);
      if (response.status) {
        setIsHasCode(true);
      } else {
        alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  //Check xem người dùng đã có cặp key chưa
  const checkExistKeyPair = async () => {
    try {
      if (!isVerifiedCode) {
        // nếu chưa verify
        const response = await getData(API_IS_EXIST_KEYSPAIR);
        console.log(response);

        if (response?.status) {
          setIsHasCode(true);
          getPrivateKey();
        } else {
          setIsHasCode(false);
        }
      } else {
        setIsHasCode(true);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const handleChanglePIN = async () => {
    if (window.confirm("Dữ liệu tin nhắn trước đó của bạn sẽ mất vĩnh viễn?")) {
      try {
        const response = await deleteData(API_DELETE_KEYS_PAIR);
        if (response?.status) {
          localStorage.clear();
          window.location.reload();
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  };

  useEffect(() => {
    if (private_key && private_key !== undefined) {
      setIsVerifiedCode(true);
    } else {
      checkExistKeyPair();
    }
  }, []);

  // Gửi tin nhắn
  const handleSend = async () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Kiểm tra nếu tin nhắn là văn bản
    let newMessage = {};
    if (message.trim()) {
      if (urlRegex.test(message)) {
        const formattedMessage = message.replace(
          urlRegex,
          (url) =>
            `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
        );
        newMessage = {
          content_type: "link",
          content_text: formattedMessage,
          sender_id: dataOwner?.user_id,
          receiver_id: id_receiver,
        };
      } else {
        newMessage = {
          content_type: "text",
          content_text: message,
          sender_id: dataOwner?.user_id,
          receiver_id: id_receiver,
        };
      }

      // Gửi tin nhắn văn bản qua API
      try {
        await postData(API_SEND_MESSAGE(id_receiver), {
          content_type: newMessage.content_type,
          content_text: newMessage.content_text,
          sender_id: newMessage.sender_id,
          receiver_id: newMessage.receiver_id,
        });
      } catch (error) {
        console.log("Error sending text message: ", error);
      }
    }

    // Xử lý gửi từng file
    if (files.length > 0) {
      for (const file of files) {
        const formData = new FormData();
        const fileType = file.file.type;

        // Tạo link tạm thời cho file
        const localFileURL = URL.createObjectURL(file.file);

        // Xác định loại file
        let contentType;
        if (fileType.startsWith("image/")) {
          contentType = "image";
        } else if (fileType.startsWith("video/")) {
          contentType = "video";
        } else if (fileType.startsWith("audio/")) {
          contentType = "audio";
        } else {
          contentType = "other";
        }

        // Append file vào FormData
        formData.append("file", file.file, file.file.name); // Thay đổi key cho phù hợp

        // Append các thông tin khác vào FormData
        formData.append("content_type", contentType);
        formData.append("content_text", file.file.name); // Hoặc tên file nếu cần
        formData.append("sender_id", dataOwner?.user_id);
        formData.append("receiver_id", id_receiver);

        // Gửi từng file qua API
        try {
          await postData(API_SEND_MESSAGE(id_receiver), formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          // Thêm tin nhắn vào state với link tạm thời
          const fileMessage = {
            content_type: contentType,
            content_text: localFileURL, // Sử dụng link tạm thời
            sender_id: dataOwner?.user_id,
            receiver_id: id_receiver,
            name_file: file.file.name ?? "Không xác định",
          };

          setMessages((prevMessages) => [...prevMessages, fileMessage]);
        } catch (error) {
          console.log("Error sending file: ", error);
        }
      }
    }

    // Cập nhật tin nhắn vào state với tin nhắn văn bản
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Reset lại input và tệp tin
    setMessage(""); // Reset input
    setFiles([]);
    setShowFilePond(false);
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      {isVerifiedCode ? (
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
                <div className={`avt-img ${isOnline ? "online" : ""}`}>
                  <img src={infoReceiver && infoReceiver?.avatar} alt="" />
                </div>
                <div>
                  <div className="chat-user-name">
                    {infoReceiver && infoReceiver?.user_name}
                  </div>
                  <div className="chat-user-status">
                    {isOnline ? "Đang hoạt động" : "Đã đóng cửa sổ chat"}
                  </div>
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
              {messages.map((msg, index) => (
                <li
                  key={index}
                  className={`message ${
                    msg.sender_id === dataOwner?.user_id ? "sender" : ""
                  }`}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <div className="message-content">
                    {msg.content_type === "text" && <p>{msg.content_text}</p>}
                    {msg.content_type === "link" && (
                      <p
                        dangerouslySetInnerHTML={{ __html: msg.content_text }}
                      ></p>
                    )}
                    {msg.content_type === "image" && (
                      <a download href={msg.content_text}>
                        <img src={msg.content_text} alt="content" />
                      </a>
                    )}
                    {msg.content_type === "video" && (
                      <a download href={msg.content_text}>
                        <video
                          controls
                          muted
                          src={msg.content_text}
                          alt="content"
                        />
                      </a>
                    )}
                    {msg.content_type === "audio" && (
                      <a download href={msg.content_text}>
                        {" "}
                        <Waveform audioUrl={msg.content_text} />
                      </a>
                    )}
                    {msg.content_type === "other" && (
                      <div className="file-container">
                        <FaFileDownload />
                        <a href={msg.content_text} download>
                          {msg.name_file}
                        </a>
                      </div>
                    )}
                  </div>
                  {hoveredIndex === index && (
                    <div className="reply-icon-message">
                      <ImReply />
                    </div>
                  )}
                </li>
              ))}
            </ul>

            <i style={{ fontSize: "12px" }} className="writting">
              Dasha Taran đang nhắn ...
            </i>
            <div className="reply-context">
              <IoMdCloseCircle className="close-reply-message" />
              <div className="left-reply">
                <div className="messenger-reply">
                  <p>Chào bạn</p>
                </div>
                <ImReply />
              </div>
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
      ) : (
        <div className="container-PIN">
          <h1 className="title">Vui lòng nhập mã xác thực Mã hoá đầu cuối</h1>
          <form id="PIN-form">
            {PIN.map((digit, index) => (
              <input
                key={index}
                id={`PIN-input-${index}`}
                type="text"
                className="PIN-input"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
              />
            ))}
          </form>
          <p
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
              textAlign: "center",
            }}
            className="text-danger"
          >
            * Mã xác thực cần được ghi nhớ để giải mã tin nhắn cũ
          </p>
          {isHasCode && (
            <button
              id="verify-btn"
              style={{ backgroundColor: "red", marginRight: "4px" }}
              onClick={handleChanglePIN}
            >
              Đổi mã PIN
            </button>
          )}
          {isHasCode ? (
            <button id="verify-btn" onClick={verifyPIN}>
              Xác thực
            </button>
          ) : (
            <button
              disabled={loading}
              id="verify-btn"
              onClick={handleCreateKeyPair}
            >
              Tạo mã xác thực
            </button>
          )}
        </div>
      )}
    </React.Fragment>
  );
}

export default ChatMessengerPage;
