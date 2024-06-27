import React from "react";
import StoryItem from "./StoryItem/story_item";
import "./list_stories.scss";
function ListStories() {
    return (
        <React.Fragment>
            <div className="list-stories--container">
                <ul className="list-stories">
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
            </div>
        </React.Fragment>
    );
}

export default ListStories;