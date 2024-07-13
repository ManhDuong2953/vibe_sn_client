import React from "react";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import SuggestItem from "../../../layout/SideBarRight/Suggest/SuggestItem/suggest_item";
import PostItem from "../../../layout/ListPosts/PostItem/post_item";
import "./list_post_group.scss";
import { Link } from "react-router-dom";
import { MdOutlineGroupAdd } from "react-icons/md";
function ListPostGroupPage() {
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="list-post-group">
                <div className="container">
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