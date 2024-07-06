import React, { useState } from "react";
import "./post_item.scss";
import HeaderPost from "./HeaderPost/header_post";
import ContentText from "./ContentText/content_text";
import ContentMedia from "./ContentMedia/content_media";
import Comment from "./Comment/comment";

function PostItem() {


    return (
        <React.Fragment>
            <div className="post-item--container">
                <HeaderPost />
                <div className="content-container">
                    <ContentText />
                    <ContentMedia />
                </div>
                <Comment />
            </div>
        </React.Fragment>
    );
}

export default PostItem;
