import React from "react";
import "./content_text.scss";

function ContentText({ data }) {
    return (
        <React.Fragment>
            <div
                className="content content-text"
                dangerouslySetInnerHTML={{ __html: data?.post_text }}
            />
        </React.Fragment>
    );
}

export default ContentText;
