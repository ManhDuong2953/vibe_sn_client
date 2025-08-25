import { Link } from "react-router-dom";
import PopupInfoShort from "../../../component/PopupInfoShort/popup_info_short";
import "./story_page_item.scss";
import React, { useState } from "react";
import AvatarWithText from "../../../skeleton/avatarwithtext";
import { timeAgo } from "../../../ultils/formatDate/format_date";
function StoryPageItem({ active, story }) {
  return (
    <React.Fragment>
      {story ? (
        <li className={`user-story--item ${active ? "active" : ""} `}>
          <Link to={"/story/" + story?.story_id}>
            <div className="avt-img popup">
              <PopupInfoShort user_id={story?.user_id} />
              <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={story?.avatar} alt="" />
            </div>
            <div className="info">
              <p className="name">{story?.user_name}</p>
              <p className="time">{timeAgo(story?.created_at)}</p>
            </div>
          </Link>
        </li>
      ) : (
        <div className="loading-skeleton">
          <AvatarWithText />
        </div>
      )}
    </React.Fragment>
  );
}

export default StoryPageItem;
