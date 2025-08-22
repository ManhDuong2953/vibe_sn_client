import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useLayoutEffect,
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
  FaUserAltSlash,
} from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import "./chat_page.scss";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import ContactMessengerItem from "../../layout/ContactMessengerItem/contact_messenger_item";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  MdDeleteForever,
  MdPermMedia,
  MdPhoneCallback,
  MdPhoneMissed,
} from "react-icons/md";
import { LuCopyPlus, LuCornerDownRight } from "react-icons/lu";
import { FilePond } from "react-filepond";
// import "filepond/dist/filepond.min.css";
import { RiChatVoiceFill } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import Waveform from "../../component/WaveSurfer/wave_surfer";
import { FaSignalMessenger } from "react-icons/fa6";
import Draggable from "react-draggable";
import { ImReply } from "react-icons/im";
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import { IoMdCloseCircle } from "react-icons/io";
import {
  API_CHECK_KEYSPAIR,
  API_CREATE_KEYSPAIR,
  API_DELETE_ALL_MESSAGE,
  API_DELETE_KEYS_PAIR,
  API_DELETE_MESSAGE,
  API_DELETE_MESSAGE_OWNER_SIDE,
  API_FRIEND_CHECK_BLOCK,
  API_FRIEND_CREATE_BLOCK,
  API_FRIEND_DELETE_BLOCK,
  API_GET_ALL_MESSAGE,
  API_GET_INFO_USER_PROFILE_BY_ID,
  API_GET_PRIVATE_KEY,
  API_IS_EXIST_KEYSPAIR,
  API_SEND_MESSAGE,
} from "../../API/api_server";
import { deleteData, getData, postData } from "../../ultils/fetchAPI/fetch_API";
import { toast } from "react-toastify";
import {
  formatDate,
  formatSecondsToTime,
  timeAgo,
} from "../../ultils/formatDate/format_date";
import ToolTipCustom from "../../component/ToolTip/tool_tip";
import { LoadingIcon } from "../../ultils/icons/loading";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ReplayIcon from "@mui/icons-material/Replay";
import ReplayCircleFilledIcon from "@mui/icons-material/ReplayCircleFilled";
function ChatMessengerPage({ titlePage }) {
  //Tên tiêu đề
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  //Biến lưu trạng thái icon xoá hiện hay không
  const [anchorEl, setAnchorEl] = useState(null);

  // Mở menu khi bấm vào nút
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Đóng menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  //khởi tạo các biến
  const navigate = useNavigate();
  // Khởi tạo socket
  const socket = useSocket();
  //Kiểm tra người dùng có cặp khoá chưa
  const [isHasKeysPairReceiver, setIsHasKeysPairReceiver] = useState("");
  //Set tin nhắn và danh sách tin nhắn
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  //Lấy id người nhận từ URL Params hoặc từ list conversation
  const { id_receiver_param } = useParams();
  const [id_receiver, setIDReceiver] = useState();
  //Danh sách files
  const [files, setFiles] = useState([]);
  //Hiển thị file pond
  const [showFilePond, setShowFilePond] = useState(false);
  //Hiển thị ghi âm
  const [showAudio, setShowAudio] = useState(false);
  //Biến kiểm tra xem có đang ghi âm hay không
  const [isRecording, setIsRecording] = useState(false);
  // Lấy thông tin bản thân
  const dataOwner = useContext(OwnDataContext);
  //Hiển thị thông tin side right
  const [showInfo, setShowInfo] = useState(false);
  //Thông tin người nhận từ API
  const [infoReceiver, setInfoReceiver] = useState();
  // Navigator ghi âm
  const [mediaRecorder, setMediaRecorder] = useState(null);
  // check đã verifying mã PIN chưa thì đi vào trang nhắn tin
  const [isVerifiedCode, setIsVerifiedCode] = useState(false);
  // Check người dùng có mã pin chưa thì gửi mã PIN lên server kiểm rta để trả về private key đã decrypt
  const [isHasCode, setIsHasCode] = useState(false);
  // loading
  const [loading, setLoading] = useState(false);
  const [blockUser, setBlockUser] = useState({});
  const [PIN, setPIN] = useState(["", "", "", "", "", ""]);
  const private_key = localStorage.getItem("private_key");
  // set tin nhắn nào đang được hover
  const [hoveredIndex, setHoveredIndex] = useState(null);
  // check xem người dùng có đang focus input
  const [isTyping, setIsTyping] = useState(false);
  // check xem đối phương có đang focus input
  const [receiverIsTyping, setReceiverIsTyping] = useState(false);
  // Bật tắt reply
  const [showReply, setShowReply] = useState(false);
  //Nội dung reply
  const [idRepLy, setIdRepLy] = useState(null);
  const [contentReply, setContentReply] = useState(null);
  //Danh sách người dùng online
  const [listUsersOnline, setListUsersOnline] = useState([]);
  // tạo ref scroll load cuối trang
  const endOfMessagesRef = useRef(null);
  const [sendLoading, setSendLoading] = useState(false);

  // set id receiver ngay ban đầu nếu có params URL
  useEffect(() => {
    if (id_receiver_param) {
      setIDReceiver(id_receiver_param);
      setShowReply(false);
      setContentReply(null);
      setMessage("");
      setFiles([]);
    }
  }, [id_receiver_param]);

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
      console.error("Error fetching data: ", error);
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
      if (response?.status) {
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

  // người dùng đổi mã PIN
  const handleChanglePIN = async () => {
    if (window.confirm("Dữ liệu tin nhắn trước đó của bạn sẽ mất vĩnh viễn?")) {
      window.location.reload();
      try {
        const response = await deleteData(API_DELETE_KEYS_PAIR);
        if (response?.status === true) {
          localStorage.clear();
        }
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };
  //Kiểm tra người dùng có cặp khoá chưa,và lấy toàn bộ tin nhắn lúc đầu
  useEffect(() => {
    if (id_receiver) {
      const checkReceiverExistKeyPair = async () => {
        try {
          const response = await getData(API_CHECK_KEYSPAIR(id_receiver));
          if (response?.status === true || response?.status === false) {
            setIsHasKeysPairReceiver(response?.status);
          }
        } catch (error) {
          console.error("Error: " + error);
        }
      };
      const getAllMessages = async () => {
        try {
          const response = await postData(API_GET_ALL_MESSAGE(id_receiver), {
            private_key: localStorage.getItem("private_key"),
          });
          if (response?.status === true) {
            const sortedMessages = response?.data
              .filter((msg) => msg.content_text !== null) // Lọc những tin nhắn có content_text khác null
              .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)); // Sắp xếp theo thời gian

            setMessages(sortedMessages);
          }
        } catch (error) {
          console.error("Error: " + error);
        }
      };

      checkReceiverExistKeyPair();
      getAllMessages();
    }
  }, [id_receiver]);
  // Hàm nhóm tin nhắn theo ngày
  const groupMessagesByDate = (messages) => {
    return messages.reduce((groupedMessages, message) => {
      const date = formatDate(new Date(message.created_at), "dd/mm/yy"); // Lấy ngày từ created_at

      if (!groupedMessages[date]) {
        groupedMessages[date] = [];
      }
      groupedMessages[date].push(message);
      return groupedMessages;
    }, {});
  };
  const groupedMessages = groupMessagesByDate(messages);

  // Cuộn đến tin nhắn cuối cùng mỗi khi danh sách tin nhắn thay đổi
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Đăng ký người dùng online và lấy thông tin đối phương
  useEffect(() => {
    if (id_receiver) {
      // Đăng ký sự kiện onlineUsers
      socket.on("onlineUsers", (data) => {
        setListUsersOnline(data);
      });

      // Đăng ký sự kiện onlineUsers
      socket.on("receivedBlockUser", (data) => {
        setBlockUser(data);
      });

      const getDataReceiver = async () => {
        try {
          const response = await getData(
            API_GET_INFO_USER_PROFILE_BY_ID(id_receiver)
          );
          if (response?.status) {
            setInfoReceiver(response?.data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      getDataReceiver();
    }
  }, [id_receiver]);

  // lắng nghe sự kiện nhận tin nhắn
  useEffect(() => {
    if (socket && dataOwner && id_receiver) {
      socket.emit("registerUser", { user_id: dataOwner?.user_id });

      //lắng nghe tin nhắn gửi đến
      socket.on("receiveMessage", (data) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            messenger_id: data?.messenger_id,
            sender_id: data?.sender_id,
            receiver_id: id_receiver,
            content_text: data?.content_text,
            content_type: data?.content_type,
            name_file: data?.name_file ?? "Không xác định",
            reply_messenger_id: data?.reply_messenger_id,
          },
        ]);
        setMessage(""); // Reset input
      });

      // Dọn dẹp khi component bị hủy
      return () => {
        socket.off("connect");
      };
    }
  }, [socket, dataOwner, id_receiver]);

  //Sự kiện có đang nhắn?
  useEffect(() => {
    try {
      //Gửi sự kiện mình đang nhắn
      socket.emit("senderWritting", {
        sender_id: dataOwner?.user_id,
        receiver_id: id_receiver,
        status: isTyping,
      });
      //Lắng nghe sự kiện đối phương nhắn tin
      socket.on("receiverNotifiWritting", (data) => {
        setReceiverIsTyping(data?.status);
      });
    } catch (error) {
      console.error("Error", error);
    }
  }, [isTyping]);

  // bắt đầu ghi âm
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  // Dừng ghi âm
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  //Gửi audio
  const handleSendAudio = async (audioFile) => {
    setLoading(true);
    // Create FormData for the audio file
    const formData = new FormData();

    // Create a temporary local URL for the audio file
    const localAudioURL = URL.createObjectURL(audioFile);

    // Construct the new message object for UI update
    const newMessage = {
      content_type: "audio",
      content_text: localAudioURL,
      sender_id: dataOwner?.user_id,
      receiver_id: id_receiver,
      name_file: audioFile.name ?? "Unknown",
      reply_messenger_id: idRepLy,
    };

    formData.append("file", audioFile, audioFile.name); // Assuming audioFile contains the file object
    formData.append("content_type", "audio");
    formData.append("name_file", audioFile.name);
    formData.append("content_text", Date.now()); // Hoặc tên file nếu cần
    formData.append("sender_id", dataOwner?.user_id);
    formData.append("receiver_id", id_receiver);
    if (showReply) {
      formData.append("reply_messenger_id", idRepLy);
    }
    // Try sending the audio file via API
    try {
      const response = await postData(API_SEND_MESSAGE(id_receiver), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response?.status) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error sending audio message: ", error);
    }
    // Reset lại input và tệp tin
    setMessage(""); // Reset input
    setFiles([]);
    setShowFilePond(false);
    setShowAudio(false);
    setShowReply(false);
    setIdRepLy();
  };

  //Gửi audio nếu có media recorded
  useEffect(() => {
    if (!mediaRecorder) return;

    mediaRecorder.ondataavailable = (event) => {
      const audioBlob = new Blob([event.data], { type: "audio/wav" });
      handleSendAudio(audioBlob);
    };
  }, [mediaRecorder]);

  // SHow side bar list chat
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

  // set người dùng đã có cặp khoá key chưa
  useLayoutEffect(() => {
    if (private_key && private_key !== undefined) {
      setIsVerifiedCode(true);
    } else {
      checkExistKeyPair();
    }
  }, []);

  // Gửi tin nhắn
  const handleSend = async () => {
    setSendLoading(true);
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
          reply_messenger_id: idRepLy,
        };
      } else {
        newMessage = {
          content_type: "text",
          content_text: message,
          sender_id: dataOwner?.user_id,
          receiver_id: id_receiver,
          reply_messenger_id: idRepLy,
        };
      }

      // Gửi tin nhắn văn bản qua API
      try {
        setShowFilePond(false);
        setShowAudio(false);
        setShowReply(false);
        await postData(API_SEND_MESSAGE(id_receiver), {
          content_type: newMessage.content_type,
          content_text: newMessage.content_text,
          sender_id: newMessage.sender_id,
          receiver_id: newMessage.receiver_id,
          reply_messenger_id: newMessage.reply_messenger_id,
        });
      } catch (error) {
        console.error("Error sending text message: ", error);
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
        formData.append("name_file", file.file.name); // Hoặc tên file nếu cần
        formData.append("sender_id", dataOwner?.user_id);
        formData.append("receiver_id", id_receiver);
        if (showReply) {
          formData.append("reply_messenger_id", idRepLy);
        }

        // Gửi từng file qua API
        try {
          setShowFilePond(false);
          setShowAudio(false);
          setShowReply(false);
          await postData(API_SEND_MESSAGE(id_receiver), formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
        } catch (error) {
          console.error("Error sending file: ", error);
        }
      }
    }

    // Cập nhật tin nhắn vào state với tin nhắn văn bản

    // Reset lại input và tệp tin
    setMessage(""); // Reset input
    setFiles([]);

    setIdRepLy();
    setSendLoading(false);
  };

  // sử lý khi ấn call
  const handleClickCall = (type_call) => {
    if (blockUser?.requestor_id) {
      toast.error("Rất tiếc cuộc gọi đã bị chặn");
    } else {
      if (
        socket &&
        id_receiver &&
        dataOwner?.user_id &&
        listUsersOnline &&
        listUsersOnline?.includes(id_receiver)
      ) {
        socket.emit("registerUser", { user_id: dataOwner?.user_id });
        const receiver_id = id_receiver;
        const sender_id = dataOwner?.user_id;
        // Send call notification to the receiver
        socket.emit("callUser", {
          receiver_id,
          sender_id,
          link_call: `/messenger/${type_call}?ROOM_ID=${
            receiver_id + sender_id
          }&sender_id=${sender_id}&receiver_id=${receiver_id}`,
        });

        navigate(
          `/messenger/${type_call}?ROOM_ID=${
            id_receiver + dataOwner?.user_id
          }&sender_id=${dataOwner?.user_id}&receiver_id=${id_receiver}`
        );
      } else {
        toast.info("Người dùng này không trực tuyến!");
      }
    }
  };

  // Focus vào input khi showReply là true
  const inputRef = useRef(null);

  // Focus vào input khi showReply là true
  useEffect(() => {
    if (showReply && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showReply]);

  // Scroll when new messages arrive
  useEffect(() => {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, []); // This runs only once when the page loads

  useEffect(() => {
    const chatMessages = document.querySelector(".chat-messages");
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [messages]); // This runs whenever `messages` change

  const handleSetReply = (reply_messenger_id) => {
    if (reply_messenger_id) {
      const replyElement = document.querySelector(
        `.message-${reply_messenger_id}`
      );
      if (replyElement) {
        setContentReply(replyElement.outerHTML);
      }
    }
  };

  const scrollToMessage = (messageId) => {
    const messageElement = document.querySelector(`.message-${messageId}`);

    if (messageElement) {
      // Lưu lại màu nền ban đầu
      const originalColor = messageElement.style.backgroundColor;
      const highlightColor = "#cbd400c2"; // Màu nhấn mạnh
      let isOriginalColor = false;

      // Cuộn đến phần tử
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });

      // Đặt interval để nhấp nháy
      const intervalId = setInterval(() => {
        messageElement.style.backgroundColor = isOriginalColor
          ? originalColor
          : highlightColor;
        isOriginalColor = !isOriginalColor;
      }, 250); // Mỗi lần nhấp nháy diễn ra sau 300ms

      // Sau 3 giây dừng nhấp nháy và quay lại màu cũ
      setTimeout(() => {
        clearInterval(intervalId);
        messageElement.style.backgroundColor = originalColor;
      }, 1500); // 3000ms = 3s
    }
  };

  //Xoá all đoạn chat
  const handleDeleteAllMessage = async () => {
    try {
      const response = await deleteData(API_DELETE_ALL_MESSAGE(id_receiver));
      if (response?.status) {
        toast.success("Xóa đoạn chat thành công!");
        window.location.href = "/messenger/" + id_receiver;
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Xoá tin nhắn
  const handleDeleteMessage = async (messageId) => {
    try {
      const response = await deleteData(API_DELETE_MESSAGE(messageId));
      if (response?.status) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.messenger_id !== messageId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  //Xoá tin nhắn bên mình
  const handleDeleteMessageOwnSide = async (messageId) => {
    try {
      const response = await deleteData(
        API_DELETE_MESSAGE_OWNER_SIDE(messageId)
      );
      if (response?.status) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.messenger_id !== messageId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlockUser = async () => {
    try {
      const response = await getData(API_FRIEND_CREATE_BLOCK(id_receiver));
      if (response?.status) {
        if (socket) {
          socket.emit("sendBlockUser", {
            requestor_id: dataOwner?.user_id,
            receiver_id: id_receiver,
            status: "block",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBlock = async () => {
    try {
      const response = await deleteData(API_FRIEND_DELETE_BLOCK(id_receiver));
      if (response?.status) {
        if (socket) {
          socket.emit("sendBlockUser", {
            requestor_id: dataOwner?.user_id,
            receiver_id: id_receiver,
            status: "unblock",
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkBlock = async () => {
    try {
      const response = await getData(API_FRIEND_CHECK_BLOCK(id_receiver));
      if (response?.status) {
        setBlockUser(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useLayoutEffect(() => {
    if (!id_receiver) return;
    checkBlock();
  }, [id_receiver]);
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

            <ul className="chat-list">
              <ContactMessengerItem listUsersOnline={listUsersOnline} />
            </ul>~
          </div>
          {id_receiver && (
            <>
              <div className="chat-window">
                <div className="chat-header">
                  <div className="chat-user-info active">
                    <Link
                      to={"/profile/" + (infoReceiver && infoReceiver?.user_id)}
                    >
                      {" "}
                      <div
                        className={`avt-img ${
                          id_receiver &&
                          listUsersOnline &&
                          listUsersOnline?.includes(id_receiver)
                            ? "online"
                            : ""
                        }`}
                      >
                        <img
                          src={infoReceiver && infoReceiver?.avatar}
                          alt=""
                        />
                      </div>
                    </Link>
                    <div>
                      <div className="chat-user-name">
                        {infoReceiver && infoReceiver?.user_name}
                      </div>
                      <div className="chat-user-status">
                        {id_receiver &&
                        listUsersOnline &&
                        listUsersOnline?.includes(id_receiver)
                          ? "Đang hoạt động"
                          : "Đã đóng cửa sổ chat"}
                      </div>
                    </div>
                  </div>
                  <div className="chat-actions">
                    <ToolTipCustom content={"Cuộc gọi thoại"}>
                      <FaPhoneAlt
                        onClick={() => handleClickCall("audio-call")}
                      />
                    </ToolTipCustom>
                    <ToolTipCustom content={"Cuộc gọi Video"}>
                      <FaVideo onClick={() => handleClickCall("video-call")} />
                    </ToolTipCustom>
                    <ToolTipCustom content={"Thông tin người nhận"}>
                      <FaEllipsisV onClick={() => setShowInfo(!showInfo)} />
                    </ToolTipCustom>
                  </div>
                </div>
                <ul className="chat-messages">
                  {Object.keys(groupedMessages).map((date, index) => (
                    <React.Fragment>
                      <li className="message-date" key={index}>
                        {date === formatDate(Date.now(), "dd/mm/yy")
                          ? "Hôm nay"
                          : date === "NaN/NaN/NaN"
                          ? "Tin nhắn chưa đọc"
                          : date}
                      </li>

                      {/* Hiển thị tin nhắn theo từng ngày */}
                      {groupedMessages[date].map((msg, index) => {
                        if (msg && msg.content_text) {
                          return (
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <li
                                key={index}
                                className={`message${
                                  msg.sender_id === dataOwner?.user_id
                                    ? " sender"
                                    : ""
                                }`}
                                onMouseEnter={() =>
                                  setHoveredIndex(msg.messenger_id)
                                }
                                onMouseLeave={() => setHoveredIndex(null)}
                              >
                                <div className="message-container">
                                  {msg.reply_messenger_id && (
                                    <p
                                      className="message-reply"
                                      onClick={() =>
                                        scrollToMessage(msg.reply_messenger_id)
                                      }
                                    >
                                      {
                                        <div
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              document.querySelector(
                                                `.message-${msg.reply_messenger_id}`
                                              )?.outerHTML ?? null,
                                          }}
                                        />
                                      }
                                    </p>
                                  )}
                                  <span>
                                    <div
                                      className={`message-content message-${msg.messenger_id}`}
                                    >
                                      {msg.content_type === "text" && (
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html: msg.content_text,
                                          }}
                                        ></p>
                                      )}
                                      {msg.content_type === "link" && (
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html: msg.content_text,
                                          }}
                                        ></p>
                                      )}
                                      {msg.content_type === "image" && (
                                        <img
                                          src={msg.content_text}
                                          alt="content"
                                        />
                                      )}
                                      {msg.content_type === "video" && (
                                        <video
                                          controls
                                          muted
                                          src={msg.content_text}
                                          alt="content"
                                        />
                                      )}
                                      {msg.content_type === "audio" && (
                                        <Waveform audioUrl={msg.content_text} />
                                      )}
                                      {msg.content_type === "other" && (
                                        <div className="file-container">
                                          <FaFileDownload />
                                          <a href={msg.content_text} download>
                                            {msg.name_file}
                                          </a>
                                        </div>
                                      )}
                                      {msg.content_type?.includes("call") && (
                                        <div className="call-container">
                                          {msg.content_type?.includes(
                                            "missed"
                                          ) && (
                                            <>
                                              <div className="missed-container">
                                                <MdPhoneMissed className="missed" />
                                                <p>Cuộc gọi nhỡ</p>
                                              </div>

                                              <button
                                                onClick={() =>
                                                  handleClickCall("video-call")
                                                }
                                              >
                                                GỌI LẠI
                                              </button>
                                            </>
                                          )}
                                          {msg.content_type?.includes(
                                            "accepted"
                                          ) && (
                                            <>
                                              <MdPhoneCallback className="accepted" />
                                              <p>
                                                Cuộc gọi thoại{" "}
                                                <b>
                                                  {formatSecondsToTime(
                                                    msg.content_text
                                                  )}
                                                </b>
                                              </p>
                                            </>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    {hoveredIndex === msg.messenger_id && (
                                      <div className="icon-container">
                                        <div
                                          className="reply-icon-message"
                                          onClick={() => {
                                            setShowReply(true);
                                            setIdRepLy(msg.messenger_id);
                                            handleSetReply(msg.messenger_id);
                                          }}
                                        >
                                          <ImReply />
                                        </div>
                                        <div className="delete_icon">
                                          <div>
                                            <IconButton onClick={handleClick}>
                                              <DeleteOutlineRoundedIcon />
                                            </IconButton>
                                            <Menu
                                              anchorEl={anchorEl}
                                              open={Boolean(anchorEl)}
                                              onClick={handleClose}
                                              sx={{
                                                "& .MuiPaper-root": {
                                                  backgroundColor: "#333", // Màu nền menu
                                                  color: "#fff", // Màu chữ
                                                },
                                              }}
                                            >
                                              <MenuItem
                                                onClose={handleClose}
                                                sx={{
                                                  "&:hover": {
                                                    backgroundColor: "#555",
                                                  }, // Màu khi hover
                                                  color: "#fff", // Màu chữ
                                                }}
                                                onClick={() =>
                                                  handleDeleteMessageOwnSide(
                                                    msg.messenger_id
                                                  )
                                                }
                                              >
                                                <ReplayCircleFilledIcon /> Thu
                                                hồi ở phía bạn
                                              </MenuItem>
                                              {dataOwner?.user_id ===
                                                msg?.sender_id && (
                                                <MenuItem
                                                  onClick={() =>
                                                    handleDeleteMessage(
                                                      msg.messenger_id
                                                    )
                                                  }
                                                  sx={{
                                                    "&:hover": {
                                                      backgroundColor: "#555",
                                                    },
                                                    color: "#fff",
                                                  }}
                                                >
                                                  <ReplayIcon /> Thu hồi ở mọi
                                                  người
                                                </MenuItem>
                                              )}
                                            </Menu>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </span>
                                </div>
                              </li>
                              <div
                                className={`time_message ${
                                  msg.sender_id === dataOwner?.user_id
                                    ? " sender"
                                    : ""
                                }`}
                              >
                                {timeAgo(msg.created_at)}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </React.Fragment>
                  ))}
                  <li ref={endOfMessagesRef} className="last-msg"></li>
                </ul>
                {receiverIsTyping && (
                  <i style={{ fontSize: "12px" }} className="writting">
                    {infoReceiver && infoReceiver?.user_name} đang nhắn ...
                  </i>
                )}
                {showReply && (
                  <div className="reply-context">
                    <IoMdCloseCircle
                      className="close-reply-message"
                      onClick={() => {
                        setContentReply(null);
                        setIdRepLy(null);
                        setShowReply(false);
                      }}
                    />
                    <div className="left-reply">
                      <LuCornerDownRight />
                      <div className="messenger-reply">
                        {
                          <div
                            dangerouslySetInnerHTML={{ __html: contentReply }}
                          />
                        }
                      </div>
                    </div>
                  </div>
                )}
                {isHasKeysPairReceiver ? (
                  blockUser?.receiver_id ? (
                    <h5 className="text-center">
                      Hiện bạn không thể trò chuyện trực tiếp với người này vì
                      kết nối đã bị chặn.
                    </h5>
                  ) : (
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
                          {loading ? (
                            <LoadingIcon />
                          ) : isRecording ? (
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
                        <RiChatVoiceFill
                          onClick={() => setShowAudio(!showAudio)}
                        />
                        <MdPermMedia
                          onClick={() => setShowFilePond(!showFilePond)}
                        />
                        <input
                          autoFocus={true}
                          ref={inputRef}
                          type="text"
                          placeholder="Aa"
                          onFocus={() => setIsTyping(true)}
                          onBlur={() => setIsTyping(false)}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) =>
                            !sendLoading && e.key === "Enter" && handleSend()
                          }
                        />
                        {sendLoading ? (
                          <LoadingIcon />
                        ) : (
                          <div className="btn-func">
                            {(message !== "" || files.length > 0) && (
                              <IoSend
                                className="send-btn"
                                onClick={handleSend}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <h5 className="text-center">
                    Người dùng này chưa tạo mã PIN thực hiện mã hoá đầu cuối
                  </h5>
                )}
              </div>
              {showInfo && (
                <div className="chat-info-panel">
                  <div className="user-profile">
                    <img
                      className="avt-img"
                      src={infoReceiver && infoReceiver?.avatar}
                      alt=""
                    />
                    <div className="user-name">
                      {infoReceiver && infoReceiver?.user_name}
                    </div>
                    <div className="user-status">
                      {id_receiver &&
                      listUsersOnline &&
                      listUsersOnline?.includes(id_receiver)
                        ? "Đang hoạt động"
                        : "Đã đóng cửa sổ chat"}
                    </div>
                    <p className="key-info">
                      <FaUserLock />{" "}
                      {isHasKeysPairReceiver
                        ? "Mã hóa tin nhắn"
                        : "Chưa mã hoá"}
                    </p>
                    <Link
                      to={"/profile/" + (infoReceiver && infoReceiver?.user_id)}
                    >
                      <p className="direct-info">
                        <FaUserCircle /> Xem trang cá nhân
                      </p>
                    </Link>
                  </div>
                  <div className="chat-info">
                    <p>File phương tiện & file</p>
                    <ul className="list-media">
                      {messages &&
                        messages.map((msg, index) => {
                          if (msg.content_type === "image") {
                            return (
                              <li>
                                <img src={msg?.content_text} alt="" />
                              </li>
                            );
                          }
                        })}

                      <li>
                        <div className="more">
                          <LuCopyPlus />
                        </div>
                      </li>
                    </ul>
                    <p
                      className="delete"
                      onClick={() => {
                        handleDeleteAllMessage();
                      }}
                    >
                      <MdDeleteForever style={{ marginRight: "5px" }} /> Xóa
                      đoạn chat
                    </p>
                    {blockUser &&
                      blockUser?.requestor_id === dataOwner?.user_id && (
                        <p
                          className="delete"
                          onClick={() => {
                            handleDeleteBlock();
                          }}
                        >
                          <FaUserAltSlash style={{ marginRight: "5px" }} /> Bỏ
                          chặn
                        </p>
                      )}

                    {!blockUser?.requestor_id && (
                      <p
                        className="delete"
                        onClick={() => {
                          handleBlockUser();
                        }}
                      >
                        <FaUserAltSlash style={{ marginRight: "5px" }} /> Chặn
                        người dùng
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
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
