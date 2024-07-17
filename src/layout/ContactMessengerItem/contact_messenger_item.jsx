import React, { useEffect, useState } from "react";
import PopupInfoShort from "../../component/PopupInfoShort/popup_info_short";
import AvatarWithText from "../../skeleton/avatarwithtext";
import { Link } from "react-router-dom";
import "./contact_messenger_item.scss";
function ContactMessengerItem() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
        }, 1000)
    }, []);
    return (
        <React.Fragment>
            <li className={`list-contact--item active}`}>
                {
                    loading ? (
                        <Link className="">
                            <div className="avt-contact">
                                <PopupInfoShort />
                                <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                            </div>
                            <span>

                                <p className="name-contact">Dasha Taran</p>
                                <p className="newest-messenger">
                                   <i>3 giờ trước: </i>Hôm nay là chủ nhật.
                                </p>
                            </span>
                        </Link>
                    ) : (
                        <div className="loading-skeleton">
                            <AvatarWithText />
                        </div>
                    )
                }
            </li>
        </React.Fragment>
    );
}

export default ContactMessengerItem;