import React, { useCallback, useContext, useEffect, useState } from "react";
import "./profile_header.scss";
import { IoHeartCircle, IoQrCodeOutline } from "react-icons/io5";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFacebookMessenger } from "react-icons/fa6";
import QRCodePopup from "../../component/QRCode/qr_code";
import DevtoCard from "../../skeleton/dev_to_card";
import {
  API_FRIEND_ACCEPT,
  API_FRIEND_DELETE,
  API_FRIEND_REQUEST,
  API_FRIEND_STATUS,
  API_GET_INFO_USER_PROFILE_BY_ID,
  API_PROFILE_HEART_CREATE,
  API_PROFILE_HEART_DELETE,
  API_PROFILE_HEART_GET,
} from "../../API/api_server";
import {
  deleteData,
  getData,
  postData,
  putData,
} from "../../ultils/fetchAPI/fetch_API";
import { OwnDataContext } from "../../provider/own_data";
import { getCountMutualFriends } from "../../services/fetch_api";
import { useSocket } from "../../provider/socket_context";
import { truncateText } from "../../ultils/text/textHandler";

function ProfileHeader({ classNameActive, userId }) {
  const [isHearted, setIsHearted] = useState(false);
  const [showQRCodePopup, setShowQRCodePopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingReq, setLoadingReq] = useState(false);
  const [data, setData] = useState(null);
  const [countHearted, setCountHearted] = useState(0);
  const [statusFr, setStatusFr] = useState(null);
  const [countMutual, setCountMutual] = useState(0);
  const dataOwner = useContext(OwnDataContext);
  const socket = useSocket();

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(userId));
        if (response?.status) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  // Fetch mutual friends count
  useEffect(() => {
    const fetchFriends = async () => {
      if (dataOwner?.user_id !== userId) {
        try {
          const response = await getCountMutualFriends(userId);
          setCountMutual(response || 0);
        } catch (error) {
          console.error("Failed to fetch mutual friends:", error);
        }
      }
    };
    fetchFriends();
  }, [dataOwner, userId]);

  // Fetch friend status and heart status
  useEffect(() => {
    const fetchAPI = async () => {
      if (dataOwner?.user_id === userId) return;

      try {
        const [friendResponse, heartResponse] = await Promise.all([
          postData(API_FRIEND_STATUS, {
            requestor_id: dataOwner?.user_id,
            receiver_id: userId,
          }),
          getData(API_PROFILE_HEART_GET(userId)),
        ]);

        if (friendResponse?.status) {
          setStatusFr(friendResponse.data || null);
        }

        if (heartResponse?.status) {
          setCountHearted(heartResponse.data.length);
          setIsHearted(
            heartResponse.data.some(
              (item) => item.hearted_user_id === dataOwner?.user_id
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch friend/heart status:", error.message);
      }
    };
    fetchAPI();
  }, [dataOwner?.user_id, userId]);

  // Handle socket events for friend requests
  useEffect(() => {
    if (!socket || !dataOwner) return;

    const handleFriendRequest = (data) => {
      if (
        data.receiver_id === dataOwner?.user_id ||
        data.requestor_id === dataOwner?.user_id
      ) {
        setStatusFr({
          requestor_id: data.requestor_id,
          receiver_id: data.receiver_id,
          relationship_status: data.relationship_status,
        });
      }
    };

    socket.on("received_friend_request", handleFriendRequest);

    return () => {
      socket.off("received_friend_request", handleFriendRequest);
    };
  }, [socket, dataOwner]);

  const handleQRCodeClick = useCallback(() => {
    setShowQRCodePopup(true);
  }, []);

  const handleClosePopup = useCallback(() => {
    setShowQRCodePopup(false);
  }, []);

  const handleClickHeartProfile = useCallback(async () => {
    try {
      const response = isHearted
        ? await deleteData(API_PROFILE_HEART_DELETE(userId))
        : await postData(API_PROFILE_HEART_CREATE(userId));
      if (response?.status) {
        setIsHearted(!isHearted);
        setCountHearted((prev) => (isHearted ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Failed to update heart status:", error.message);
    }
  }, [isHearted, userId]);

  const handleClickSendRequest = useCallback(async () => {
    if (!socket || !dataOwner) return;

    try {
      setLoadingReq(true);
      const response = await postData(API_FRIEND_REQUEST(userId));
      if (response?.status) {
        const newStatus = {
          requestor_id: dataOwner.user_id,
          receiver_id: userId,
          relationship_status: 0,
        };
        setStatusFr(newStatus);
        socket.emit("send_friend_request", newStatus);
      }
    } catch (error) {
      console.error("Failed to send friend request:", error.message);
    } finally {
      setLoadingReq(false);
    }
  }, [socket, dataOwner, userId]);

  const handleClickAcceptRequest = useCallback(async () => {
    try {
      setLoadingReq(true);
      const response = await putData(API_FRIEND_ACCEPT(userId));
      if (response?.status) {
        setStatusFr((prev) => ({
          ...prev,
          relationship_status: 1,
        }));
      }
    } catch (error) {
      console.error("Failed to accept friend request:", error.message);
    } finally {
      setLoadingReq(false);
    }
  }, [userId]);

  const handleClickDeleteSendRequest = useCallback(async () => {
    if (!window.confirm("Bạn có muốn hủy kết bạn/lời mời kết bạn không?"))
      return;

    try {
      setLoadingReq(true);
      const response = await postData(API_FRIEND_DELETE, {
        requestor_id: dataOwner?.user_id,
        receiver_id: userId,
      });
      if (response?.status) {
        setStatusFr(null);
      }
    } catch (error) {
      console.error("Failed to delete friend request:", error.message);
    } finally {
      setLoadingReq(false);
    }
  }, [dataOwner, userId]);

  useEffect(() => {
    if (!classNameActive || !data) return;

    const listNavigation = document.querySelectorAll(
      ".profile-navigation a li"
    );
    listNavigation.forEach((navigation) => {
      navigation.classList.remove("active");
      if (navigation.classList.contains(classNameActive)) {
        navigation.classList.add("active");
      }
    });
  }, [classNameActive, data]);

  return (
    <div className="profile-header--container">
      {loading ? (
        <div className="loading-skeleton">
          <DevtoCard />
        </div>
      ) : (
        <div className="profile-header">
          <div className="profile-cover--img">
            <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={data?.cover} alt="Cover" />
          </div>
          <div className="profile-avatar--img">
            <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={data?.avatar} alt="Avatar" />
            <div className="header-container">
              <div className="info-analyst">
                <h1 className="name">
                  {truncateText(data?.user_name, 30)}
                  <TbRosetteDiscountCheckFilled className="icon-checked" />
                </h1>
                <p className="nickname">@{data?.user_nickname}</p>
                <div className="analyst">
                  <p className="quantity-like">{countHearted} lượt thích</p>
                  {dataOwner?.user_id !== data?.user_id && (
                    <>
                      <i>•</i>
                      <p className="quantity-same--fr">
                        {countMutual} bạn chung
                      </p>
                    </>
                  )}
                </div>
              </div>
              <div className="btn-action">
                <IoQrCodeOutline
                  onClick={handleQRCodeClick}
                  className="code-qr"
                />
                <QRCodePopup
                  show={showQRCodePopup}
                  url={window.location.href}
                  onClose={handleClosePopup}
                />
                {dataOwner?.user_id !== data?.user_id && (
                  <>
                    {statusFr?.relationship_status === 1 && (
                      <Link to={`/messenger/${data?.user_id}`}>
                        <div className="btn btn-messenger">
                          <FaFacebookMessenger /> Nhắn tin
                        </div>
                      </Link>
                    )}
                    <div
                      className={`btn btn-like ${isHearted ? "active" : ""}`}
                      onClick={handleClickHeartProfile}
                    >
                      <IoHeartCircle /> {isHearted ? "Đã thích" : "Thích"}
                    </div>
                    {loadingReq ? (
                      <div className="btn btn-add--friend">Đang xử lý...</div>
                    ) : statusFr ? (
                      statusFr.relationship_status === 1 ? (
                        <div
                          className="btn btn-add--friend"
                          style={{ backgroundColor: "green" }}
                          onClick={handleClickDeleteSendRequest}
                        >
                          <FaUserCheck /> Bạn bè
                        </div>
                      ) : statusFr.receiver_id === dataOwner?.user_id ? (
                        <div
                          className="btn btn-add--friend"
                          style={{ backgroundColor: "blue" }}
                          onClick={handleClickAcceptRequest}
                        >
                          <FaUserCheck /> Chấp nhận lời mời
                        </div>
                      ) : (
                        <div
                          className="btn btn-add--friend"
                          style={{ backgroundColor: "red" }}
                          onClick={handleClickDeleteSendRequest}
                        >
                          <FaUserSlash /> Hủy lời mời
                        </div>
                      )
                    ) : (
                      <div
                        className="btn btn-add--friend"
                        onClick={handleClickSendRequest}
                      >
                        <IoIosPersonAdd /> Thêm bạn bè
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <ul className="profile-navigation">
        <Link to={`/profile/${data?.user_id}`}>
          <li
            className={`profile-navigation--item post ${
              classNameActive === "post" ? "active" : ""
            }`}
          >
            Bài viết
          </li>
        </Link>
        {dataOwner?.user_id === data?.user_id && (
          <Link to={`/profile/${data?.user_id}/image`}>
            <li
              className={`profile-navigation--item image ${
                classNameActive === "image" ? "active" : ""
              }`}
            >
              Ảnh
            </li>
          </Link>
        )}
        <Link to={`/profile/${data?.user_id}/friends`}>
          <li
            className={`profile-navigation--item friends ${
              classNameActive === "friends" ? "active" : ""
            }`}
          >
            Bạn bè
          </li>
        </Link>
        <Link to={`/profile/${data?.user_id}/group`}>
          <li
            className={`profile-navigation--item group ${
              classNameActive === "group" ? "active" : ""
            }`}
          >
            Nhóm
          </li>
        </Link>
        {dataOwner?.user_id === data?.user_id && (
          <>
            <Link to={`/profile/${data?.user_id}/liked`}>
              <li
                className={`profile-navigation--item liked ${
                  classNameActive === "liked" ? "active" : ""
                }`}
              >
                Đã thích
              </li>
            </Link>
            <Link to={`/profile/${data?.user_id}/request-add--fr`}>
              <li
                className={`profile-navigation--item request-add--fr ${
                  classNameActive === "request-add--fr" ? "active" : ""
                }`}
              >
                Yêu cầu kết bạn
              </li>
            </Link>
            <Link to={`/profile/${data?.user_id}/store-story`}>
              <li
                className={`profile-navigation--item store-story ${
                  classNameActive === "store-story" ? "active" : ""
                }`}
              >
                Kho lưu trữ tin
              </li>
            </Link>
          </>
        )}
      </ul>
    </div>
  );
}

export default React.memo(ProfileHeader);
