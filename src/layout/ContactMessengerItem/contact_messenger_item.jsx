import React, { useContext, useEffect, useState } from "react";
import AvatarWithText from "../../skeleton/avatarwithtext";
import { Link } from "react-router-dom";
import "./contact_messenger_item.scss";
import { postData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_ALL_CONVERSATION } from "../../API/api_server";
import { useSocket } from "../../provider/socket_context";
import { timeAgo } from "../../ultils/formatDate/format_date";
import { OwnDataContext } from "../../provider/own_data";

function ContactMessengerItem({ getFristConversation, listUsersOnline }) {
  const [loading, setLoading] = useState(false);
  const [listConversation, setListConversation] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search input
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
    }
  }, [socket]);

  useEffect(() => {
    if (listConversation) {
      getFristConversation(listConversation && listConversation[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listConversation]);

  useEffect(() => {
    // Filter conversations by search query
    const filtered = listConversation?.filter((conversation) =>
      conversation.friend_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredConversations(filtered);
  }, [searchQuery, listConversation]);

  return (
    <React.Fragment>
      <div className="search-bar search-input">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          placeholder="Tìm kiếm trên Messenger"
        />
      </div>
      {loading ? (
        <ul className="list-contact">
          {filteredConversations &&
            listUsersOnline &&
            dataOwner &&
            filteredConversations?.map((msg, index) => {
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
                    <span text-ellipsis>
                      <p className="name-contact">{msg.friend_name}</p>
                      <p className="newest-messenger">
                        {msg.content_text && (
                          <>
                            <b className="text-ellipsis">
                              {msg.sender_id === dataOwner?.user_id && (
                                <>Bạn: </>
                              )}
                              {msg.content_type === "text" && msg.content_text}
                              {msg.content_type === "link" && (
                                <b style={{ opacity: "0.8" }}>
                                  Trả lời bằng Liên kết
                                </b>
                              )}
                              {msg.content_type === "image" &&
                                "Trả lời bằng Ảnh"}
                              {msg.content_type === "video" &&
                                "Trả lời bằng Video"}
                              {msg.content_type === "audio" && (
                                <b style={{ opacity: "0.8" }}>
                                  Trả lời bằng Tin nhắn thoại
                                </b>
                              )}
                              {msg.content_type === "other" &&
                                "Trả lời bằng Tệp tin"}
                              {msg.content_type?.includes("accepted") &&
                                "Cuộc gọi thoại"}
                              {msg.content_type?.includes("missed") &&
                                "Cuộc gọi nhỡ"}
                            </b>
                            <i>{timeAgo(msg.last_message_time)}</i>
                          </>
                        )}
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
