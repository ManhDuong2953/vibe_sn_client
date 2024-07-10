import React, { useCallback, useEffect, useState } from "react";
import "./stories_page.scss";
import { FaPlus } from "react-icons/fa6";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import StoryPageItem from "./StoryPageItem/story_page_item";
import soundClickHeart from "../../www/mp3/comedy_pop_finger_in_mouth_001.mp3";
import ClassicPostLoader from "../../skeleton/classic_post_loader";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
function StoriesPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

    const [heartQuantity, setHeartQuantity] = useState(1000)
    const [contentLoaded, setContentLoaded] = useState(false);
    setTimeout(() => {
        setContentLoaded(true);
    }, 2000);
    const handleClickHeart = useCallback(() => {
        const soundClick = document.querySelector(".sound-click--heart");
        soundClick.play();
        setHeartQuantity(heartQuantity => heartQuantity + 1);
    }, []);

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="story-main">


                <div className="container">
                    <div className="story-container">
                        <div className="stories-present">
                            <h2>Tin</h2>
                            <h4>Tin của bạn</h4>
                            <p className="description">Bạn có thể tạo tin bằng ảnh hoặc văn bản để chia sẻ với bạn bè.</p>
                            <Link to="/story/create">
                                <div className="ur-story">
                                    <FaPlus />
                                    <h5>Tạo tin của bạn</h5>
                                </div>
                            </Link>
                            <h4>Tất cả tin</h4>
                            <ul className="list-user--stories">
                                <StoryPageItem active={true} />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                                <StoryPageItem />
                            </ul>
                        </div>
                        <div className="content-story--main">

                            {contentLoaded ? (
                                <div
                                    className="content-story--container"
                                    style={{ '--background-url': `url("https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg")` }}
                                >
                                    <div className="img-content--wrapper">
                                        <div className="content-info">
                                            <div className="content-img--avt">
                                                <img src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg" alt="" />
                                            </div>
                                            <div className="content-info--detail">
                                                <div className="info">
                                                    <p className="name">Dasha Taran <b>5 giờ trước</b></p>
                                                    <MdDelete />
                                                </div>
                                                <p className="quantity-heart">
                                                    <FaHandHoldingHeart /> <p>{heartQuantity} lượt thích</p>
                                                </p>
                                            </div>
                                        </div>
                                        <img
                                            src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg"
                                            alt=""
                                            className="content"
                                        />
                                        <div className="icon-heart" onClick={() => { setTimeout(handleClickHeart, 500) }}>

                                            <lord-icon
                                                src="https://cdn.lordicon.com/ohfmmfhn.json"
                                                trigger="click"
                                                stroke="bold"
                                                state="hover-heartbeat-alt"
                                                colors="red"

                                            >
                                            </lord-icon>
                                            <p>
                                                Tặng Dasha Taran một lượt yêu thích ngay nào
                                            </p>
                                        </div>
                                    </div>
                                </div>) : (
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
