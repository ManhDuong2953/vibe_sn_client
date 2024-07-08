import React from "react";
import "./side_bar_right.scss"
import ListContact from "./Contact/list_contact";
import ListSuggest from "./Suggest/list_suggest";
import iconsHbbd from "../../www/icons/hbbd.png";
import { Link } from "react-router-dom";
function SideBarRight() {
    return (
        <React.Fragment>
            <div id="sidebar-right--container">
                <span>
                    <h4>Sinh nhật</h4>
                    <div className="dob-container">
                        <img src={iconsHbbd} alt="" />
                        <p>Hôm nay là sinh nhật của <Link><b>Dasha Taran</b></Link> và <Link><b>Dasha Taran</b></Link> </p>
                    </div>
                    <h4>Người liên hệ</h4>
                    <ListContact />
                    <h4>Gợi ý cho bạn</h4>
                    <ListSuggest />
                </span>

            </div>
        </React.Fragment>
    );
}

export default SideBarRight;