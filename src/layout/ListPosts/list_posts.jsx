import React from "react";
import "./list_posts.scss";
import ListStories from "../ListStories/list_stories";
import FormPost from "../../component/FormPost/form_post";
import PostItem from "./PostItem/post_item";

function ListPosts() {
    return (
        <React.Fragment>
            <div id="list-post--container">
                <span>

                    <ListStories />
                    <FormPost />

                    <PostItem />
                 
                </span>
            </div>
        </React.Fragment>
    );
}

export default ListPosts;