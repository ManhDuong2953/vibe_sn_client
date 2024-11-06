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
import { getURLParam } from "../../../ultils/getParamURL/get_param_URL";

function ProfileFriend({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const { user_id } = useParams();
  const s = getURLParam();
  console.log(s);

  const [loading, setLoading] = useState(false);
  const [dataFriend, setDataFriend] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFriends, setFilteredFriends] = useState([]); // Danh sách đã lọc
  const socket = useSocket();
  const [listUsersOnline, setListUsersOnline] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseFriend = await getData(API_FRIEND_LIST(user_id));
        setDataFriend(responseFriend?.data);
        setFilteredFriends(responseFriend?.data); // Đặt danh sách đã lọc bằng danh sách ban đầu
        setLoading(false);
      } catch (error) {
        console.error(error.message);
        setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
  }, [user_id]);

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { user_id: user_id });
      socket.on("onlineUsers", (data) => {
        setListUsersOnline(data);
      });
    }
  }, [socket]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    // Cập nhật danh sách bạn bè đã lọc dựa trên từ khóa
    if (term.trim()) {
      setFilteredFriends(
        dataFriend.filter((friend) =>
          friend?.username?.toLowerCase().includes(term.toLowerCase())
        )
      );
    } else {
      setFilteredFriends(dataFriend);
    }
  };

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
                  name="searchString"
                  placeholder="&#x1F50D; Nhập tên hoặc biệt danh của bạn bè"
                  value={searchTerm} // Hiển thị từ khóa tìm kiếm
                  onChange={handleSearch} // Gọi hàm handleSearch khi thay đổi giá trị
                />
              </form>
            </h3>
            {filteredFriends &&
              filteredFriends.map((friendItem, index) => (
                <ContactItem
                  key={index}
                  loading={loading}
                  data={friendItem}
                  active={
                    listUsersOnline &&
                    listUsersOnline.includes(friendItem?.friend_id)
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
