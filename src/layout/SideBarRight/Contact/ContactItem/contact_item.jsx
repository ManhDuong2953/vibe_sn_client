import { Link } from "react-router-dom";
import "./contact_item.scss";
import React from "react";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
function ContactItem({ active, data, loading = true }) {

  return (
    <React.Fragment>
      <li className={`list-contact--item ${active ? "active" : ""}`}>
        {loading ? (
          <Link to={"/messenger/" + data?.friend_id}>
            <div className="avt-contact popup">
              <PopupInfoShort user_id={data && data?.friend_id} />
              <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={data?.avatar} alt="" />
            </div>

            <p className="name-contact">{data?.user_name}</p>
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
