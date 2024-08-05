import React, { useEffect, useRef, useContext } from "react";
import "./create_story_page.scss";
import { FaWarehouse } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoText } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { ImageContext } from "../../../provider/image_context";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";

function CreateStoryPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const { setImage } = useContext(ImageContext);

    const handleFileChange = () => {
        const file = inputRef.current.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
                navigate('/story/create/preview/image');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="create-story--main">
                <div className="container">
                    <div className="create-story--container">
                        <div className="side-left">
                            <h2>Tin của bạn</h2>
                            <Link to="#">
                                <div className="store-story--direct">
                                    <FaWarehouse /> <p>Kho lưu trữ tin của bạn</p>
                                </div>
                                <div className="info-create--story">
                                    <img
                                        src="https://cdn.24h.com.vn/upload/1-2023/images/2023-01-04/Ve-dep-dien-dao-chung-sinh-cua-co-gai-sinh-nam-1999-lot-top-guong-mat-dep-nhat-the-gioi-57068584_2351143488502839_871658938696715268_n-1672812988-819-width1080height1080.jpg"
                                        alt=""
                                    />
                                    <h4>Dasha Taran</h4>
                                </div>
                            </Link>
                        </div>
                        <div className="side-right">
                            <Link to="/story/create/preview/text">
                                <div className="direct create-story--text-container">
                                    <div className="icon"><IoText /></div>
                                    <p>Tạo tin bằng văn bản</p>
                                </div>
                            </Link>
                            <label
                                htmlFor="create-story--image"
                                className="direct create-story--image-container"
                            >
                                <div className="icon"><FaImage /></div>
                                <p>Tạo tin bằng hình ảnh</p>
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="create-story--image"
                                hidden
                                ref={inputRef}
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default CreateStoryPage;
