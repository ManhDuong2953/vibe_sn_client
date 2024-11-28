import React, { useEffect, useState } from "react";
import "./notice_item.scss";
import { Link } from "react-router-dom";
import { RiMessengerFill } from "react-icons/ri";
import { deleteData } from "../../ultils/fetchAPI/fetch_API";
import { API_DELETE_NOTIFICATION_BY_ID } from "../../API/api_server";
function NoticeItem({ notification }) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (notification) setLoading(false);
  }, []);
  const handleDeleteNotice = async (notice_id, e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await deleteData(
        API_DELETE_NOTIFICATION_BY_ID(notice_id)
      );
      if (response?.status === true) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <React.Fragment>
      <li className="notice-item">
        <Link>
          <div className="avt-notice">
            <img
              src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg"
              alt=""
            />
            <div className="icon-notices">
              <RiMessengerFill />
            </div>
          </div>
          <div className="content-notice">
            <p>
              Dasha Taran đã đồng ý nhắn tin với bạn, bây giờ bạn có thể trò
              chuyện với họ như hai người bạn ngay nào!!
            </p>
            <b>1 giờ trước</b>
          </div>
        </Link>
      </li>
    </React.Fragment>
  );
}

export default NoticeItem;
