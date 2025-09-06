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
    // Fetch dữ liệu bài viết
    const fetchData = async () => {
      try {
        const response = await getData(API_GET_POSTS+`?page=${currentPage}&limit=${postsPerPage}`);
        if (response?.status) {
          setListPost(response.data);
        }
        setIsDataLoaded(true); // Đánh dấu đã tải xong dữ liệu
      } catch (error) {
        console.error(error);
        setIsDataLoaded(true);
      }
    };

    fetchData();

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('Element entered viewport:', entry.target);
                } else {
                    console.log('Element exited viewport:', entry.target);
                }
            });
        });

        const targetElement = document.getElementById('temp-tag');
        observer.observe(targetElement);
        

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
        {/* thẻ giả để obserser thì tăng currentPage */}
        <div id="temp-tag" style={{height: 100, background: "red"}}></div>
        </span>
      </div>
    </React.Fragment>
  );
}

export default ListPosts;
