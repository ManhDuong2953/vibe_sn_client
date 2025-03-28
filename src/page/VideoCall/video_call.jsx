import React, {
  useReducer,
  useRef,
  useEffect,
  useContext,
  useState,
} from "react";
import "./video_call.scss";
import {
  FaVideoSlash,
  FaVideo,
  FaMicrophoneSlash,
  FaMicrophone,
  FaPhoneAlt,
} from "react-icons/fa";
import { getURLParam } from "../../ultils/getParamURL/get_param_URL";
import { getData, postData } from "../../ultils/fetchAPI/fetch_API";
import {
  API_GET_INFO_USER_PROFILE_BY_ID,
  API_SEND_MESSAGE,
} from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import Peer from "peerjs";
import { toast } from "react-toastify";
import ToolTipCustom from "../../component/ToolTip/tool_tip";
import { formatSecondsToTime } from "../../ultils/formatDate/format_date";

const VideoCall = ({ isVideoCall = true, titlePage }) => {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const initialState = {
    isCallAccepted: true,
    isVideoMuted: !isVideoCall,
    isAudioMuted: false,
  };

  const callReducer = (state, action) => {
    switch (action.type) {
      case "ACCEPT_CALL":
        return { ...state, isCallAccepted: true };
      case "TOGGLE_VIDEO":
        return { ...state, isVideoMuted: !state.isVideoMuted };
      case "TOGGLE_AUDIO":
        return { ...state, isAudioMuted: !state.isAudioMuted };
      case "END_CALL":
        return { ...state, isCallAccepted: false };
      default:
        return state;
    }
  };

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [state, dispatch] = useReducer(callReducer, initialState);
  const { isCallAccepted, isVideoMuted, isAudioMuted } = state;
  const [stateRemote, setStateRemote] = useState({
    isCallRemoteAccepted: false,
    isVideoRemoteMuted: !isVideoCall,
    isAudioRemoteMuted: false,
  });
  const [callEnded, setCallEnded] = useState(false);
  const [receiver_id, setReceiverID] = useState();
  const [room_id, setRoomID] = useState();
  const [sender_id, setSenderID] = useState();
  const [dataReceiver, setDataReceiver] = useState();
  const [statusCall, setStatusCall] = useState(false);
  const [time, setTime] = useState(0);
  const dataOwner = useContext(OwnDataContext);
  const socket = useSocket();

  // Get URL params
  useEffect(() => {
    const params = getURLParam();
    setSenderID(params?.sender_id);
    setRoomID(params?.ROOM_ID);
    setReceiverID(params?.receiver_id);
  }, []);

  useEffect(() => {
    if (socket && sender_id && receiver_id && dataOwner?.user_id) {
      const handleStatusAccepted = async (data) => {
        if (data?.status === "Accepted") {
          toast("Người nghe đang vào cuộc hội thoại...");
          dispatch({ type: "ACCEPT_CALL" });
          setStatusCall(true);
        } else if (data?.status === "Declined") {
          toast.error("Người nghe đã từ chối gọi...");
          await handleSendMessage("missed");

          window.location.href = `/messenger/${
            dataOwner?.user_id !== sender_id ? sender_id : receiver_id
          }`;
        }
      };

      if (receiver_id === dataOwner?.user_id) {
        setStatusCall(true);
        dispatch({ type: "ACCEPT_CALL" });
      }

      socket.on("statusAcceptedCallUser", handleStatusAccepted);

      return () => {
        socket.off("statusAcceptedCallUser", handleStatusAccepted); // Cleanup on unmount
      };
    }
  }, [socket, receiver_id, sender_id, dataOwner]);

  // Fetch receiver's profile information
  useEffect(() => {
    if (receiver_id && dataOwner) {
      const fetchAPI = async () => {
        try {
          const response = await getData(
            API_GET_INFO_USER_PROFILE_BY_ID(
              dataOwner?.user_id !== sender_id ? sender_id : receiver_id
            )
          );

          if (response?.status === true && response.data?.avatar) {
            const data = response.data;
            setDataReceiver(data);
          }
        } catch (error) {
          console.log("Error: ", error);
        }
      };

      fetchAPI();
    }
  }, [receiver_id, dataOwner]);

  // Initialize PeerJS client and handle stream events
  useEffect(() => {
    if (socket && sender_id && receiver_id && dataOwner) {
      const peer = new Peer(undefined, {
        host: process.env.REACT_APP_HOST,
        port: process.env.REACT_APP_PORT_PEER,
        path: "/peerjs",
      });

      peerRef.current = peer;

      peer.on("open", (id) => {
        socket.emit("getPeerIDCaller", {
          receiver_id: receiver_id,
          sender_id: sender_id,
          peer_id: id,
        });
      });

      socket.on("sendPeerIDCaller", (id) => {
        callPeer(id);
      });

      peer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            localStreamRef.current = stream;
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = stream;
            }

            call.answer(stream);

            call.on("stream", (remoteStream) => {
              if (remoteStream.getVideoTracks().length > 0) {
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream;
                }
              } else {
                console.log("Remote video is not enabled.");
              }

              remoteStream.getVideoTracks()[0].onended = () => {};
            });
          })
          .catch((error) => {
            console.error("Error accessing media devices: ", error);
            toast.error("Failed to access camera or microphone.");
          });
      });

      peer.on("error", (err) => {
        console.error("PeerJS error: ", err);
      });
    }
  }, [socket, receiver_id, sender_id, dataOwner]);

  // End call and navigate back
  const handleEndCall = async () => {
    if (callEnded) return; // Ngăn không cho hàm gọi nhiều lần
    setCallEnded(true); // Đặt cờ để lần sau không gọi lại
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    peerRef.current.destroy();
    socket.emit('endCall', { sender_id, receiver_id });
    if (receiver_id === dataOwner?.user_id) {
      window.location.href = `/messenger/${
        dataOwner?.user_id !== sender_id ? sender_id : receiver_id
      }`;
      return;
    }

    if (statusCall && !callEnded) {
      await handleSendMessage("accepted");
    } else {
      await handleSendMessage("missed");
    }

    if (sender_id && receiver_id && dataOwner) {
      window.location.href = `/messenger/${
        dataOwner?.user_id !== sender_id ? sender_id : receiver_id
      }`;
    }
  };
  // Call another peer by peer ID
  const callPeer = (id) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const call = peerRef.current.call(id, stream);

        call.on("stream", (remoteStream) => {
          if (remoteStream.getVideoTracks().length > 0) {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          } else {
            console.log("Remote video is not enabled.");
          }

          remoteStream.getVideoTracks()[0].onended = () => {};
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
        toast.error("Failed to access camera or microphone.");
      });
  };

  // Sync remote state with the server
  useEffect(() => {
    if (socket && state) {
      socket.emit("statusCall", {
        ...state,
        to: dataOwner?.user_id !== sender_id ? sender_id : receiver_id,
      });
      if (!state.isCallAccepted) {
        handleEndCall();
      }
      socket.on("statusCallToUser", (data) => {
        setStateRemote(data);
        if (statusCall && !data.isCallRemoteAccepted && !state.isCallAccepted) {
          handleEndCall();
        }
      });
      return () => socket.off("statusCallToUser"); // Cleanup khi component unmount
    }
  }, [state]);

  const handleVideoToggle = () => {
    const videoTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "video");

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled; // Toggle the video track

      dispatch({ type: "TOGGLE_VIDEO" }); // Update UI state

      if (videoTrack.enabled) {
        // If the video is re-enabled, renegotiate the stream
        socket.emit("renegotiateStream", {
          peer_id: peerRef.current.id,
          videoEnabled: videoTrack.enabled,
        });
      }
    }
  };

  useEffect(() => {
    if (socket) {
        // Listen for the "callEnded" event from the server
        socket.on('callEnded', (data) => {
            // Navigate the user back to the message screen
            if (dataOwner.user_id === receiver_id) {
                window.location.href = `/messages/${sender_id}`;
            } else if (dataOwner.user_id === sender_id) {
                window.location.href = `/messages/${receiver_id}`;
            }
        });

        return () => {
            socket.off('callEnded');
        };
    }
}, [socket, receiver_id]);  

  const handleSendMessage = async (status) => {
    try {
      if (
        !receiver_id ||
        (time === 0 && status == "accepted") ||
        callEnded ||
        (dataOwner && dataOwner?.userId === receiver_id)
      )
        return;

      await postData(API_SEND_MESSAGE(receiver_id), {
        content_type: `call:${status}`,
        content_text: `${time}`, // Format lại tin nhắn
        sender_id,
      });
    } catch (error) {
      console.log("Error sending call message: ", error);
    }
  };

  // Toggle audio stream
  const handleAudioToggle = () => {
    const audioTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack) {
      // Directly toggle the track's enabled state
      audioTrack.enabled = !audioTrack.enabled;
      dispatch({ type: "TOGGLE_AUDIO" }); // Update the UI state
    }
  };
  // Trong useEffect này, kiểm tra và cập nhật trạng thái khi video bị mute hoặc unmute
  useEffect(() => {
    const avtImage = document.querySelector(".avatar");
    avtImage.style.display = "none"; // ��n ảnh đại diện khi video bị mute

    if (remoteVideoRef.current) {
      if (stateRemote.isVideoRemoteMuted) {
        remoteVideoRef.current.style.display = "none"; // Ẩn video khi video bị mute
        avtImage.style.display = "block"; // ��n ảnh đại diện khi video bị mute
      } else {
        remoteVideoRef.current.style.display = "block"; // Hiển thị video khi video không bị mute
        avtImage.style.display = "none"; // ��n ảnh đại diện khi video bị mute
      }
    }
  }, [stateRemote.isVideoRemoteMuted]);

  useEffect(() => {
    if (statusCall) {
      const timeCounter = setTimeout(() => {
        setTime((time) => time + 1);
      }, 1000);
      return () => clearTimeout(timeCounter);
    }
  }, [time, statusCall]);

  useEffect(() => {
    if (!statusCall) {
      const timeoutId = setTimeout(async () => {
        await handleSendMessage("missed");
        window.location.href = `/messenger/${receiver_id}`;
      }, 60000); // 60 seconds

      // Clear the timeout if the component unmounts or if statusCall becomes true
      return () => clearTimeout(timeoutId);
    }
  }, [statusCall, receiver_id]);
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <React.Fragment>
      <div className="video-call-container">
        <div className="video-wrapper">
          {isVideoCall && (
            <video
              ref={localVideoRef}
              playsInline
              autoPlay
              muted
              className="user-video"
            />
          )}

          {isVideoCall && dataOwner?.user_id === sender_id ? (
            statusCall ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="partner-video"
              />
            ) : (
              <div className="avatar">
                <img
                  src={dataReceiver?.avatar}
                  alt="Avatar"
                  className="partner-avatar"
                />
              </div>
            )
          ) : (
            <>
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="partner-video"
              />
            </>
          )}
          <div className="avatar">
            <img
              src={dataReceiver?.avatar}
              alt="Avatar"
              className="partner-avatar"
            />
          </div>
        </div>
        <div className="time">{formatSecondsToTime(time)}</div>
        <div className="controls">
          {isVideoCall && (
            <ToolTipCustom content={"Bật/Tắt video"}>
              <button className="control-button" onClick={handleVideoToggle}>
                {isVideoMuted ? <FaVideoSlash /> : <FaVideo />}
              </button>
            </ToolTipCustom>
          )}
          <ToolTipCustom content={"Bật/Tắt âm thanh"}>
            <button className="control-button" onClick={handleAudioToggle}>
              {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
            </button>
          </ToolTipCustom>
          <ToolTipCustom content={"Kết thúc cuộc gọi"}>
            <button
              className="control-button end-call"
              onClick={() => dispatch({ type: "END_CALL" })}
            >
              <FaPhoneAlt />
            </button>
          </ToolTipCustom>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VideoCall;
