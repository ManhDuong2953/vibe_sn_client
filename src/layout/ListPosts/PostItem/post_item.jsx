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
import { deleteData } from "../../../ultils/fetchAPI/fetch_API";
import { API_DELETE_POST } from "../../../API/api_server";
import { toast } from "react-toastify";

function PostItem({ data }) {
  const [loaded, setLoaded] = useState(false);
  const moreActionRef = useRef(null);
  useEffect(() => {
    if (data) {
      setLoaded(true);
    }
  }, [data]);
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

  const handleDeletePost = async () => {
    try {
      if (window.confirm("Bài viết sẽ bị xoá vĩnh viễn. Tiếp tục tác vụ?")) {
        const response = await deleteData(API_DELETE_POST(data?.post_id));
        if (response.status) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <React.Fragment>
      <div className="post-item--container">
        {loaded ? (
          <>
            <div className="header-post--wrapper">
              <HeaderPost data={data} />
              <div className="more-action" ref={moreActionRef}>
                <IoMdMore />
                <ul className="box-action">
                  <Link to={`/post/${data?.post_id}/edit`}>
                    <li>
                      <FaEdit />
                      <p>Sửa bài viết</p>
                    </li>
                  </Link>
                  <li onClick={() => handleDeletePost()}>
                    <IoTrashBin />
                    <p>Xóa bài viết</p>
                  </li>
                    <li onClick={()=>toast.success("Cám ơn bạn đã báo cáo, chúng tôi sẽ xem xét và phản hồi sớm nhất!")}>
                      <MdBugReport />
                      <p>Báo cáo bài viết</p>
                    </li>
                </ul>
              </div>
            </div>
            <div className="content-container">
              {data?.post_text && data?.post_text !== "<p></p>" && (
                <ContentText data={data} />
              )}
              {data?.media?.length > 0 && <ContentMedia data={data} />}
            </div>
            <Comment />
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
