import React from "react";
import "./notice_item.scss";
import { Link } from "react-router-dom";
import { timeAgo } from "../../ultils/formatDate/format_date";
import { MdDeleteForever } from "react-icons/md";
import { IoMdNotifications } from "react-icons/io";

function NoticeItem({ data, handleDeleteNotice }) {


  return (
    <React.Fragment>
    <li className="notice-item">
      <Link to={data?.link_notice}>
        <div className="avt-notice">
          <img src={data?.avatar} alt="" />
          <div className="icon-notices">
            <IoMdNotifications />
          </div>
        </div>
        <div className="content-notice">
          <p>{data?.content}</p>
          <b>{timeAgo(data?.created_at)}</b>
        </div>
      </Link>
      <div
        className="delete-icon"
        onClick={(e) => handleDeleteNotice(data?.notice_id, e)}
      >
        <MdDeleteForever />
      </div>
    </li>
  </React.Fragment>
  
  );
}

export default NoticeItem;
