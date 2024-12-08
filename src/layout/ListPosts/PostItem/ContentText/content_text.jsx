import React, { useState } from "react";
import "./content_text.scss";

function ContentText({ data }) {
    const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng
    const maxLength = 100; // Độ dài tối đa cho nội dung rút gọn

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const content = data?.post_text || "";
    const shouldTruncate = content.length > maxLength;

    const truncatedContent = shouldTruncate && !isExpanded
        ? content.slice(0, maxLength) + "..."
        : content;

    return (
        <React.Fragment>
            <div
                className="content content-text"
                dangerouslySetInnerHTML={{ __html: truncatedContent }}
            />
            {shouldTruncate && (
                <span className="toggle-text" onClick={toggleExpand}>
                    {isExpanded ? " Xem bớt" : " Xem thêm"}
                </span>
            )}
        </React.Fragment>
    );
}

export default ContentText;
