import React, { useContext, useEffect, useState } from "react";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import "./profile_request_item.scss";
import { Link } from "react-router-dom";
import { OwnDataContext } from "../../../../provider/own_data";
import {
  getData,
  postData,
  putData,
} from "../../../../ultils/fetchAPI/fetch_API";
import {
  API_FRIEND_ACCEPT,
  API_FRIEND_DELETE,
  API_GET_INFO_USER_PROFILE_BY_ID,
} from "../../../../API/api_server";
import { getCountMutualFriends } from "../../../../services/fetch_api";
function ProfileRequestItem({ user_id }) {
  const [loading, setLoading] = useState(true);
  const [countMutualFr, setCountMutualFr] = useState(0);
  const [dataUser, setDataUser] = useState([]);
  const dataOwner = useContext(OwnDataContext);

  useEffect(() => {
    const fetchDataUser = async () => {
      if (user_id) {
        try {
          const response = await getData(
            API_GET_INFO_USER_PROFILE_BY_ID(user_id)
          );
          if (response?.status) {
            setDataUser(response?.data);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchDataUser();
  }, [user_id]);

  useEffect(() => {
    const fetchMutualFriendsCount = async () => {
      try {
        if (dataOwner && user_id) {
          const mutualCount = await getCountMutualFriends(
            user_id
          );
          setCountMutualFr(mutualCount);
        }
      } catch (error) {
        console.error("Error fetching mutual friends count:", error.message);
      }
    };

    fetchMutualFriendsCount();
  }, [user_id, dataOwner]);

  const handleAcceptRequest = async () => {
    try {
      const response = await putData(API_FRIEND_ACCEPT(user_id));
      if (response?.status) {
        window.location.reload();
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleDeleteRequest = async () => {    
    try {
      const confirmDelete = window.confirm("Từ chối lời mời người này chứ");
      if (!confirmDelete) return; // Nếu người dùng không xác nhận thì không làm gì
    
      const response = await postData(API_FRIEND_DELETE, {
        requestor_id: user_id,
        receiver_id: dataOwner?.user_id,
      });
  
      if (response?.status) {
        console.log("API response success:", response);
        window.location.reload();
      } else {
        console.error("API response failed:", response);
      }
    } catch (error) {
      console.error("Error during delete request:", error.message);
    }
  };
  
  

  return (
    <React.Fragment>
      <li className="list-suggest--item request">
        {!loading ? (
          <>
            <div className="item-container">
              <div className="avt-suggest popup">
                <PopupInfoShort user_id={user_id} />
                <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={dataUser?.avatar} alt="User Avatar" />
              </div>
              <div className="name-suggest">
                <b>{dataUser?.user_name}</b>
                <p>{countMutualFr} bạn chung</p>
              </div>
            </div>
            <div className="btn-container">
              <Link to={`/profile/${dataUser?.user_id}`}>
                <div className="btn btn-info">
                  Xem trang cá nhân
                </div>
              </Link>
              <div className="btn btn-accept" onClick={handleAcceptRequest}>
                Chấp nhận
              </div>
              <div className="btn btn-refuse" onClick={()=>handleDeleteRequest()}>
                Từ chối
              </div>
            </div>
          </>
        ) : (
          <div className="loading-skeleton">
            <AvatarWithText />
          </div>
        )}
      </li>
    </React.Fragment>
  );
}

export default ProfileRequestItem;
