import "./list_contact.scss";
import ContactItem from "./ContactItem/contact_item";
import { useContext, useEffect, useState } from "react";
import { OwnDataContext } from "../../../provider/own_data";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_FRIEND_LIST } from "../../../API/api_server";
import { useSocket } from "../../../provider/socket_context";
import AvatarWithText from "../../../skeleton/avatarwithtext";
function ListContact() {
  const dataOwner = useContext(OwnDataContext);
  const [dataFriend, setDataFriend] = useState([]);
  const [listUsersOnline, setListUsersOnline] = useState([]);
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!dataOwner) return;
        setLoading(true);
        const responseFriend = await getData(
          API_FRIEND_LIST(dataOwner?.user_id)
        );
        setDataFriend(responseFriend?.data || []);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dataOwner]);

  useEffect(() => {
    if (socket) {
      socket.emit("registerUser", { user_id: dataOwner?.user_id });

      // Đăng ký sự kiện onlineUsers
      socket.on("onlineUsers", (data) => {
        setListUsersOnline(data);
      });
    }
  }, [socket]);

  return (
    <div className="list-contact--container">
      <ul className="list-contact">
        {loading === true ? (
          <div className="loading-skeleton">
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
            <AvatarWithText />
          </div>
        ) : dataFriend && loading === false ? (
          dataFriend?.map((item, index) => (
            <ContactItem
              data={item}
              key={index}
              active={
                listUsersOnline && listUsersOnline?.includes(item?.friend_id)
              }
            />
          ))
        ) : (
          <h5
            className="text-center"
            style={{ margin: "5px 0", color: "#7171718c" }}
          >
            Không có bạn bè nào
          </h5>
        )}
      </ul>
    </div>
  );
}

export default ListContact;
