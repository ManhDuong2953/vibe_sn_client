import React, { useEffect, useState } from "react";
import "./profile_liked.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ListSuggest from "../../../layout/SideBarRight/Suggest/list_suggest";
import { useParams } from "react-router-dom";
import { API_PROFILE_HEART_GET } from "../../../API/api_server";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import ContactItem from "../../../layout/SideBarRight/Contact/ContactItem/contact_item";
import { useSocket } from "../../../provider/socket_context";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
function ProfileLiked({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { user_id } = useParams();
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([]);

  useEffect(() => {
    if (!user_id) return;
    const getHeart = async () => {
      const responseHeart = await getData(API_PROFILE_HEART_GET(user_id));
      if (responseHeart?.status) {
        setData(responseHeart?.data);
      }
    };
    getHeart();
  }, [user_id]);



  const socket = useSocket();
  const [listUsersOnline, setListUsersOnline] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { user_id });
      socket.on("onlineUsers", (data) => setListUsersOnline(data));

      return () => socket.off("onlineUsers");
    }
  }, [socket, user_id]);
  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="liked" />
          <div className="profile-liked--container">
            <div className="box">
              {data?.length > 0 ? (
                <ul>
                  {data.map((heartedItem, index) => (
                    <SuggestItem
                      key={index}
                      user_id={heartedItem?.hearted_user_id}
                      active={listUsersOnline.includes(
                        heartedItem?.hearted_user_id
                      )}
                    />
                  ))}
                </ul>
                ) : (
                    <h4 className="text-center">Không có bạn nào yêu thích bạn!</h4>
                )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileLiked;
