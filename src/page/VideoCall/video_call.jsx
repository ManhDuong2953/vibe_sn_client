import React, { useRef, useState, useEffect, useContext } from "react";
import "./video_call.scss";
import {
  FaVideoSlash,
  FaVideo,
  FaMicrophoneSlash,
  FaMicrophone,
  FaPhoneAlt,
} from "react-icons/fa";
import { getURLParam } from "../../ultils/getParamURL/get_param_URL";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { OwnDataContext } from "../../provider/own_data";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { toast } from "react-toastify";

const VideoCall = ({ isVideoCall, titlePage, userId }) => {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);

  const [receiver_id, setReceiverID] = useState();
  const [room_id, setRoomID] = useState();
  const [sender_id, setSenderID] = useState();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(isVideoCall !== false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [dataReceiver, setDataReceiver] = useState();
  const [isRemoteVideoEnabled, setIsRemoteVideoEnabled] = useState(true); // New state for remote video

  const dataOwner = useContext(OwnDataContext);
  const socket = useSocket();
  const navigate = useNavigate();

  // Get URL params
  useEffect(() => {
    const params = getURLParam();
    setSenderID(params?.sender_id);
    setRoomID(params?.ROOM_ID);
    setReceiverID(params?.receiver_id);
  }, []);

  // Register user and send a call request
  useEffect(() => {
    if (socket && sender_id && receiver_id && dataOwner?.user_id) {
      // Listen for call acceptance or rejection
      socket.on("statusAcceptedCallUser", (data) => {
        
        if (data?.status === "Accepted") {
          toast("Người nghe đang vào cuộc hội thoại...");
          setIsCallAccepted(true);
        } else {
          toast.error("Người nghe đã từ chối gọi...");
          navigate(-1);
        }
      });
    }
  }, [socket, receiver_id, sender_id, dataOwner]);

  // Fetch receiver's profile information
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await getData(
          API_GET_INFO_USER_PROFILE_BY_ID(
            dataOwner?.user_id !== sender_id ? sender_id : receiver_id
          )
        );

        if (response.status === true && response.data?.avatar) {
          const data = response.data;
          setDataReceiver(data);
        }
      } catch (error) {
        console.log("Error: ", error);
      }
    };

    fetchAPI();
  }, [receiver_id, sender_id, dataOwner]);


  console.log(">>>>>>>>>>>:", isCallAccepted);
  
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
        console.log("peer: ", id);
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
                setIsRemoteVideoEnabled(true); // Remote video is enabled
                if (remoteVideoRef.current) {
                  remoteVideoRef.current.srcObject = remoteStream;
                }
              } else {
                setIsRemoteVideoEnabled(false); // Remote video is disabled
                console.log("Remote video is not enabled.");
              }

              remoteStream.getVideoTracks()[0].onended = () => {
                setIsRemoteVideoEnabled(false); // Update state when remote video is ended
              };
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

  // Call another peer by peer ID
  const callPeer = (id) => {
    console.log("ID người gọi: " + id);

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
            setIsRemoteVideoEnabled(true);
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
            }
          } else {
            setIsRemoteVideoEnabled(false);
            console.log("Remote video is not enabled.");
          }

          remoteStream.getVideoTracks()[0].onended = () => {
            setIsRemoteVideoEnabled(false);
          };
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices: ", error);
        toast.error("Failed to access camera or microphone.");
      });
  };

  // End call and navigate back
  const handleEndCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    peerRef.current.destroy();
    navigate(-1);
  };

  // Toggle video stream
  const handleVideoToggle = () => {
    const videoTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.enabled = !isVideoMuted;
      setIsVideoMuted((prev) => !prev);
    }
  };

  // Toggle audio stream
  const handleAudioToggle = () => {
    const audioTrack = localStreamRef.current
      ?.getTracks()
      .find((track) => track.kind === "audio");
    if (audioTrack) {
      audioTrack.enabled = !isAudioMuted;
      setIsAudioMuted((prev) => !prev);
    }
  };

  return (
    <React.Fragment>
      <div className="video-call-container">
        <div className="video-wrapper">
          <video
            ref={localVideoRef}
            playsInline
            autoPlay
            muted
            className="user-video"
          />
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="partner-video"
            style={{ display: isRemoteVideoEnabled ? "block" : "none" }} // Show/hide remote video based on state
          />
          {/* Show avatar if no remote video */}
          {!isRemoteVideoEnabled && dataReceiver && (
            <div className="avatar">
              <img
                src={dataReceiver?.avatar}
                alt="Avatar"
                className="partner-avatar"
              />
            </div>
          )}
        </div>
        <div className="controls">
          <button onClick={handleVideoToggle} className="control-button">
            {isVideoMuted ? <FaVideo /> : <FaVideoSlash />}
          </button>
          <button onClick={handleAudioToggle} className="control-button">
            {isAudioMuted ? <FaMicrophoneSlash /> : <FaMicrophone />}
          </button>
          <button onClick={handleEndCall} className="control-button end-call">
            <FaPhoneAlt />
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default VideoCall;
