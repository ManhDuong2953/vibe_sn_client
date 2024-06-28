import React from "react";
import "./story_item.scss";
import { Link } from "react-router-dom";
function StoryItem() {
    return (
        <React.Fragment>
            <li className="story-item">
                <Link to="/story/123">
                    <img className="media-story" src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                    <div className="info-container">
                        <img src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                        <div className="name">Dastra Taran</div>
                    </div>
                </Link>

            </li>
        </React.Fragment>
    );
}

export default StoryItem;