import React, { useEffect, useState } from "react";
import "./post_detail.scss";
import { FaChevronLeft } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import HeaderPost from "../../../layout/ListPosts/PostItem/HeaderPost/header_post";
import ContentText from "../../../layout/ListPosts/PostItem/ContentText/content_text";
import Comment from "../../../layout/ListPosts/PostItem/Comment/comment";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_POST_DETAIL } from "../../../API/api_server";

function PostDetail({ titlePage }) {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Quản lý ảnh hiện tại

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getData(API_POST_DETAIL(post_id));
      if (response.status) {
        setData(response.data);
      }
    };
    try {
      if (!post_id) return;
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [post_id]);

  // Điều hướng Next
  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < (data.media?.length || 0) - 1 ? prev + 1 : 0
    );
  };

  // Điều hướng Prev
  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : (data.media?.length || 0) - 1
    );
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="post-detail">
        <div className="container post-detail--container">
          <div className="post-detail--media">
            <div className="close" onClick={() => navigate(-1)}>
              <MdOutlineClose />
            </div>
            {data.media && data.media.length > 1 && (
              <div className="btn btn-prev" onClick={handlePrev}>
                <FaChevronLeft />
              </div>
            )}
            <div className="content-media--main">
              {data.media && data.media.length > 0 ? (
                data.media[currentImageIndex]?.media_type === "image" ? (
                  <img
                    src={data.media[currentImageIndex]?.media_link}
                    alt={`media-${currentImageIndex}`}
                  />
                ) : data.media[currentImageIndex]?.media_type === "video" ? (
                  <video controls autoPlay loop>
                    <source
                      src={data.media[currentImageIndex]?.media_link}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p>Unsupported media type</p>
                )
              ) : (
                <h4 style={{ height: "100%" }} className="box-center">
                  Bài viết không có file phương tiện
                </h4>
              )}
            </div>

            {data.media && data.media.length > 1 && (
              <div className="btn btn-next" onClick={handleNext}>
                <FaChevronRight />
              </div>
            )}
          </div>
          <div className="post-detail--comment">
            <HeaderPost data={data} />
            {data?.post_text &&
              !(
                data?.post_text === "<p></p>" ||
                data?.post_text === "<span></span>"
              ) && <ContentText data={data} />}
            <Comment setShowCommentPage={true} data={data} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PostDetail;
