import React, { useEffect, useRef, useContext } from "react";
import "./create_story_page.scss";
import { FaWarehouse } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { IoText } from "react-icons/io5";
import { FaImage } from "react-icons/fa6";
import { ImageContext } from "../../../provider/image_context";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import { OwnDataContext } from "../../../provider/own_data";

function CreateStoryPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { setImage } = useContext(ImageContext);
  const dataOwner = useContext(OwnDataContext);
  const handleFileChange = () => {
    const file = inputRef.current.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        navigate("/story/create/preview/image");
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
                    onError={(e) => {
                      e.target.src =
                        "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                    }}
                    src={dataOwner?.avatar}
                    alt=""
                  />
                  <h4>{dataOwner?.user_name}</h4>
                </div>
              </Link>
            </div>

            <div className="side-right">
              <Link to="/story/create/preview/text">
                <div className="create-story--text-container direct">
                  <div className="icon">
                    <IoText />
                  </div>
                  <p>Tạo tin bằng văn bản</p>
                </div>
              </Link>
              <label
                htmlFor="create-story--image"
                className="direct create-story--image-container"
              >
                <div className="icon">
                  <FaImage />
                </div>
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
