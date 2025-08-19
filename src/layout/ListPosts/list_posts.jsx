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
