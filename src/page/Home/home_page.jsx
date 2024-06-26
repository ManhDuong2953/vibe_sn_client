import React, { useEffect } from "react";
import "./home_page.scss";
import NavigativeBar from "../../component/NavigativeBar/navigative_bar";
import SideBarLeft from "../../component/SideBarLeft/side_bar_left";
import ListPosts from "../../component/ListPosts/list_posts";
import SideBarRight from "../../component/SideBarRight/side_bar_right";
function HomePage({ title }) {

    // Create a new title of the HomePage
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <React.Fragment>
            <NavigativeBar />
            <div id="content">
                <div className="content-container">
                    <SideBarLeft />
                    <ListPosts />
                    <SideBarRight />
                </div>
            </div>
        </React.Fragment>
    );
}

export default HomePage;