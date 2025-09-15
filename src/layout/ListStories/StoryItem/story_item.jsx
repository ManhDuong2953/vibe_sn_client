import React, { useEffect, useState } from "react";
import "./story_item.scss";
import { Link } from "react-router-dom";
import InstagramStyle from "../../../skeleton/insta_style";
function StoryItem({ story }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (story) setLoaded(true);
  }, [story]);
  return (
    <React.Fragment>
      <li className="story-item">
        {loaded && story ? (
          <Link to={"/story/" + story?.story_id}>
            <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}className="media-story" src={story?.media_link} alt="" />
            <div className="info-container">
              <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={story?.avatar} alt="" />
              <div className="text-ellipsis name">{story?.user_name}</div>
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
