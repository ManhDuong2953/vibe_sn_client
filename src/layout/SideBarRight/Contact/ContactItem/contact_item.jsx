import { Link } from "react-router-dom";
import "./contact_item.scss";
import React, { useEffect, useState } from "react";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
function ContactItem({
  active,
  user_id,
  avatar_link,
  user_name,
  loading = false,
}) {
  // console.log({
  //   active,
  //   user_id,
  //   avatar_link,
  //   user_name,
  //   loading,
  // });

  return (
    <React.Fragment>
      <li className={`list-contact--item ${active ? "active" : ""}`}>
        {loading ? (
          <Link to={"/profile/" + user_id}>
            <div className="avt-contact">
              <PopupInfoShort />
              <img src={avatar_link} alt="" />
            </div>

            <p className="name-contact">{user_name}</p>
          </Link>
        ) : (
          <div className="loading-skeleton">
            <AvatarWithText />
          </div>
        )}
      </li>
    </React.Fragment>
  );
}

export default ContactItem;
