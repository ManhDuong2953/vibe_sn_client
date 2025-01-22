import React, { useEffect, useRef, useState } from "react";
import "./list_posts.scss";
import ListStories from "../ListStories/list_stories";
import FormPost from "../../component/FormPost/form_post";
import PostItem from "./PostItem/post_item";
import { getData } from "../../ultils/fetchAPI/fetch_API";
import { API_GET_POSTS } from "../../API/api_server";

function ListPosts() {
  const [listPost, setListPost] = useState([]);
  const scrollPosition = useRef(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Fetch dữ liệu bài viết
    const fetchData = async () => {
      try {
        const response = await getData(API_GET_POSTS);
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
  }, []);

  useEffect(() => {
    // Chỉ khôi phục vị trí cuộn sau khi dữ liệu đã được tải
    if (isDataLoaded) {
      window.scrollTo(0, scrollPosition.current);
    }

    return () => {
      // Lưu vị trí cuộn trước khi rời khỏi trang
      scrollPosition.current = window.scrollY;
    };
  }, [isDataLoaded]);

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
        </span>
      </div>
    </React.Fragment>
  );
}

export default ListPosts;
