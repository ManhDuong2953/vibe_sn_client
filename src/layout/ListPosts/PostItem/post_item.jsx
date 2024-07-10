import React, { useEffect, useState, useRef } from "react";
import "./post_item.scss";
import HeaderPost from "./HeaderPost/header_post";
import ContentText from "./ContentText/content_text";
import ContentMedia from "./ContentMedia/content_media";
import Comment from "./Comment/comment";
import ClassicPostLoader from "../../../skeleton/classic_post_loader";
import { IoMdMore } from "react-icons/io";
import { FaEdit } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { MdBugReport } from "react-icons/md";
import { Link } from "react-router-dom";

function PostItem() {
    const [loaded, setLoaded] = useState(true);
    const moreActionRef = useRef(null);

    useEffect(() => {
        if (loaded) {
            const boxAction = moreActionRef.current;

            const handleClick = () => {
                if (boxAction) {
                    boxAction.classList.toggle("active");
                }
            };

            if (boxAction) {
                boxAction.addEventListener("click", handleClick);
            }

            return () => {
                if (boxAction) {
                    boxAction.removeEventListener("click", handleClick);
                }
            };
        }
    }, [loaded]);

    return (
        <React.Fragment>
            <div className="post-item--container">
                {loaded ? (
                    <>
                        <div className="header-post--wrapper">
                            <HeaderPost />
                            <div className="more-action" ref={moreActionRef}>
                                <IoMdMore />
                                <ul className="box-action">
                                    <Link to="/post/123/edit"><li><FaEdit /><p>Sửa bài viết</p></li></Link>
                                    <Link><li><IoTrashBin /><p>Xóa bài viết</p></li></Link>
                                    <Link><li><MdBugReport /><p>Báo cáo bài viết</p></li></Link>
                                </ul>
                            </div>
                        </div>
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
