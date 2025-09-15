import React, { useContext, useEffect, useState } from "react";
import "./stories_page.scss";
import { FaPlus } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import StoryPageItem from "./StoryPageItem/story_page_item";
import soundClickHeart from "../../www/mp3/comedy_pop_finger_in_mouth_001.mp3";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import { deleteData, getData, postData } from "../../ultils/fetchAPI/fetch_API";
import {
  API_CREATE_HEART_STORY,
  API_DELETE_STORY,
  API_LIST_STORY,
  API_STORIES_BY_ID,
} from "../../API/api_server";
import { timeAgo } from "../../ultils/formatDate/format_date";
import gifHeart from "../../www/icons/ab983edacf4e446da86c72d0f0628f1d.gif";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { OwnDataContext } from "../../provider/own_data";

function StoriesPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const [heartQuantities, setHeartQuantities] = useState({});
  const [contentLoaded, setContentLoaded] = useState(false);
  const [storyData, setStoryData] = useState([]);
  const [listStories, setListStories] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { story_id } = useParams();
  const dataOwner = useContext(OwnDataContext);
  const navigate = useNavigate();
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
          setHeartQuantities(
            response.data.reduce((acc, story) => {
              acc[story.story_id] = story.heart_quantity || 0; // Đặt số lượng yêu thích ban đầu
              return acc;
            }, {})
          );
          setContentLoaded(true);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchAPI();
  }, [story_id]);

  const handleClickHeart = async (id) => {
    const soundClick = document.querySelector(".sound-click--heart");
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 1000);

    const response = await postData(API_CREATE_HEART_STORY(id));
    if (response?.status) {
      setHeartQuantities((prev) => ({
        ...prev,
        [id]: (prev[id] || 0) + 1,
      }));
    } else {
      console.error("Lỗi: Không thể cập nhật tim.");
    }
    soundClick.play();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < storyData?.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : storyData?.length - 1
    );
  };

  const handleDeleteStory = async (story_id) => {
    try {
      if (window.confirm("Bạn chắc chắn muốn xoá tin này chứ?")) {
        const response = await deleteData(API_DELETE_STORY(story_id));
        if (response?.status) {
          navigate("/");
        }
      }
    } catch (error) {
      console.error(error.message);
    }
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
                  <StoryPageItem
                    key={story.story_id}
                    story={story}
                    index={index}
                  />
                ))}
              </ul>
            </div>
            <div className="content-story--main">
              {contentLoaded && storyData?.length > 0 ? (
                <div
                  className="content-story--container"
                  style={{
                    "--background-url": `url(${storyData[currentIndex]?.media_link})`,
                  }}
                >
                  <div className="img-content--wrapper">
                    <div className="content-info">
                      <div className="white-bar">
                        {storyData.map((_, index) => (
                          <div
                            key={index}
                            className={`white-bar-segment ${
                              index === currentIndex ? "active" : ""
                            }`}
                          ></div>
                        ))}
                      </div>
                      <div className="content-img--avt">
                        <img
                          onError={(e) => {
                            e.target.src =
                              "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                          }}
                          src={storyData[currentIndex]?.avatar}
                          alt=""
                        />
                      </div>
                      <div className="content-info--detail">
                        <div className="info">
                          <p className="name">
                            {storyData[currentIndex]?.user_name}
                            <b>
                              {timeAgo(storyData[currentIndex]?.created_at)}
                            </b>
                          </p>
                          {storyData[currentIndex]?.audio_link && (
                            <audio
                              src={storyData[currentIndex]?.audio_link}
                              autoPlay
                              loop
                              hidden
                            ></audio>
                          )}
                          {storyData[currentIndex]?.user_id ===
                            dataOwner.user_id && (
                            <MdDelete
                              className="delete-icon"
                              onClick={() =>
                                handleDeleteStory(
                                  storyData[currentIndex]?.story_id
                                )
                              }
                            />
                          )}
                        </div>
                        <p className="quantity-heart">
                          <b>
                            {
                              storyData[currentIndex]?.story_privacy === 1
                                ? String.fromCodePoint(0x1f30d) // 🌍 icon
                                : String.fromCodePoint(0x1f512) // 🔒 icon
                            }
                          </b>

                          <p>
                            {heartQuantities[
                              storyData[currentIndex]?.story_id
                            ] || 0}{" "}
                            lượt thích
                          </p>
                        </p>
                      </div>
                    </div>
                    <img
                      onError={(e) => {
                        e.target.src =
                          "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                      }}
                      src={storyData[currentIndex]?.media_link}
                      alt=""
                      className="content"
                    />
                    {isVisible && (
                      <img
                        onError={(e) => {
                          e.target.src =
                            "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                        }}
                        className="icon-gift"
                        src={gifHeart}
                        alt=""
                      />
                    )}
                    <div
                      className="icon-heart"
                      onClick={() =>
                        handleClickHeart(storyData[currentIndex]?.story_id)
                      }
                    >
                      <lord-icon
                        src="https://cdn.lordicon.com/ohfmmfhn.json"
                        trigger="click"
                        stroke="bold"
                        state="hover-heartbeat-alt"
                        colors="red"
                      ></lord-icon>
                      <p>Tặng một lượt yêu thích ngay nào</p>
                    </div>
                    {storyData && storyData?.length > 1 && (
                      <>
                        <ArrowBackIosNewIcon
                          className="nav-button prev-button"
                          onClick={handlePrev}
                        />
                        <ArrowForwardIosIcon
                          onClick={handleNext}
                          className="nav-button next-button"
                        />
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="box-center">
                 Đang cố gắng tải tin...Tin có thể đã bị xóa hoặc hết hạn.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <audio
        style={{ display: "none" }}
        src={soundClickHeart}
        className="sound-click--heart"
      ></audio>
    </React.Fragment>
  );
}

export default StoriesPage;
