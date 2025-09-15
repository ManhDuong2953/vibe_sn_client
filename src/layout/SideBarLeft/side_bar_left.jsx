import { useContext, useState, useEffect } from "react";
import "./side_bar_left.scss";
import { FaUsers, FaStore } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { OwnDataContext } from "../../provider/own_data";
import {
  API_LIST_GROUP_BY_USERID,
  API_LIST_GROUP_SUGGEST,
} from "../../API/api_server";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { truncateText } from "../../ultils/text/textHandler";
import { Link } from "react-router-dom";
function SideBarLeft() {
  // Dữ liệu gợi ý nhóm mẫu
  const dataOwner = useContext(OwnDataContext);
  // Lấy danh sách nhóm của chủ sở hữu
  const [listMyGroups, setMyGroups] = useState([]);
  useEffect(() => {
    const getAllGroupByOwner = async () => {
      if (!dataOwner?.user_id) return;
      const response = await getData(
        API_LIST_GROUP_BY_USERID(dataOwner?.user_id)
      );
      if (response?.status) {
        setMyGroups(response.data);
      }
    };
    getAllGroupByOwner();
  }, [dataOwner]);

  const [suggestedGroups, setSuggestedGroups] = useState([]);
  useEffect(() => {
    const getSuggestedGroups = async () => {
      if (!dataOwner?.user_id) return;
      const response = await getData(API_LIST_GROUP_SUGGEST);
      if (response?.status) {
        setSuggestedGroups(response.data);
      }
    };
    getSuggestedGroups();
  }, [dataOwner]);
  return (
    <div id="sidebar-left--container">
      <div className="sidebar-left--wrap">
        {/* Tài khoản */}
        <Link to={`/profile/${dataOwner?.user_id}`} className="sidebar-item">
          <img
            src={dataOwner?.avatar || "https://via.placeholder.com/40"}
            alt="Avatar"
            className="sidebar-avatar"
          />
          <span>{dataOwner?.user_name}</span>
        </Link>

        {/* Bạn bè */}
        <Link to={`/profile/${dataOwner?.user_id}/friends`} className="sidebar-item">
          <FaUsers className="sidebar-icon" />
          <span>Bạn bè</span>
        </Link>

        {/* Nhóm */}
        <Link to={`/group`} className="sidebar-item">
          <FaPeopleGroup  className="sidebar-icon" />
          <span>Nhóm</span>
        </Link>

        {/* Marketplace */}
        <Link to={`/marketplace`} className="sidebar-item">
          <FaStore className="sidebar-icon" />
          <span>Marketplace</span>
        </Link>

        {/* Nhóm của bạn */}
        {listMyGroups.length > 0 && (
          <div className="sidebar-suggest">
            <h5>Nhóm của bạn</h5>
            <ul className="suggest-list">
              {listMyGroups.map((group) => (
                <li key={group.group_id}>
                  <Link to={"/group/"+group?.group_id} className="suggest-item">
                    <div className="group-avatar">
                      <img
                        src={group?.avatar_media_link}
                        alt=""
                        className="avatar"
                      />
                    </div>
                    <div className="group-info">
                      <p className="group-name">
                        {truncateText(group.group_name, 50)}
                      </p>
                      <i className="group-members">
                        {group.member_count} thành viên
                      </i>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Danh sách nhóm gợi ý */}
        <div className="sidebar-suggest">
          <h5>Nhóm gợi ý cho bạn</h5>
          <ul className="suggest-list">
            {suggestedGroups.map((group) => (
              <li key={group?.group_id}>
                <Link to={"/group/"+group?.group_id} className="suggest-item">
                  <div className="group-avatar">
                    <img
                      src={group?.avatar_media_link}
                      alt=""
                      className="avatar"
                    />
                  </div>
                  <div className="group-info">
                    <p className="group-name">
                      {truncateText(group.group_name, 50)}
                    </p>
                    <i className="group-members">
                      {group.member_count} thành viên
                    </i>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SideBarLeft;
