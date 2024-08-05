import React, { useEffect } from "react";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import "./list_post_group.scss";
import { Link } from "react-router-dom";
import { MdOutlineGroupAdd } from "react-icons/md";
import { FaLayerGroup } from "react-icons/fa6";
function ListPostGroupPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    useEffect(() => {
        const icon = document.querySelector(".icon-gr");
        const sideLeft = document.querySelector(".side-left");
        const handleToggle = () => {
            sideLeft.classList.toggle("active");
        }
        icon.addEventListener("click", handleToggle);
        return () => {
            if (icon) {
                icon.removeEventListener("click", handleToggle);
            }
        }
    }, []);
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="list-post-group">
                <div className="container">
                    <FaLayerGroup className="icon-gr" />

                    <div className="side-left">
                        <ul className="list-gr">
                            <h2>Nhóm của bạn</h2>
                            <Link className="create-gr" to="/group/create">
                                <MdOutlineGroupAdd />
                                <h5>
                                    Tạo nhóm
                                </h5>
                            </Link>
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                            <SuggestItem />
                        </ul>
                    </div>
                    <div className="side-right">
                        <ul className="list-gr">
                            <PostItem />
                            <PostItem />
                            <PostItem />
                            <PostItem />
                            <PostItem />
                            <PostItem />
                        </ul>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default ListPostGroupPage;