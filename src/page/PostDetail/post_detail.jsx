import React, { useEffect } from "react";
import "./post_detail.scss";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import HeaderPost from "../../layout/ListPosts/PostItem/HeaderPost/header_post";
import ContentText from "../../layout/ListPosts/PostItem/ContentText/content_text";
import Comment from "../../layout/ListPosts/PostItem/Comment/comment";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate } from "react-router-dom";

function PostDetail({ titlePage }) {

    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);


    const navigate  = useNavigate();
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="post-detail">
                <div className="container post-detail--container">
                    <div className="post-detail--media">
                        <div className="close" onClick={() => navigate(-1)}><MdOutlineClose /></div>
                        <div className="btn btn-prev"><FaChevronLeft /></div>
                        <div className="content-media--main">
                            <img src="https://vcdn1-giaitri.vnecdn.net/2023/12/31/sao4-1703997513.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=n2u9joDoWVg5V9VxyyWnrw" alt="" />
                        </div>
                        <div className="btn btn-next"><FaChevronRight /></div>
                    </div>
                    <div className="post-detail--comment">
                        <HeaderPost />
                        <ContentText />
                        <Comment setShowCommentPage={true} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default PostDetail;