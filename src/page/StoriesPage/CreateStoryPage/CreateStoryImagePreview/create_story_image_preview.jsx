import React, {
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import "./create_story_image_preview.scss";
import { ImageContext } from "../../../../provider/image_context";
import Cropper from "react-easy-crop";
import Draggable from "react-draggable";
import getCroppedImg from "../../../../ultils/cropImage/get_crop_image";
import NavigativeBar from "../../../../layout/NavigativeBar/navigative_bar";
import { FaCropSimple } from "react-icons/fa6";
import BackButton from "../../../../component/BackButton/back_button";
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

function CreateStoryImagePreview({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  const { image } = useContext(ImageContext);
  const [text, setText] = useState("");
  const [showTextEditor, setShowTextEditor] = useState(false); // Trạng thái hiển thị editor text
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState(25);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [fontWeight, setFontWeight] = useState(900); // Thêm biến state cho font weight
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const previewRef = useRef(null);
  const textRef = useRef(null);
  const [imageLink, setImageLink] = useState(null);
  const [audio, setAudio] = useState();
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const generateCroppedImage = useCallback(async () => {
    if (image && croppedAreaPixels) {
      // Kiểm tra croppedAreaPixels có giá trị không
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels);
        setCroppedImage(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  }, [image, croppedAreaPixels]);

  const handleAddText = () => {
    setShowTextEditor(true);
  };

  const [open, setOpen] = useState(false);
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

  const handleClose = () => {
    setOpen(false);
  };

  const handleSetSound = (e) => {
    setAudio(e);
  };

  const textStyle = {
    position: "absolute",
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
      {image ? (
        <div className="story-create-preview">
          <div className="container">
            <div className="story-container-preview--wrapper">
              <div className="side-left">
                <div className="title">
                  <BackButton />

                  <h2>Tạo tin</h2>
                </div>
                {showTextEditor && (
                  <div className="controls-text">
                    <h3>Chỉnh sửa văn bản</h3>
                    <div className="control-group">
                      <label htmlFor="text-input">Nhập văn bản:</label>
                      <textarea
                        maxLength={240}
                        required
                        rows={4}
                        type="text"
                        id="text-input"
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
                          <MusicNoteIcon
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
                    </div>
                  </div>
                )}

                <div className="button-control">
                  {croppedImage ? (
                    <div className="controls">
                      {!showTextEditor && (
                        <button
                          className="btn-func add-text"
                          onClick={handleAddText}
                          disabled={showTextEditor}
                        >
                          <LibraryMusicIcon className="btn-func upload" /> Chữ &
                          Âm thanh
                        </button>
                      )}
                      <Button variant="contained" onClick={handleUploadImage}>
                        Hoàn tất
                      </Button>

                      <PrivacyModal
                        image={imageLink}
                        audio={audio}
                        handleClose={handleClose}
                        open={open}
                      />
                    </div>
                  ) : (
                    <button
                      className="btn-func crop"
                      onClick={generateCroppedImage}
                      disabled={!croppedAreaPixels}
                    >
                      <FaCropSimple /> Cắt ảnh
                    </button>
                  )}
                </div>
              </div>
              <div className="side-right">
                <p className="text-title--right">Xem trước</p>
                <div className="preview-container">
                  <div className="preview" ref={previewRef}>
                    {!croppedImage && (
                      <div className="crop-container">
                        <Cropper
                          image={image}
                          crop={crop}
                          zoom={zoom}
                          aspect={3 / 5}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                        />
                      </div>
                    )}
                    {croppedImage && (
                      <img
                        src={croppedImage}
                        alt="Cropped"
                        className="cropped-image"
                      />
                    )}
                    {showTextEditor && (
                      <Draggable bounds=".preview">
                        <div ref={textRef} style={textStyle}>
                          {text}
                        </div>
                      </Draggable>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <h5 className="text-center" style={{ marginTop: 100 }}>
          Lỗi trong quá trình load ảnh. Hoàn tác và thử lại!
        </h5>
      )}
    </React.Fragment>
  );
}

export default CreateStoryImagePreview;
