import React from "react";
import "./content_media.scss";
import { Link } from "react-router-dom";
import { VideoInViewport } from "../../../../ultils/viewportVideo/video_in_viewport";
export default function ContentMedia({ data }) {
  const mediaItems = data?.media?.slice(0, 4) || []; // Giới hạn tối đa 4 ảnh

  return (
    <React.Fragment>
      <Link to={"/post/" + data?.post_id}>
        <div className="content-media">
          {/* Dòng đầu tiên (ảnh 0 và 1) */}
          <div className="row-content">
            {mediaItems.slice(0, 2).map((item, index) => (
              <React.Fragment key={index}>
                {item.media_type === "video" ? (
                  <VideoInViewport src={item.media_link} />
                ) : (
                  <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={item.media_link} alt="" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Dòng thứ hai (ảnh 2 và 3, với class active) */}
          {mediaItems.length > 2 && (
            <div className="row-content active">
              {mediaItems.slice(2, 4).map((item, index) => (
                <React.Fragment key={index}>
                  {item.media_type === "video" ? (
                    <VideoInViewport src={item.media_link} />
                  ) : (
                    <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}loading="lazy" src={item.media_link} alt="" />
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
