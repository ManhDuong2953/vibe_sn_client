import React, { useEffect, useState } from "react";
import "./list_posts.scss";
import ListStories from "../ListStories/list_stories";
import FormPost from "../../component/FormPost/form_post";
import PostItem from "./PostItem/post_item";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_POSTS } from "../../API/api_server";

function ListPosts() {
  const [listPost, setListPost] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false); // Đã load ít nhất 1 lần
  const [isLoading, setIsLoading] = useState(false); // Đang gọi API
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const postsPerPage = 1; // Số bài viết mỗi trang

  const fetchData = async () => {
    try {
      if (totalRecords && listPost.length >= totalRecords) {
        return; // Đã tải hết
      }
      setIsLoading(true); // Bắt đầu gọi API
      const response = await getData(
        API_GET_POSTS + `?page=${currentPage}&limit=${postsPerPage}`
      );
      if (response?.status) {
        setListPost((prev) => [...prev, ...response.data]);
        setTotalRecords(response.totalRecords);
      }
      setIsDataLoaded(true);
    } catch (error) {
      console.error(error);
      setIsDataLoaded(true);
    } finally {
      setIsLoading(false); // Dù thành công hay fail cũng reset
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentPage((prev) => prev + 1);
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
            <>
              {listPost.map((item, index) => (
                <PostItem key={index} data={item} />
              ))}
              {isLoading && (
                <h4 className="box-center">Đang tải thêm...</h4>
              )}
            </>
          ) : isDataLoaded ? (
            <h4 className="box-center">Không có bài viết nào dành cho bạn</h4>
          ) : (
            <h4 className="box-center">Đang tải bài viết...</h4>
          )}

          <div id="temp-tag" style={{ height: 100 }}></div>
        </span>
      </div>
    </React.Fragment>
  );
}

export default ListPosts;
