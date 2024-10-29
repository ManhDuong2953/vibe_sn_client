import React, { useEffect, useState } from "react";
import "./group_header.scss";
import { MdGroupAdd } from "react-icons/md";
import { MdGroupRemove } from "react-icons/md";
import { Link } from "react-router-dom";
import { FaUserLock } from "react-icons/fa";
import { AiOutlineGlobal } from "react-icons/ai";
import { FaFacebookMessenger } from "react-icons/fa6";
import ListSuggest from "../SideBarRight/Suggest/list_suggest";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";
import { IoQrCodeOutline } from "react-icons/io5";
import QRCodePopup from "../../component/QRCode/qr_code";
import { API_GROUP_DETAIL } from "../../API/api_server";
import { getData } from "../../ultils/fetchAPI/fetch_API";

function GroupHeader({ classNameActive, group_id }) {
  const [isFriend, setIsFriend] = useState(false);
  const [showQRCodePopup, setShowQRCodePopup] = useState(false);
  const [dataGroup, setDataGroup] = useState();
  useEffect(() => {
    const getGroupDetail = async () => {
      const response = await getData(API_GROUP_DETAIL(group_id));
      if (response.status) {
        setDataGroup(response.data);
      }
    };
    getGroupDetail()
  }, [group_id]);
  const handleQRCodeClick = () => {
    setShowQRCodePopup(true);
  };

  const handleClosePopup = () => {
    setShowQRCodePopup(false);
  };
  console.log(dataGroup);
  
  const currentURL = window.location.href;
  useEffect(() => {
    const listNavigation = document.querySelectorAll(".group-navigation a li");
    listNavigation.forEach((navigation) => {
      if (navigation.classList.contains(classNameActive)) {
        document
          .querySelector(".group-navigation a li.active")
          .classList.remove("active");
        navigation.classList.add("active");
      }
    });
  }, [classNameActive]);
  return (
    <React.Fragment>
      <div className="group-header--main">
        <div className="group-header--container">
          <div className="group-header">
            <div className="group-cover--img">
              <img
                src={dataGroup?.cover_media_link}
                alt=""
              />
            </div>
            <div className="group-avatar--img">
              <img
                src={dataGroup?.avatar_media_link}
                alt=""
              />
              <div className="header-container">
                <div className="info-analyst">
                  <h1 className="name">{dataGroup?.group_name}</h1>
                  <div className="analyst">
                    <p className="private">
                      <FaUserLock />
                      Nhóm công khai
                    </p>
                    <i>•</i>
                    <p className="quantity-member">1002 thành viên</p>
                    <i>•</i>
                    <p className="quantity-same--fr">43 bạn chung</p>
                  </div>
                </div>
                <div className="btn-action">
                  <IoQrCodeOutline
                    onClick={handleQRCodeClick}
                    className="code-qr"
                  />
                  <QRCodePopup
                    show={showQRCodePopup}
                    url={currentURL}
                    onClose={handleClosePopup}
                  />
                  <Link>
                    <div className="btn btn-messenger">
                      <FaFacebookMessenger /> Nhắn tin
                    </div>
                  </Link>
                  <div
                    className={`btn btn-add--gr ${isFriend ? "active" : ""}`}
                    onClick={() => setIsFriend(!isFriend)}
                  >
                    {isFriend ? (
                      <>
                        <MdGroupRemove /> Rời nhóm
                      </>
                    ) : (
                      <>
                        <MdGroupAdd /> Tham gia nhóm
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ul className="group-navigation">
            <Link to="/group/123">
              <li className="group-navigation--item post active">Bài viết</li>
            </Link>
            <Link to="/group/123/members">
              <li className="group-navigation--item members">Thành viên</li>
            </Link>
            <Link to="/group/123/admin">
              <li className="group-navigation--item admin">Quản trị nhóm</li>
            </Link>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default GroupHeader;
