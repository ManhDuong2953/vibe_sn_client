import React, { useEffect, useState } from "react";
import "./profile_friends.scss";

import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import ProfileHeader from "../../../layout/ProfileHeader/profile_header";
import ContactItem from "../../../layout/SideBarRight/Contact/ContactItem/contact_item";
import { useParams } from "react-router-dom";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_FRIEND_LIST } from "../../../API/api_server";
import { useSocket } from "../../../provider/socket_context";
import { getURLParam } from "../../../ultils/getParamURL/get_param_URL";

function ProfileFriend({ titlePage }) {
  const { user_id } = useParams();
  const [loading, setLoading] = useState(true);
  const [dataFriend, setDataFriend] = useState([]); // Danh sách bạn bè gốc
  const [filteredFriends, setFilteredFriends] = useState([]); // Danh sách đã lọc
  const [listUsersOnline, setListUsersOnline] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFriend = await getData(API_FRIEND_LIST(user_id));
        const friends = responseFriend?.data || [];
        setDataFriend(friends);
        setFilteredFriends(friends); // Đặt danh sách đã lọc bằng danh sách gốc
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false); // Sửa lỗi loading
      }
    };
    fetchData();
  }, [user_id]);

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { user_id });
      socket.on("onlineUsers", (data) => setListUsersOnline(data));

      return () => socket.off("onlineUsers");
    }
  }, [socket, user_id]);

  const handleSearchChange = (searchString) => {
    const searchTerm = searchString.toLowerCase();
    setFilteredFriends(
      searchTerm
        ? dataFriend.filter((friend) =>
            friend?.user_name?.toLowerCase().includes(searchTerm)
          )
        : dataFriend // Nếu không có từ khóa, trả về danh sách gốc
    );
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="profile">
        <div className="profile-container">
          <ProfileHeader userId={user_id} classNameActive="friends" />
          <div className="profile-friends--container">
            <h3 className="box">
              Bạn bè của bạn
              <form action="" method="get">
                <input
                  type="text"
                  name="searchString"
                  placeholder="🔍 Nhập tên hoặc biệt danh của bạn bè"
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </form>
            </h3>
            {loading ? (
              <h4 className="text-center">Đang tìm kiếm ...</h4>
            ) : filteredFriends.length > 0 ? (
              filteredFriends.map((friendItem, index) => (
                <ContactItem
                  key={index}
                  loading={!loading}
                  data={friendItem}
                  active={listUsersOnline.includes(friendItem?.friend_id)}
                />
              ))
            ) : (
              <h4 className="text-centerpop">Không tìm thấy bạn bè nào.</h4>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProfileFriend;
