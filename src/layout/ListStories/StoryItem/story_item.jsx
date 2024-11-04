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
            <img className="media-story" src={story?.media_link} alt="" />
            <div className="info-container">
              <img src={story?.avatar} alt="" />
              <div className="name">{story?.user_name}</div>
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
