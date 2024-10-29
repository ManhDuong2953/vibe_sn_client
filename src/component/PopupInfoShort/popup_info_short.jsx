import React, { useContext, useEffect, useState } from "react";
import "./popup_info_short.scss";
import { Link } from "react-router-dom";
import { FaSchoolCircleCheck, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoHeartCircleSharp } from "react-icons/io5";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_INFO_USER_PROFILE_BY_ID } from "../../API/api_server";
import { getMutualFriends } from "../../services/fetch_api";
import { OwnDataContext } from "../../provider/own_data";

function PopupInfoShort({ user_id }) {
  const [hearted, setHearted] = useState(false);
  const [infoUser, setInfoUser] = useState();
  const dataOwner = useContext(OwnDataContext);
  useEffect(() => {
    try {
      if (!user_id) return;
      const fetchAPI = async () => {
        const response = await getData(
          API_GET_INFO_USER_PROFILE_BY_ID(user_id)
        );
        if (response?.status) {
          setInfoUser(response?.data);
        }
      };
      fetchAPI();
    } catch (error) {
      console.error(error);
    }
  }, [user_id]);
  const [countMutual, setCountMutual] = useState();

  useEffect(() => {
    if (!user_id) return;

    const fetchFriends = async () => {
      if (dataOwner && dataOwner.user_id !== user_id) {
        try {
          const response = await getMutualFriends(dataOwner.user_id, user_id);

          setCountMutual(response);
        } catch (error) {
          console.error("Failed to fetch friends:", error);
        }
      }
    };
    fetchFriends();
  }, [dataOwner]);

  useEffect(() => {
    const popupInfoElements = document.querySelectorAll(
      ".popup-info--container"
    );

    const handleMouseEnter = (popupInfoElement, avtParent) => () => {
      if (avtParent) {
        //fetch data
        const screenMidpoint = window.innerHeight / 2;
        const y = avtParent.getBoundingClientRect().y;
        if (y <= screenMidpoint) {
          popupInfoElement.style.top = "40px";
        } else {
          popupInfoElement.style.top = "-245px";
        }
      }
    };

    popupInfoElements.forEach((popupInfoElement) => {
      const avtParent = popupInfoElement?.parentNode;
      avtParent.classList.add("popup");
      const enterHandler = handleMouseEnter(popupInfoElement, avtParent);

      if (avtParent) {
        avtParent.addEventListener("mouseenter", enterHandler);
        popupInfoElement._enterHandler = enterHandler;
      }
    });

    return () => {
      popupInfoElements.forEach((popupInfoElement) => {
        const avtParent = popupInfoElement?.parentNode;
        if (avtParent && popupInfoElement._enterHandler) {
          avtParent.removeEventListener(
            "mouseenter",
            popupInfoElement._enterHandler
          );
        }
      });
    };
  }, []);

  const handleHeartClick = (e) => {
    e.preventDefault();
    setHearted((prev) => !prev);
  };
  return (
    <React.Fragment>
      {infoUser && (
        <div className="popup-info--container">
          <div className="popup-row-container">
            <div className="popup-row popup-info">
              <img className="popup-avt" src={infoUser?.avatar} alt="" />
              <div className="popup-info-short">
                <b className="popup-name-user">{infoUser?.user_name}</b>
                <p className="popup-nickname-user">
                  @{infoUser?.user_nickname}
                </p>
                {infoUser?.user_school && (
                  <div className="popup-info-short--item info-school">
                    <FaSchoolCircleCheck />
                    Từng học tại <b>{infoUser?.user_school}</b>
                  </div>
                )}
                {infoUser?.user_address && (
                  <div className="popup-info-short--item info-address">
                    <IoHome />
                    Đang sống tại <b>{infoUser?.user_address}</b>
                  </div>
                )}
                <div className="popup-info-short--item info-quantity--fr">
                  <FaUserFriends />
                  Có <b>{countMutual} bạn chung</b>
                </div>
                <div className="popup-info-short--item info-quantity--fr">
                  <IoHeartCircleSharp />
                  Có <b>{hearted ? 1000 + 1 : 1000 - 1} lượt yêu thích</b>
                </div>
              </div>
            </div>
            <div className="popup-row action">
              <Link to={`/profile/${user_id}`}>
                <h5 className="popup-direct-info--detail">
                  Xem trang cá nhân <FaArrowUpRightFromSquare />
                </h5>
              </Link>
              <div className="popup-temp"></div>
              <form
                action=""
                onClick={handleHeartClick}
                method="post"
                className={hearted ? "active" : ""}
              >
                <IoHeartCircleSharp /> <p>{hearted ? "Đã thích" : "Thích"}</p>
              </form>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default PopupInfoShort;
