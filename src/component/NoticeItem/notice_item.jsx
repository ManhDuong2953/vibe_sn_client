import React from "react";
import "./notice_item.scss";
import { Link } from "react-router-dom";
import { RiMessengerFill } from "react-icons/ri";
function NoticeItem() {

    return (
        <React.Fragment>
            <li className="notice-item">
                <Link>
                    <div className="avt-notice">
                        <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                        <div className="icon-notices">
                            <RiMessengerFill />
                        </div>

                    </div>
                    <div className="content-notice">
                        <p>
                            Dastra Taran đã đồng ý nhắn tin với bạn, bây giờ bạn có thể trò chuyện với họ như hai người bạn ngay nào!!
                        </p>
                        <b>
                            1 giờ trước
                        </b>
                    </div>
                </Link>
            </li>
        </React.Fragment>
    );
}

export default NoticeItem;