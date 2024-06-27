import React from "react";
import "./side_bar_right.scss"
import ListContact from "./Contact/list_contact";
import ListSuggest from "./Suggest/list_suggest";
function SideBarRight() {
    return (
        <React.Fragment>
            <div id="sidebar-right--container">
                <span>
                    <ListContact />
                    <ListSuggest />
                </span>

            </div>
        </React.Fragment>
    );
}

export default SideBarRight;