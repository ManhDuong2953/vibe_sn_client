import React from "react";
import "./list_posts.scss";
import ListStories from "../ListStories/list_stories";
function ListPosts() {
    return (
        <React.Fragment>
            <div id="list-post--container">
                <span>
                    <ListStories />
                </span>
            </div>
        </React.Fragment>
    );
}

export default ListPosts;