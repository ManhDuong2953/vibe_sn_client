import { Link } from "react-router-dom";
import "./suggest_item.scss";
import { useEffect, useState } from "react";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
function SuggestItem() {
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setLoading(true);
        }, 1000)
    }, []);
    return (
        <li className="list-suggest--item">
            {
                loading ? (
                    <Link>
                        <div className="avt-suggest ">
                            <PopupInfoShort />
                            <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                        </div>
                        <div className="name-suggest">
                            <b>Dasha Taran</b>
                            <p>53 bạn chung</p>
                        </div>
                    </Link>
                ) : (
                    <div className="loading-skeleton">
                        <AvatarWithText />
                    </div>
                )
            }
        </li>

    );
}

export default SuggestItem;