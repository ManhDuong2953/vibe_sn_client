import React from "react";
import "./content_media.scss";
function ContentMedia() {
    return (
        <React.Fragment>
            <div className="content content-media">
                <div className="row-content">
                    <img src="https://c4.wallpaperflare.com/wallpaper/243/676/950/dasha-taran-photoshopped-lips-face-women-hd-wallpaper-preview.jpg" alt="" />
                </div>
                <div className="row-content">
                    <img src="https://i.pinimg.com/736x/49/19/b5/4919b5fd2009ed54b3243a9844553537.jpg" alt="" />
                    <img src="https://e0.pxfuel.com/wallpapers/673/25/desktop-wallpaper-dasha-taran-thumbnail.jpg" alt="" />
                    {/* <video src="https://cdn.pixabay.com/video/2016/04/18/2849-163375551_large.mp4" controls muted></video> */}
                </div>
            </div>
        </React.Fragment>
    );
}

export default ContentMedia;