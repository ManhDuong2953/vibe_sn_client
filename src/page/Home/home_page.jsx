import React, { useEffect } from "react";
import "./home_page.scss";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import SideBarLeft from "../../layout/SideBarLeft/side_bar_left";
import ListPosts from "../../layout/ListPosts/list_posts";
import SideBarRight from "../../layout/SideBarRight/side_bar_right";

function HomePage({ title }) {

    // Create a new title of the HomePage
    useEffect(() => {
        document.title = title;
    }, [title]);

    return (
        <React.Fragment>
            <NavigativeBar />
            <div id="content">
                <div className="content-container container">
                    <SideBarLeft />
                    <ListPosts/>
                    <SideBarRight />
                </div>
            </div>
        </React.Fragment>
    );
}

export default HomePage;