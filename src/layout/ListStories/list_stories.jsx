import React, { useEffect, useState, useContext } from "react";
import StoryItem from "./StoryItem/story_item";
import "./list_stories.scss";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";
import { OwnDataContext } from "../../provider/own_data";
import { getData } from "../../ultils/fetchAPI/fetch_API.js";
import { API_LIST_STORY } from "../../API/api_server.js";
function ListStories() {
  const [listStories, setListStories] = useState([]);
  const [indexItemStart, setIndexItemStart] = useState(0);
  const dataOwner = useContext(OwnDataContext);
  useEffect(() => {
    const btnPrev = document.querySelector(".btn.btn-prev");
    const btnNext = document.querySelector(".btn.btn-next");

    const handleTransition = (stateClick) => {
      setIndexItemStart((prevIndex) =>
        stateClick === "next" ? prevIndex + 1 : prevIndex - 1
      );
    };

    btnPrev.addEventListener("click", () => handleTransition("prev"));
    btnNext.addEventListener("click", () => handleTransition("next"));

    return () => {
      btnPrev.removeEventListener("click", () => handleTransition("prev"));
      btnNext.removeEventListener("click", () => handleTransition("next"));
    };
  }, []);

  useEffect(() => {
    const btnPrev = document.querySelector(".btn.btn-prev");
    const btnNext = document.querySelector(".btn.btn-next");
    const listStories = document.querySelector(".list-stories");
    const totalItems = document.querySelectorAll(".story-item").length;
    const maxIndex = totalItems - 4; // 4 là số lượng phần tử hiển thị cùng lúc

    if (indexItemStart <= 0) {
      btnPrev.style.display = "none";
    } else {
      btnPrev.style.display = "block";
    }

    if (indexItemStart >= maxIndex) {
      btnNext.style.display = "none";
    } else {
      btnNext.style.display = "block";
    }

    listStories.style.transform = `translateX(calc(-25% * ${indexItemStart}))`;
  }, [indexItemStart]);

  //fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(API_LIST_STORY);
        if (response?.status) {
          // Sử dụng reduce để lấy một story cho mỗi user_id
          const uniqueStories = response.data.reduce((acc, story) => {
            // Kiểm tra nếu user_id chưa có trong acc
            if (!acc.some((item) => item.user_id === story.user_id)) {
              acc.push(story); // Thêm story vào acc
            }
            return acc;
          }, []);
          setListStories(uniqueStories); // Cập nhật state với danh sách story duy nhất
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <React.Fragment>
      <div className="list-stories--container">
        <FaCircleChevronLeft className="btn btn-prev" />
        <ul className="list-stories">
          <li className="story-item add-story--icon">
            <Link to="/story/create">
              <img
                onError={(e) => {
                  e.target.src =
                    "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                }}
                className="avt-logo"
                src={dataOwner && dataOwner?.avatar}
                alt=""
              />
              <div className="icon-container">
                <FaPlus />
                <p>Tạo tin</p>
              </div>
            </Link>
          </li>
          {listStories &&
            listStories?.map((story, index) => (
              <StoryItem key={story.story_id} story={story} index={index} />
            ))}
        </ul>
        <FaCircleChevronRight className="btn btn-next" />
      </div>
    </React.Fragment>
  );
}

export default ListStories;
