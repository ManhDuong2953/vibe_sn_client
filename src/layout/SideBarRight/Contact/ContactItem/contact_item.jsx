import { Link } from "react-router-dom";
import "./contact_item.scss";
import React, { useEffect, useState } from "react";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
function ContactItem({ active }) {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoading(true);    
        }, 0)
    }, []);
    return (
        <React.Fragment>
            <li className={`list-contact--item ${active ? 'active' : ''}`}>
                {
                    loading ? (
                        <Link>
                            <div className="avt-contact">
                                <PopupInfoShort />
                                <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                            </div>
                            <p className="name-contact">Dasha Taran</p>
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

export default ContactItem;