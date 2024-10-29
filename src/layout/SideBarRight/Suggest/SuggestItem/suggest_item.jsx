import { Link } from "react-router-dom";
import "./suggest_item.scss";
import { useEffect, useState } from "react";
import AvatarWithText from "../../../../skeleton/avatarwithtext";
import PopupInfoShort from "../../../../component/PopupInfoShort/popup_info_short";
function SuggestItem({avatar, name, to}) {
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
                    <Link to={to}>
                        <div className="avt-suggest ">
                            <PopupInfoShort />
                            <img src={avatar} alt="" />
                        </div>
                        <div className="name-suggest">
                            <b>{name}</b>
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