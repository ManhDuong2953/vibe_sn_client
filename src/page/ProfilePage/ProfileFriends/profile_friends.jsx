import React, { useEffect, useState } from "react";
import "./profile_friends.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ListContact from "../../../layout/SideBarRight/Contact/list_contact";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_FRIEND_LIST } from "../../../API/api_server";
import ContactItem from "../../../layout/SideBarRight/Contact/ContactItem/contact_item";
import { useSocket } from "../../../provider/socket_context";
function ProfileFriend({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const { user_id } = useParams();
  const [loading, setLoading] = useState(false);
  const [dataFriend, setDataFriend] = useState();
  const socket = useSocket();
  const [listUsersOnline, setListUsersOnline] = useState([]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const responseFriend = await getData(API_FRIEND_LIST(user_id));
        setDataFriend(responseFriend?.data);
        return responseFriend?.status;
      };
      setLoading(fetchData());
    } catch (error) {
      console.log(error.message);
    }
  }, [user_id]);

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { user_id: user_id });
      // Đăng ký sự kiện onlineUsers
      socket.on("onlineUsers", (data) => {
        setListUsersOnline(data);
      });
    }
  }, [socket]);
  console.log(listUsersOnline);

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="friends" />
          <div className="profile-friends--container">
            <h3 className="box">
              Bạn bè của bạn{" "}
              <form action="" method="get">
                <input
                  type="text"
                  placeholder="&#x1F50D; Nhập tên hoặc biệt danh của bạn bè"
                />
              </form>
            </h3>
            {dataFriend &&
              dataFriend?.map((friendItem, index) => (
                <ContactItem
                  loading={true}
                  data={friendItem}
                  active={
                    listUsersOnline &&
                    listUsersOnline?.includes(friendItem?.friend_id)
                  }
                />
              ))}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileFriend;
