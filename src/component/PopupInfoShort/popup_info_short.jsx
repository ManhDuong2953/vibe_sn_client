import React, { useContext, useEffect, useState } from "react";
import "./popup_info_short.scss";
import { Link } from "react-router-dom";
import { FaSchoolCircleCheck, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoHome } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { IoHeartCircleSharp } from "react-icons/io5";
import { deleteData, getData, postData } from "../../ultils/fetchAPI/fetch_API";
import {
  API_GET_INFO_USER_PROFILE_BY_ID,
  API_PROFILE_HEART_CREATE,
  API_PROFILE_HEART_DELETE,
  API_PROFILE_HEART_GET,
} from "../../API/api_server";
import { OwnDataContext } from "../../provider/own_data";
import { getCountMutualFriends } from "../../services/fetch_api";

function PopupInfoShort({ user_id }) {
  const [hearted, setHearted] = useState(false);
  const [countHearted, setCountHearted] = useState(0);
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
          const response = await getCountMutualFriends(
            user_id
          );

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
        const screenMidpoint = window.innerHeight;
        const y = avtParent.getBoundingClientRect().y;
        if (y <= screenMidpoint) {
          popupInfoElement.style.top = "40px";
        } else {
          popupInfoElement.style.top = "-200px";
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

  useEffect(() => {
    const getHeart = async () => {
      const responseHeart = await getData(API_PROFILE_HEART_GET(user_id));
      setCountHearted(responseHeart.data.length);
      if (responseHeart?.status) {
        for (let i = 0; i < responseHeart.data.length; i++) {
          const element = responseHeart.data[i];
          if (dataOwner && dataOwner.user_id === element.hearted_user_id) {
            setHearted(true);
            break;
          }
        }
      }
    };
    getHeart();
  }, []);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    if (hearted) {
      const responseRemove = await deleteData(
        API_PROFILE_HEART_DELETE(user_id)
      );
      if (responseRemove?.status) {
        setHearted(false);
        setCountHearted(countHearted - 1);
      }
    } else {
      const responseAdd = await postData(API_PROFILE_HEART_CREATE(user_id));
      if (responseAdd?.status) {
        setHearted(true);
        setCountHearted(countHearted + 1);
      }
    }
  };

  return (
    <React.Fragment>
      {infoUser && (
        <div className="popup-info--container">
          <div className="popup-row-container">
            <div className="popup-row popup-info">
              <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}className="popup-avt" src={infoUser?.avatar} alt="" />
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
                  Có <b>{countHearted} lượt yêu thích</b>
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
