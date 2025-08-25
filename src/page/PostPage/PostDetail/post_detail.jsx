import React, { useEffect, useState } from "react";
import "./post_detail.scss";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { MdOutlineClose } from "react-icons/md";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import HeaderPost from "../../../layout/ListPosts/PostItem/HeaderPost/header_post";
import ContentText from "../../../layout/ListPosts/PostItem/ContentText/content_text";
import Comment from "../../../layout/ListPosts/PostItem/Comment/comment";
import { getData } from "../../../ultils/fetchAPI/fetch_API";
import { API_POST_DETAIL } from "../../../API/api_server";
import generateContent from "../../../config/ai_studio.config";

function PostDetail({ titlePage }) {
  const { post_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Đặt tiêu đề trang
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  // Lấy dữ liệu bài viết
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(API_POST_DETAIL(post_id));
        if (response?.status) {
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching post detail:", error);
      }
    };
    if (post_id) fetchData();
  }, [post_id]);

  // Lắng nghe phím ESC để quay lại
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (location.state?.from) {
          navigate(location.state.from); // Quay lại trang trước
        } else {
          navigate(-1); // Quay lại trong lịch sử
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, location.state]);

  // Chuyển ảnh tiếp theo
  const handleNext = () => {
    setCurrentImageIndex((prev) =>
      prev < (data.media?.length || 0) - 1 ? prev + 1 : 0
    );
  };

  // Chuyển ảnh trước đó
  const handlePrev = () => {
    setCurrentImageIndex((prev) =>
      prev > 0 ? prev - 1 : (data.media?.length || 0) - 1
    );
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="post-detail">
        <div className="post-detail--container">
          <div className="post-detail--media">
            {/* Nút đóng */}
            <div
              className="close"
              onClick={() => navigate(location.state?.from || -1)}
            >
              <MdOutlineClose />
            </div>

            {/* Nút chuyển ảnh trước */}
            {data.media && data.media.length > 1 && (
              <div className="btn btn-prev" onClick={handlePrev}>
                <FaChevronLeft />
              </div>
            )}

            {/* Ảnh/Video hiện tại */}
            <div className="content-media--main">
              {data.media && data.media.length > 0 ? (
                data.media[currentImageIndex]?.media_type === "image" ? (
                  <img
                    onError={(e) => {
                      e.target.src =
                        "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                    }}
                    src={data.media[currentImageIndex]?.media_link}
                    alt={`media-${currentImageIndex}`}
                  />
                ) : data.media[currentImageIndex]?.media_type === "video" ? (
                  <video
                    src={data.media[currentImageIndex]?.media_link}
                    controls
                    autoPlay
                    loop
                  />
                ) : null
              ) : (
                <h4 style={{ height: "100%" }} className="box-center">
                  Bài viết không có file phương tiện
                </h4>
              )}
            </div>

            {/* Nút chuyển ảnh tiếp */}
            {data.media && data.media.length > 1 && (
              <div className="btn btn-next" onClick={handleNext}>
                <FaChevronRight />
              </div>
            )}
          </div>

          <div className="post-detail--comment">
            {/* Header của bài viết */}
            <HeaderPost data={data} />

            {/* Nội dung text của bài viết */}
            {data?.post_text &&
              !(
                data?.post_text === "<p></p>" ||
                data?.post_text === "<span></span>"
              ) && <ContentText data={data} />}

            {/* Phần bình luận */}
            <Comment setShowCommentPage={true} data={data} />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default PostDetail;
