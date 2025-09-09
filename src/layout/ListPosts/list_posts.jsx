import React, { useEffect, useState } from "react";
import "./list_posts.scss";
import ListStories from "../ListStories/list_stories";
import FormPost from "../../component/FormPost/form_post";
import PostItem from "./PostItem/post_item";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_POSTS } from "../../API/api_server";

function ListPosts() {
  const [listPost, setListPost] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // Số bài viết hiển thị trên mỗi trang
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await getData(API_GET_POSTS+`?page=${currentPage}&limit=${postsPerPage}`);
        if (response?.status) {
          // Gộp thêm data mới thay vì ghi đè
          setListPost((prev) => [...prev, ...response.data]);
        }
        setIsDataLoaded(true);
      } catch (error) {
        console.error(error);
        setIsDataLoaded(true);
      }
    };

    fetchData();

  }, [currentPage]);
  // Observer chỉ cần gắn một lần
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentPage((prev) => prev + 1); // dùng callback form
        }
      });
    });

    const targetElement = document.getElementById("temp-tag");
    if (targetElement) observer.observe(targetElement);

    return () => {
      if (targetElement) observer.unobserve(targetElement);
    };
  }, []);


  return (
    <React.Fragment>
      <div id="list-post--container">
        <span className="list-post--span">
          <ListStories />
          <FormPost />
          {listPost.length > 0 ? (
            listPost.map((item, index) => <PostItem key={index} data={item} />)
          ) : isDataLoaded ? (
            <h4 className="box-center">Không có bài viết nào dành cho bạn</h4>
          ) : (
            <h4 className="box-center">Đang tải bài viết...</h4>
          )}

          {/* thẻ giả để observer tăng currentPage */}
          <div id="temp-tag" style={{ height: 100 }}></div>

        </span>
      </div>
    </React.Fragment>
  );
}

export default ListPosts;
