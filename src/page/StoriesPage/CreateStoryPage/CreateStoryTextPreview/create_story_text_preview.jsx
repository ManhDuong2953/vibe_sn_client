import React, { useEffect, useState } from "react";
import "./create_story_text_preview.scss";
import domtoimage from "dom-to-image";
import NavigativeBar from "../../../../layout/NavigativeBar/navigative_bar";
import Img1 from "../../../../www/bgImgStory/1.jpg";
import Img2 from "../../../../www/bgImgStory/2.jpg";
import Img3 from "../../../../www/bgImgStory/3.jpg";
import Img4 from "../../../../www/bgImgStory/4.jpg";
import Img5 from "../../../../www/bgImgStory/5.jpg";
import Img6 from "../../../../www/bgImgStory/6.jpg";
import Img7 from "../../../../www/bgImgStory/7.jpg";
import Img8 from "../../../../www/bgImgStory/8.jpg";
import Img9 from "../../../../www/bgImgStory/9.jpg";
import Img10 from "../../../../www/bgImgStory/10.jpg";
import BackButton from "../../../../component/BackButton/back_button";
import { OwnDataContext } from "../../../../provider/own_data";
import PrivacyModal from "../../../../component/ModalPrivacy/modal_privacy";
import Button from "@mui/material/Button";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { styled } from "@mui/material/styles";
import html2canvas from "html2canvas";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
function CreateStoryTextPreview({ titlePage }) {
  const [text, setText] = useState("");
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(25);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [fontWeight, setFontWeight] = useState(900);
  const [backgroundImage, setBackgroundImage] = useState(Img1); // Default background image
  const bgImages = [
    Img1,
    Img2,
    Img3,
    Img4,
    Img5,
    Img6,
    Img7,
    Img8,
    Img9,
    Img10,
  ];

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const [imageLink, setImageLink] = useState(null);
  const [audio, setAudio] = useState();
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetSound = (e) => {
    setAudio(e);
  };

  const handleUploadImage = () => {
    const node = document.querySelector(".preview");
    setOpen(true);

    // Tạo một canvas mới
    const canvas = document.createElement("canvas");

    // Thiết lập kích thước canvas bằng với kích thước của node
    canvas.width = node.offsetWidth;
    canvas.height = node.offsetHeight;

    // Vẽ nội dung của node lên canvas
    html2canvas(node)
      .then((canvas) => {
        // Chuyển đổi canvas thành URL hình ảnh dạng base64
        const dataUrl = canvas.toDataURL("image/png");

        // Đặt URL hình ảnh vào state
        setImageLink(dataUrl);
      })
      .catch((error) => {
        console.error("Oops, something went wrong!", error);
      });
  };

  const textStyle = {
    position: "absolute",
    textAlign: "center",
    color: color,
    fontSize: `${fontSize}px`,
    fontFamily: fontFamily,
    fontWeight: fontWeight,
    cursor: "move",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
  };

  return (
    <React.Fragment>
      <NavigativeBar />

      <div className="story-create-preview">
        <div className="container">
          <div className="story-container-preview--wrapper">
            <div className="side-left">
              <div
                className="title"
                style={{ display: "flex", alignItems: "center" }}
              >
                <BackButton />
                <h2>Tạo tin</h2>
              </div>
              <div className="controls-text">
                <h3>Chỉnh sửa văn bản</h3>
                <div className="control-group">
                  <label htmlFor="text-input">Nhập văn bản:</label>
                  <input
                    maxLength={240}
                    required
                    type="text"
                    id="text-input"
                    placeholder="Thêm văn bản vào đây..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
                <div className="control-group">
                  <label htmlFor="colorPicker">Màu chữ:</label>
                  <input
                    type="color"
                    id="colorPicker"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                  />
                </div>

                <div className="control-group">
                  <label htmlFor="fontSize">Cỡ chữ:</label>
                  <input
                    type="number"
                    id="fontSize"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                  />
                </div>
                <div className="control-group">
                  <label htmlFor="fontFamily">Phông chữ:</label>
                  <select
                    id="fontFamily"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    <option
                      value="Arial"
                      style={{ fontFamily: "Arial, sans-serif" }}
                    >
                      Arial
                    </option>
                    <option
                      value="Times New Roman"
                      style={{ fontFamily: "Times New Roman, serif" }}
                    >
                      Times New Roman
                    </option>
                    <option
                      value="Verdana"
                      style={{ fontFamily: "Verdana, sans-serif" }}
                    >
                      Verdana
                    </option>
                    <option
                      value="Roboto"
                      style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                      Roboto
                    </option>
                    <option
                      value="Open Sans"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Open Sans
                    </option>
                    <option
                      value="Montserrat"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Montserrat
                    </option>
                    <option
                      value="Playfair Display"
                      style={{ fontFamily: "Playfair Display, serif" }}
                    >
                      Playfair Display
                    </option>
                    <option
                      value="Lobster"
                      style={{ fontFamily: "Lobster, cursive" }}
                    >
                      Lobster
                    </option>
                    <option
                      value="Pacifico"
                      style={{ fontFamily: "Pacifico, cursive" }}
                    >
                      Pacifico
                    </option>
                    <option
                      value="Dancing Script"
                      style={{ fontFamily: "Dancing Script, cursive" }}
                    >
                      Dancing Script
                    </option>
                  </select>
                </div>
                <div className="control-group">
                  <label htmlFor="fontWeight">Âm thanh:</label>
                  <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "white", // Ensures button text/icon will be white
                      backgroundColor: "#1976d2", // Custom button color
                      "&:hover": {
                        backgroundColor: "#115293", // Darker shade for hover
                      },
                    }}
                    startIcon={
                      <LibraryMusicIcon
                        sx={{ "& path": { color: "white !important" } }}
                      />
                    } // Force white color
                  >
                    {(audio && audio?.name) || "Tải âm thanh"}
                    <VisuallyHiddenInput
                      type="file"
                      accept="audio/*"
                      onChange={(event) => {
                        if (event.target.files && event.target.files[0]) {
                          handleSetSound(event.target.files[0]);
                        }
                      }}
                    />
                  </Button>

                  <PrivacyModal
                    image={imageLink}
                    audio={audio}
                    handleClose={handleClose}
                    open={open}
                  />
                </div>
                <div className="control-group">
                  <label>Hình nền:</label>
                  <div className="bg-images">
                    {bgImages.map((imgItem, index) => (
                      <img
                        onError={(e) => {
                          e.target.src =
                            "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png";
                        }}
                        key={index}
                        src={imgItem}
                        alt={`background ${index + 1}`}
                        onClick={() => setBackgroundImage(imgItem)}
                        className="bg-image"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="button-control">
                <div className="controls">
                  <button
                    className="btn-func upload"
                    onClick={handleUploadImage}
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            </div>
            <div className="side-right">
              <p className="text-title--right">Xem trước</p>
              <div className="preview-container">
                <div
                  className="preview"
                  style={{
                    background: `url("${backgroundImage}") top center / cover no-repeat`,
                  }}
                >
                  <p className="text-status" style={textStyle}>
                    {text}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CreateStoryTextPreview;
