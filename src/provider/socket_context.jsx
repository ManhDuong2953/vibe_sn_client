import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaPhoneAlt, FaPhoneSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { OwnDataContext } from "./own_data";
import { getData } from "../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../API/api_server";
import AudioRing from "../www/mp3/receive-phone-calls-get-a-phone-call-get-called-153318.mp3"; // Đường dẫn đến file âm thanh

// Tạo context
const SocketContext = createContext();

// URL server của bạn, thay đổi nếu cần
const SOCKET_URL = process.env.REACT_APP_PORT_SOCKET;

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const dataOwner = useContext(OwnDataContext);
  const audioRef = useRef(null); // Tạo tham chiếu cho audio
  const [isCalling, setIsCalling] = useState(false); // Trạng thái gọi

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Cleanup khi component bị unmount
    return () => {
      newSocket.close();
    };
  }, [SOCKET_URL]);

  const handleAccept = (data) => {
    if (socket) {
      socket.emit("acceptCallUser", {
        status: "Accepted",
        ...data,
      });
      navigate(data?.link_call);
      stopAudio(); // Dừng âm thanh khi nhận cuộc gọi
      setIsCalling(false); // Đặt trạng thái gọi thành false
    }
  };

  const handleDecline = (data) => {
    toast("Bạn đã từ chối cuộc gọi");
    if (socket) {
      socket.emit("acceptCallUser", {
        status: "Declined",
        ...data,
      });
      stopAudio(); // Dừng âm thanh khi từ chối
      setIsCalling(false); // Đặt trạng thái gọi thành false
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Reset âm thanh về đầu
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }
  };

  const getInfoCaller = async (sender_id) => {
    try {
      const response = await getData(
        API_GET_INFO_USER_PROFILE_BY_ID(sender_id)
      );
      if (response?.status) {
        return response?.data;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    if (socket && dataOwner) {
      socket.emit("registerUser", { user_id: dataOwner?.user_id });
      socket.on("statusCallToUser", (data) => {
        if (data.isCallRemoteAccepted === false) {
          toast.dismiss();
        }
      });

      socket.on("user-calling", async (data) => {
        if (data && dataOwner && data?.receiver_id === dataOwner?.user_id) {
          const callerInfo = await getInfoCaller(data?.sender_id);
          if (callerInfo) {
            setIsCalling(true); // Đặt trạng thái gọi thành true
            // playAudio(); // Phát âm thanh khi có cuộc gọi đến
            toast.info(
              ({ closeToast }) => (
                <div>
                  <p>
                    <b style={{ color: "green" }}>{callerInfo.user_name}</b>{" "}
                    đang gọi cho bạn!
                  </p>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#4CAF50", // Màu xanh cho nút nghe
                        color: "white",
                        padding: "6px 10px",
                        fontSize: "12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={() => {
                        handleAccept(data);
                        closeToast();
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#45A049")
                      } // Thay đổi màu khi hover
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#4CAF50")
                      }
                    >
                      <FaPhoneAlt style={{ marginRight: "5px" }} />
                      Nghe
                    </button>
                    <button
                      style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#F44336", // Màu đỏ cho nút từ chối
                        color: "white",
                        padding: "6px 10px",
                        fontSize: "12px",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      }}
                      onClick={() => {
                        handleDecline(data);
                        closeToast();
                      }}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#E53935")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#F44336")
                      }
                    >
                      <FaPhoneSlash style={{ marginRight: "5px" }} />
                      Từ chối
                    </button>
                  </div>
                </div>
              ),
              {
                position: "top-right",
                autoClose: 60000, // Tự động đóng sau 60 giây
                closeOnClick: true,
                hideProgressBar: false, // Hiển thị thanh tiến trình
                icon: false, // Ẩn icon mặc định của toast
                onClose: stopAudio, // Dừng âm thanh khi toast đóng
              }
            );
          }
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("user-calling"); // Cleanup listener khi socket thay đổi hoặc component unmount
      }
    };
  }, [dataOwner, socket]);

  return (
    <>
      <audio ref={audioRef} src={AudioRing} />
      <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
    </>
  );
};

// Hook để dùng socket ở các component khác
export const useSocket = () => {
  return useContext(SocketContext);
};
