import React, { useEffect } from "react";
import "./home_page.scss";
import NavigativeBar from "../../layout/NavigativeBar/navigative_bar";
import SideBarLeft from "../../layout/SideBarLeft/side_bar_left";
import ListPosts from "../../layout/ListPosts/list_posts";
import SideBarRight from "../../layout/SideBarRight/side_bar_right";
import getToken from "../../ultils/getToken/get_token";

function HomePage({ titlePage }) {

    // Create a new title of the HomePage
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
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