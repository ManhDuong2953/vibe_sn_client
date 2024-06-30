import React, { useState } from "react";
import "./story_item.scss";
import { Link } from "react-router-dom";
import InstagramStyle from "../../../skeleton/insta_style";
function StoryItem() {
    const [loaded, setLoaded] = useState(false);
    setTimeout(() => {
        setLoaded(true);
    }, 2000);
    return (
        <React.Fragment>
                <li className="story-item">
            {loaded ? (
                    <Link to="/story/123">
                        <img className="media-story" src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                        <div className="info-container">
                            <img src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                            <div className="name">Dastra Taran</div>
                        </div>
                    </Link>
            ) : (
                <div className="loading-skeleton">
                    <InstagramStyle />
                </div>
            )}
                </li>
        </React.Fragment>
    );
}

export default StoryItem;