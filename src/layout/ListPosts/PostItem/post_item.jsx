import React, { useEffect, useState, useRef, useContext } from "react";
import "./post_item.scss";
import HeaderPost from "./HeaderPost/header_post";
import ContentText from "./ContentText/content_text";
import ContentMedia from "./ContentMedia/content_media";
import Comment from "./Comment/comment";
import ClassicPostLoader from "../../../skeleton/classic_post_loader";
function PostItem({ data }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (data) {
      setLoaded(true);
    }
  }, [data]);
  
  return (
    <React.Fragment>
      <div className="post-item--container">
        {loaded ? (
          <>
            <div className="header-post--wrapper">
              <HeaderPost data={data} />
            </div>
            <div className="content-container">
              {data?.post_text && !(data?.post_text == "<p></p>" || data?.post_text == "<span></span>")  && (
                <ContentText data={data} />
              )}
              {data?.media?.length > 0 && <ContentMedia data={data} />}
            </div>
            <Comment data={data} />
          </>
        ) : (
          <div className="loading-skeleton">
            <ClassicPostLoader />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default PostItem;
