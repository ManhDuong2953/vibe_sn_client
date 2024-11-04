import React, { useEffect, useState } from "react";
import "./stories_page.scss";
import { FaPlus, FaHandHoldingHeart } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import StoryPageItem from "./StoryPageItem/story_page_item";
import soundClickHeart from "../../www/mp3/comedy_pop_finger_in_mouth_001.mp3";
import ClassicPostLoader from "../../skeleton/classic_post_loader";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import { getData, postData } from "../../ultils/fetchAPI/fetch_API";
import { API_CREATE_HEART_STORY, API_LIST_STORY, API_STORIES_BY_ID } from "../../API/api_server";
import { timeAgo } from "../../ultils/formatDate/format_date";
import gifHeart from "../../www/icons/ab983edacf4e446da86c72d0f0628f1d.gif";

function StoriesPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const [heartQuantity, setHeartQuantity] = useState(0);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [storyData, setStoryData] = useState([]);
  const [listStories, setListStories] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { story_id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getData(API_LIST_STORY);
        if (response?.status) {
          const uniqueStories = response.data.reduce((acc, story) => {
            if (!acc.some((item) => item.user_id === story.user_id)) {
              acc.push(story);
            }
            return acc;
          }, []);
          setListStories(uniqueStories);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!story_id) return;
    const fetchAPI = async () => {
      try {
        const response = await getData(API_STORIES_BY_ID(story_id));
        if (response?.status) {
          setStoryData(response.data);
          setContentLoaded(true);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAPI();
  }, [story_id]);

  const handleClickHeart = async () => {
    const soundClick = document.querySelector(".sound-click--heart");
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 1000);
    const response = await postData(API_CREATE_HEART_STORY(story_id));
    if (response?.status) {
      setHeartQuantity((prev) => prev + 1);
    } else {
      console.error("Lỗi: Không thể cập nhật tim.");
    }
    soundClick.play();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < storyData.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : storyData.length - 1
    );
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="story-main">
        <div className="container">
          <div className="story-container">
            <div className="stories-present">
              <h2>Tin</h2>
              <h4>Tin của bạn</h4>
              <p className="description">
                Bạn có thể tạo tin bằng ảnh hoặc văn bản để chia sẻ với bạn bè.
              </p>
              <Link to="/story/create">
                <div className="ur-story">
                  <FaPlus />
                  <h5>Tạo tin của bạn</h5>
                </div>
              </Link>
              <h4>Tất cả tin</h4>
              <ul className="list-user--stories">
                {listStories.map((story, index) => (
                  <StoryPageItem key={story.story_id} story={story} index={index} />
                ))}
              </ul>
            </div>
            <div className="content-story--main">
              {contentLoaded && storyData.length > 0 ? (
                <div className="content-story--container" style={{ "--background-url": `url(${storyData[currentIndex]?.media_link})` }}>
                  <div className="img-content--wrapper">
                    <div className="content-info">
                      <div className="content-img--avt">
                        <img src={storyData[currentIndex]?.user_avatar} alt="" />
                      </div>
                      <div className="content-info--detail">
                        <div className="info">
                          <p className="name">
                            {storyData[currentIndex]?.user_name} <b>{timeAgo(storyData[currentIndex]?.created_at)}</b>
                          </p>
                          <audio src={storyData[currentIndex]?.audio_link} autoPlay loop hidden></audio>
                          <MdDelete />
                        </div>
                        <p className="quantity-heart">
                          <FaHandHoldingHeart /> <p>{heartQuantity} lượt thích</p>
                        </p>
                      </div>
                    </div>
                    <img src={storyData[currentIndex]?.media_link} alt="" className="content" />
                    {isVisible && <img className="icon-gift" src={gifHeart} alt="" />}
                    <div className="icon-heart" onClick={handleClickHeart}>
                      <lord-icon src="https://cdn.lordicon.com/ohfmmfhn.json" trigger="click" stroke="bold" state="hover-heartbeat-alt" colors="red"></lord-icon>
                      <p>Tặng Dasha Taran một lượt yêu thích ngay nào</p>
                    </div>
                     {/* Nút điều hướng Previous và Next */}
                     <button onClick={handlePrev} className="nav-button prev-button">Previous</button>
                    <button onClick={handleNext} className="nav-button next-button">Next</button>
                
                  </div>
                </div>
              ) : (
                <div className="loading-skeleton" style={{ transform: "translateX(25%)" }}>
                  <ClassicPostLoader />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <audio style={{ display: "none" }} src={soundClickHeart} className="sound-click--heart"></audio>
    </React.Fragment>
  );
}

export default StoriesPage;
