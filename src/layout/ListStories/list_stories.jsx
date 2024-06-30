import React, { useEffect, useState } from "react";
import StoryItem from "./StoryItem/story_item";
import "./list_stories.scss";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { FaCircleChevronLeft, FaCircleChevronRight } from "react-icons/fa6";

function ListStories() {
    const [indexItemStart, setIndexItemStart] = useState(0);

    useEffect(() => {
        const btnPrev = document.querySelector(".btn.btn-prev");
        const btnNext = document.querySelector(".btn.btn-next");

        const handleTransition = (stateClick) => {
            setIndexItemStart(prevIndex => stateClick === "next" ? prevIndex + 1 : prevIndex - 1);
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

    return (
        <React.Fragment>
            <div className="list-stories--container">
                <FaCircleChevronLeft className="btn btn-prev" />
                <ul className="list-stories">
                    <li className="story-item add-story--icon">
                        <Link to="/story/create">
                            <img className="avt-logo" src="https://gaixinhbikini.com/wp-content/uploads/2022/08/Hinh-anh-gai-Nga-dep-luvvn-51.jpg" alt="" />
                            <div className="icon-container">
                                <FaPlus />
                                <p>Tạo tin</p>
                            </div>
                        </Link>

                    </li>
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />
                    <StoryItem />

                </ul>
                <FaCircleChevronRight className="btn btn-next" />

            </div>
        </React.Fragment>
    );
}

export default ListStories;

