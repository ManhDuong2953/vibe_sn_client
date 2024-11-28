import React, { useEffect, useState } from "react";
import "./search_page.scss";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import ListSuggest from "../../layout/SideBarRight/Suggest/list_suggest";
import ListPosts from "../../layout/ListPosts/list_posts";
import PostItem from "../../layout/ListPosts/PostItem/post_item";
import SuggestItem from "../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import { useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../ultils/fetchAPI/fetch_API";
import {
  API_SEARCH_GROUP,
  API_SEARCH_POST,
  API_SEARCH_USERS,
} from "../../API/api_server";
import GroupItem from "../../component/GroupItem/group_item";

const SearchPage = ({ titlePage }) => {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialSearchTerm = query.get("searchString") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [filter, setFilter] = useState("users"); // 'users', 'groups', 'posts'

  const handleInput = (e) => {
    setSearchTerm(e);
  };

  const handleSubmit = (e) => {
    if (e === "Enter") {
      navigate(`/search?searchString=` + searchTerm);
    }
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="search-page">
        <div className="left-panel">
          <h1>Tìm kiếm</h1>
          <input
            type="text"
            value={searchTerm}
            onKeyDown={(e) => handleSubmit(e.key)}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Tìm kiếm..."
          />
          <div className="filters">
            <div className="filter">
              <input
                type="checkbox"
                id="users"
                checked={filter === "users"}
                onChange={() => setFilter("users")}
              />
              <label htmlFor="users">Người dùng</label>
            </div>
            <div className="filter">
              <input
                type="checkbox"
                id="groups"
                checked={filter === "groups"}
                onChange={() => setFilter("groups")}
              />
              <label htmlFor="groups">Nhóm</label>
            </div>
            <div className="filter">
              <input
                type="checkbox"
                id="posts"
                checked={filter === "posts"}
                onChange={() => setFilter("posts")}
              />
              <label htmlFor="posts">Bài viết</label>
            </div>
          </div>
        </div>
        <div className="right-panel">
          <div className="results">
            {/* Render results based on the selected filter */}
            {filter === "users" && <UserResults searchTerm={searchTerm} />}
            {filter === "groups" && <GroupResults searchTerm={searchTerm} />}
            {filter === "posts" && <PostResults searchTerm={searchTerm} />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const UserResults = ({ searchTerm }) => {
  const [data, setData] = useState([]);
  const fetchSearchUsers = async () => {
    try {
      const response = await postData(API_SEARCH_USERS, {
        keyword: searchTerm,
      });
      if (response?.status) {
        setData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSearchUsers();
  }, [searchTerm]);

  return (
    <React.Fragment>
      <div id="user-container">
        <div className="title">
          Có {data?.length || 0} người dùng là kết quả của: <i>{searchTerm}</i>
        </div>
        {data?.length > 0 ? (
          data.map((item, index) => <SuggestItem key={index} data={item} />)
        ) : (
          <h4 className="box-center">
            Không có người dùng nào phù hợp với kết quả tìm kiếm!
          </h4>
        )}
      </div>
    </React.Fragment>
  );
};

const GroupResults = ({ searchTerm }) => {
  const [data, setData] = useState([]);
  const fetchSearchGroups = async () => {
    try {
      const response = await postData(API_SEARCH_GROUP, {
        keyword: searchTerm,
      });
      if (response?.status) {
        setData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSearchGroups();
  }, [searchTerm]);
  console.log(data);

  return (
    <React.Fragment>
      <div id="group-container">
        <div className="title">
          Có {data?.length || 0} nhóm là kết quả của: <i>{searchTerm}</i>
        </div>

        {data?.length > 0 ? (
          data.map((item, index) => <GroupItem key={index} data={item} />)
        ) : (
          <h4 className="box-center">
            Không có nhóm nào phù hợp với kết quả tìm kiếm!
          </h4>
        )}
      </div>
    </React.Fragment>
  );
};

const PostResults = ({ searchTerm }) => {
  const [data, setData] = useState([]);
  const fetchSearchPost = async () => {
    try {
      const response = await postData(API_SEARCH_POST, {
        keyword: searchTerm,
      });
      if (response?.status) {
        setData(response?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchSearchPost();
  }, [searchTerm]);
  return (
    <React.Fragment>
      <div id="post-container">
        <div className="title">
          Có {data?.length || 0} bài viết là kết quả của: <i>{searchTerm}</i>
        </div>

        {data?.length > 0 ? (
          data.map((item, index) => <PostItem key={index} data={item} />)
        ) : (
          <h4 className="box-center">
            Không có bài viết nào phù hợp với kết quả tìm kiếm!
          </h4>
        )}
      </div>
    </React.Fragment>
  );
};

export default SearchPage;
