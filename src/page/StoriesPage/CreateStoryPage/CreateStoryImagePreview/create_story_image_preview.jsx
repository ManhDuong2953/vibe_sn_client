import React, { useContext, useRef, useState, useCallback, useEffect } from "react";
import "./create_story_image_preview.scss";
import { ImageContext } from "../../../../provider/image_context";
import ClassicPostLoader from "../../../../skeleton/classic_post_loader";
import Cropper from 'react-easy-crop';
import Draggable from "react-draggable";
import getCroppedImg from "../../../../ultils/cropImage/get_crop_image";
import domtoimage from 'dom-to-image';
import NavigativeBar from "../../../../layout/NavigativeBar/navigative_bar";
import { FaCropSimple } from "react-icons/fa6";
import { IoText } from "react-icons/io5";
import BackButton from "../../../../component/BackButton/back_button";

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
    const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const generateCroppedImage = useCallback(async () => {
        if (image && croppedAreaPixels) { // Kiểm tra croppedAreaPixels có giá trị không
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

    const handleUploadImage = () => {
        var node = document.querySelector('.preview');

        domtoimage.toPng(node)
            .then(function (dataUrl) {
                console.log(dataUrl);
            })
            .catch(function (error) {
                console.error('oops, something went wrong!', error);
            });
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
                                            <input
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
                                                <option value="Arial" style={{ fontFamily: 'Arial, sans-serif' }}>Arial</option>
                                                <option value="Times New Roman" style={{ fontFamily: 'Times New Roman, serif' }}>Times New Roman</option>
                                                <option value="Verdana" style={{ fontFamily: 'Verdana, sans-serif' }}>Verdana</option>
                                                <option value="Roboto" style={{ fontFamily: 'Roboto, sans-serif' }}>Roboto</option>
                                                <option value="Open Sans" style={{ fontFamily: 'Open Sans, sans-serif' }}>Open Sans</option>
                                                <option value="Montserrat" style={{ fontFamily: 'Montserrat, sans-serif' }}>Montserrat</option>
                                                <option value="Playfair Display" style={{ fontFamily: 'Playfair Display, serif' }}>Playfair Display</option>
                                                <option value="Lobster" style={{ fontFamily: 'Lobster, cursive' }}>Lobster</option>
                                                <option value="Pacifico" style={{ fontFamily: 'Pacifico, cursive' }}>Pacifico</option>
                                                <option value="Dancing Script" style={{ fontFamily: 'Dancing Script, cursive' }}>Dancing Script</option>
                                            </select>
                                        </div>
                                        <div className="control-group">
                                            <label htmlFor="fontWeight">Độ dày chữ:</label>
                                            <select
                                                id="fontWeight"
                                                value={fontWeight}
                                                onChange={(e) => setFontWeight(parseInt(e.target.value))}
                                            >
                                                <option value={400} style={{ fontWeight: 400 }}>400</option>
                                                <option value={500} style={{ fontWeight: 500 }}>500</option>
                                                <option value={600} style={{ fontWeight: 600 }}>600</option>
                                                <option value={700} style={{ fontWeight: 700 }}>700</option>
                                                <option value={800} style={{ fontWeight: 800 }}>800</option>
                                                <option value={900} style={{ fontWeight: 900 }}>900</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="button-control">
                                    {croppedImage ? (
                                        <div className="controls">
                                            {
                                                !showTextEditor && (<button className="btn-func add-text" onClick={handleAddText} disabled={showTextEditor}>
                                                    <IoText /> Thêm văn bản
                                                </button >)
                                            }
                                            <button className="btn-func upload" onClick={handleUploadImage}>
                                                Đăng tin ngay
                                            </button>

                                        </div>
                                    ) : (<button className="btn-func crop" onClick={generateCroppedImage} disabled={!croppedAreaPixels}>
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
                                                    aspect={1 / 2}
                                                    onCropChange={setCrop}
                                                    onZoomChange={setZoom}
                                                    onCropComplete={onCropComplete}
                                                />
                                            </div>
                                        )}
                                        {croppedImage && (
                                            <img src={croppedImage} alt="Cropped" className="cropped-image" />
                                        )}
                                        {showTextEditor && (
                                            <Draggable
                                                onDrag={(e) => {
                                                    if (textRef.current) {
                                                        setTextPosition({
                                                            x: e.clientX - textRef.current.offsetWidth / 2,
                                                            y: e.clientY - textRef.current.offsetHeight / 2
                                                        });
                                                    }
                                                }}
                                                onStop={(e) => {
                                                    if (textRef.current) {
                                                        setTextPosition({
                                                            x: e.clientX - textRef.current.offsetWidth / 2,
                                                            y: e.clientY - textRef.current.offsetHeight / 2
                                                        });
                                                    }
                                                }}
                                                bounds=".preview"
                                            >
                                                <div ref={textRef} style={textStyle} >
                                                    {text}
                                                </div>
                                            </Draggable>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

            ) : (
                <div className="loading-skeleton" style={{ marginTop: "70px", height: "calc(100vh - 56px - 40px)" }}>
                    <ClassicPostLoader />
                </div>
            )
            }

        </React.Fragment >
    );
}

export default CreateStoryImagePreview;