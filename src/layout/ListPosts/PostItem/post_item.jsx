import React, { useState } from "react";
import "./post_item.scss";
import HeaderPost from "./HeaderPost/header_post";
import ContentText from "./ContentText/content_text";
import ContentMedia from "./ContentMedia/content_media";
import Comment from "./Comment/comment";
import ClassicPostLoader from "../../../skeleton/classic_post_loader";

function PostItem() {
    const [loaded, setLoaded] = useState(false);
setTimeout(() => {
    setLoaded(true);
}, 1000);
    return (
        <React.Fragment>
            <div className="post-item--container">
                {loaded ? (
                    <>
                        <HeaderPost />
                        <div className="content-container">
                            <ContentText />
                            <ContentMedia />
                        </div>
                        <Comment />
                    </>
                ) : (<div className="loading-skeleton"><ClassicPostLoader /></div>)}
            </div>

        </React.Fragment>
    );
}

export default PostItem;
