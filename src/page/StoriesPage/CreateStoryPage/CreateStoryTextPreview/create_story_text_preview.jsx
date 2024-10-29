import React, { useEffect, useState } from "react";
import "./create_story_text_preview.scss";
import domtoimage from 'dom-to-image';
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
function CreateStoryTextPreview({ titlePage }) {
    const [text, setText] = useState("");
    const [color, setColor] = useState("#ffffff");
    const [fontSize, setFontSize] = useState(25);
    const [fontFamily, setFontFamily] = useState("Roboto");
    const [fontWeight, setFontWeight] = useState(900);
    const [backgroundImage, setBackgroundImage] = useState(Img1); // Default background image
    const bgImages = [Img1, Img2, Img3, Img4, Img5, Img6, Img7, Img8, Img9, Img10];


    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

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
        textAlign: "center",
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

            <div className="story-create-preview">
                <div className="container">
                    <div className="story-container-preview--wrapper">
                        <div className="side-left">
                            <div className="title">
                                <BackButton />

                                <h2>Tạo tin</h2>
                            </div>
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
                                <div className="control-group">
                                    <label>Hình nền:</label>
                                    <div className="bg-images">
                                        {bgImages.map((imgItem, index) => (
                                            <img
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
                                    <button className="btn-func upload" onClick={handleUploadImage}>
                                        Đăng tin ngay
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className="side-right">
                            <p className="text-title--right">Xem trước</p>
                            <div className="preview-container">
                                <div className="preview" style={{ background: `url("${backgroundImage}") top center / cover no-repeat` }}>
                                    <p className="text-status" style={textStyle}>{text}</p>

                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div>



        </React.Fragment>
    );
}

export default CreateStoryTextPreview;