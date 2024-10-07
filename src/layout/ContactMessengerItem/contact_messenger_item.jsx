import React, { useContext, useEffect, useState } from "react";
import PopupInfoShort from "../../component/PopupInfoShort/popup_info_short";
import AvatarWithText from "../../skeleton/avatarwithtext";
import { Link } from "react-router-dom";
import "./contact_messenger_item.scss";
import { postData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_ALL_CONVERSATION } from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { timeAgo } from "../../ultils/formatDate/format_date";
import { OwnDataContext } from "../../provider/own_data";

function ContactMessengerItem({ getFristConversation }) {
  const [loading, setLoading] = useState(false);
  const [listConversation, setListConversation] = useState([]);
  const [listUsersOnline, setListUsersOnline] = useState([]);
  const socket = useSocket();
  const dataOwner = useContext(OwnDataContext);
  const fetchData = async () => {
    const response = await postData(API_GET_ALL_CONVERSATION, {
      private_key: localStorage.getItem("private_key"),
    });
    if (response?.status) {
      setListConversation(response?.data);
      setLoading(true);
    } else {
      console.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    try {
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("updateConversation", () => {
        fetchData(); // update list conversation when new message received
      });
      // Kiểm tra trạng thái online khi component được mount
      socket.on("onlineUsers", (data) => {
        setListUsersOnline(data);
      });
    }
  }, [socket]);

  useEffect(() => {
    getFristConversation(listConversation[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listConversation]);
  return (
    <React.Fragment>
      {loading ? (
        <ul className="list-contact">
          {listConversation &&
            listUsersOnline &&
            dataOwner &&
            listConversation.map((msg, index) => {
              return (
                <li
                  key={index}
                  className={`list-contact--item ${
                    listUsersOnline.includes(msg?.friend_id) ? "active" : ""
                  }`}
                >
                  <Link to={"/messenger/" + msg?.friend_id}>
                    <div className="avt-contact">
                      <img src={msg.friend_avatar} alt={msg.friend_name} />
                    </div>
                    <span className="text-ellipsis">
                      <p className="name-contact">{msg.friend_name}</p>
                      <p className="newest-messenger">
                        <i>{timeAgo(msg.last_message_time)}:</i>
                        <b>
                          {" " +
                            (msg.sender_id === dataOwner?.user_id
                              ? "Bạn: " + msg.last_message
                              : msg.last_message)}
                        </b>
                      </p>
                    </span>
                  </Link>
                </li>
              );
            })}
        </ul>
      ) : (
        <div className="loading-skeleton">
          <AvatarWithText />
        </div>
      )}
    </React.Fragment>
  );
}

export default ContactMessengerItem;
