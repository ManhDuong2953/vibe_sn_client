import React, { useContext, useEffect, useState } from "react";
import "./profile_header.scss";
import { IoHeartCircle, IoQrCodeOutline } from "react-icons/io5";
import { IoIosPersonAdd } from "react-icons/io";
import { FaUserCheck, FaUserSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaFacebookMessenger } from "react-icons/fa6";
import QRCodePopup from "../../component/QRCode/qr_code";
import DevtoCard from "../../skeleton/dev_to_card";
import { API_FRIEND_ACCEPT, API_FRIEND_DELETE, API_FRIEND_REQUEST, API_FRIEND_STATUS, API_GET_INFO_USER_PROFILE_BY_ID } from "../../API/api_server";
import { getData, postData, putData } from "../../ultils/fetchAPI/fetch_API";
import { OwnDataContext } from "../../provider/own_data";
import Spinner from "../../component/Spinner/spinner";
function ProfileHeader({ classNameActive, userId }) {
    const [isHearted, setIsHearted] = useState(false);
    const [showQRCodePopup, setShowQRCodePopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingReq, setLoadingReq] = useState(true);
    const [data, setData] = useState();
    const [statusFr, setStatusFr] = useState();
    const dataOwner = useContext(OwnDataContext);
    useEffect(() => {
        try {
            const fetchData = async () => {
                const response = await getData(API_GET_INFO_USER_PROFILE_BY_ID(userId));
                setData(response?.data);
                return response?.status
            }
            setLoading(fetchData());
        } catch (error) {
            console.log(error.message);
        }
    }, [userId]);

    useEffect(() => {
        const fetchAPI = async () => {
            const response = await postData(API_FRIEND_STATUS, {
                requestor_id: dataOwner?.user_id,
                receiver_id: userId
            });
            if (response?.status) {
                setStatusFr(response?.data);
            }


        };
        if (dataOwner?.user_id !== userId) {
            fetchAPI();
        }
    }, [dataOwner?.user_id, userId]);

    const handleQRCodeClick = () => {
        setShowQRCodePopup(true);
    };

    const handleClosePopup = () => {
        setShowQRCodePopup(false);
    };


    const handleClickSendRequest = async () => {
        try {
            setLoadingReq(false)
            const response = await postData(API_FRIEND_REQUEST(userId));
            if (response?.status) {
                setLoadingReq(true);
                window.location.reload()
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleClickAcceptRequest = async () => {
        try {
            setLoadingReq(false)
            const response = await putData(API_FRIEND_ACCEPT(userId));
            if (response?.status) {
                setLoadingReq(true);
                window.location.reload()

            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const handleClickDeleteSendRequest = async () => {
        try {
            setLoadingReq(false)
            const response = await postData(API_FRIEND_DELETE, {
                requestor_id: dataOwner?.user_id,
                receiver_id: userId
            });
            if (response?.status) {
                setLoadingReq(true);
                window.location.reload()

            }
        } catch (error) {
            console.log(error.message);
        }
    };


    const currentURL = window.location.href;
    useEffect(() => {
        if (classNameActive) { // Chỉ chạy khi có đủ dữ liệu và không còn đang loading
            const listNavigation = document.querySelectorAll('.profile-navigation a li');
            listNavigation.forEach(navigation => {
                if (navigation.classList.contains(classNameActive)) {
                    const activeElement = document.querySelector('.profile-navigation a li.active');
                    if (activeElement) {
                        activeElement.classList.remove("active");
                    }
                    navigation.classList.add("active");
                }
            });
        }
    }, [classNameActive, dataOwner, data]);


    return (
        <React.Fragment>
            <div className="profile-header--container">
                {
                    loading ? (

                        <div className="profile-header">
                            <div className="profile-cover--img">
                                <img src={data && data?.cover} alt="" />
                            </div>
                            <div className="profile-avatar--img">
                                <img src={data && data?.avatar} alt="" />
                                <div className="header-container">
                                    <div className="info-analyst">
                                        <h1 className="name">{data && data?.user_name}</h1>
                                        <p className="nickname">@{data && data?.user_nickname}</p>
                                        <div className="analyst">
                                            <p className="quantity-friend">1002 bạn bè</p>
                                            <i>•</i>
                                            <p className="quantity-like">1002 lượt thích</p>
                                            {data && dataOwner && dataOwner?.user_id !== data.user_id && (
                                                <>
                                                    <i>•</i>
                                                    <p className="quantity-same--fr">1002 bạn chung</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="btn-action">
                                        <IoQrCodeOutline onClick={handleQRCodeClick} className="code-qr" />
                                        <QRCodePopup show={showQRCodePopup} url={currentURL} onClose={handleClosePopup} />
                                        {data && dataOwner && dataOwner?.user_id !== data.user_id && (
                                            <>
                                                <Link>
                                                    <div className="btn btn-messenger" >
                                                        <FaFacebookMessenger /> Nhắn tin
                                                    </div>
                                                </Link>

                                                <div className={`btn btn-like ${isHearted ? "active" : ""}`} onClick={() => setIsHearted(!isHearted)}><IoHeartCircle /> {isHearted ? "Đã thích" : "Thích"}</div>

                                                {loadingReq ? (
                                                    statusFr?.receiver_id ? (
                                                        statusFr?.relationship_status === 1 ? (
                                                            <div className="btn btn-add--friend" style={{ backgroundColor: "green" }} onClick={
                                                                () => {
                                                                    if (window.confirm("Bạn có muốn hủy kết bạn với người này chứ")) {
                                                                        handleClickDeleteSendRequest();
                                                                    }
                                                                }
                                                            } ><FaUserCheck /> Bạn bè</div>
                                                        ) : (
                                                            statusFr?.receiver_id === dataOwner?.user_id ? (
                                                                <div className="btn btn-add--friend" style={{ backgroundColor: "blue" }} onClick={() => handleClickAcceptRequest()} ><FaUserCheck /> Chấp nhận lời mời</div>
                                                            ) : (
                                                                <div className="btn btn-add--friend" style={{ backgroundColor: "red" }} onClick={() => handleClickDeleteSendRequest()} ><FaUserSlash /> Xóa lời yêu cầu</div>
                                                            )
                                                        )) : (
                                                        <div className="btn btn-add--friend" onClick={handleClickSendRequest} ><IoIosPersonAdd /> Thêm bạn bè</div>
                                                    )
                                                ) : (
                                                    <div className="btn btn-add--friend">Đang gửi...</div>
                                                )}


                                            </>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="loading-skeleton">
                            <DevtoCard />
                        </div>
                    )}
                <ul className="profile-navigation">
                    <Link to={`/profile/${data && data?.user_id}`}>
                        <li className="profile-navigation--item post active">Bài viết</li>
                    </Link>
                    <Link to={`/profile/${data && data?.user_id}/image`}>
                        <li className="profile-navigation--item image">Ảnh</li>
                    </Link>
                    <Link to={`/profile/${data && data?.user_id}/friends`}>
                        <li className="profile-navigation--item friends">Bạn bè</li>
                    </Link>
                    <Link to={`/profile/${data && data?.user_id}/group`}>
                        <li className="profile-navigation--item group">Nhóm</li>
                    </Link>
                    {data && dataOwner && dataOwner?.user_id === data.user_id && (
                        <>
                            <Link to={`/profile/${data && data?.user_id}/liked`}>
                                <li className="profile-navigation--item liked">Đã thích</li>
                            </Link>

                            <Link to={`/profile/${data && data?.user_id}/request-add--fr`}>
                                <li className="profile-navigation--item request-add--fr">Yêu cầu kết bạn</li>
                            </Link>

                            <Link to={`/profile/${data && data?.user_id}/store-story`}>
                                <li className="profile-navigation--item store-story">Kho lưu trữ tin</li>
                            </Link>
                        </>
                    )}
                </ul>
            </div>
        </React.Fragment>
    );
}

export default React.memo(ProfileHeader);