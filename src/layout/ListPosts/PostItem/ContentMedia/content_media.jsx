import React from "react";
import "./content_media.scss";
import { Link } from "react-router-dom";

function ContentMedia({ data }) {
  const mediaItems = data?.media?.slice(0, 4) || []; // Giới hạn tối đa 4 ảnh

  return (
    <React.Fragment>
      <Link to={"/post/" + data?.post_id}>
        <div className="content-media">
          {/* Dòng đầu tiên (ảnh 0 và 1) */}
          <div className="row-content">
            {mediaItems.slice(0, 2).map((item, index) => (
              <React.Fragment key={index}>
                {item.media_type === "video" && (
                  <video src={item.media_link} controls muted></video>
                )}
                {item.media_type === "image" && (
                  <img src={item.media_link} alt="" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Dòng thứ hai (ảnh 2 và 3, với class active) */}
          {mediaItems.length > 2 && (
            <div className="row-content active">
              {mediaItems.slice(2, 4).map((item, index) => (
                <React.Fragment key={index}>
                  {item.media_type === "video" && (
                    <video loading="lazy" playsInline src={item.media_link} controls muted></video>
                  )}
                  {item.media_type === "image" && (
                    <img loading="lazy" src={item.media_link} alt="" />
                  )}

                  {/* Hiển thị số lượng ảnh dư nếu có nhiều hơn 4 ảnh */}
                  {index === 1 && data.media.length > 4 && (
                    <div className="more-media">
                      <p>+{data.media.length - 4}</p>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </Link>
    </React.Fragment>
  );
}

export default ContentMedia;
