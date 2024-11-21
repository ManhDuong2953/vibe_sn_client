import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import "./marketplace_create.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";

registerPlugin(
    FilePondPluginFileEncode,
    FilePondPluginFileValidateSize,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview
);

function CreateProductPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const [files, setFiles] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle product creation
    };

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="create-product-container">
                <h3 className="title">Tạo Sản Phẩm Mới</h3>
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="side-container">


                        <div className="side-left">
                            <div className="form-group">
                                <label>Tên sản phẩm</label>
                                <input type="text" required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Mô tả sản phẩm</label>
                                <textarea required className="form-textarea"></textarea>
                            </div>
                            <div className="form-group">
                                <label>Giá sản phẩm</label>
                                <input type="number" required className="form-input" />
                            </div>
                            <div className="form-group">
                                <label>Vị trí</label>
                                <input disabled type="text" required className="form-input" />
                            </div>
                        </div>
                        <div className="side-right">

                            <div className="form-group">
                                <label>Ảnh sản phẩm</label>
                                <FilePond
                                    files={files}
                                    onupdatefiles={setFiles}
                                    allowMultiple={true}
                                    maxFiles={3}
                                    name="files"
                                    labelIdle='Kéo và thả ảnh hoặc <span class="filepond--label-action">Chọn ảnh</span>'
                                    acceptedFileTypes={['image/*']}
                                    labelFileLoadError='Lỗi khi tải tập tin'
                                    labelFileProcessing='Đang xử lý'
                                    labelFileProcessingComplete='Hoàn tất xử lý'
                                    labelFileProcessingAborted='Đã hủy xử lý'
                                    labelFileProcessingError='Lỗi xử lý'
                                    labelFileProcessingRevertError='Lỗi khi khôi phục'
                                    labelFileRemoveError='Lỗi khi xóa'
                                    labelTapToCancel='Nhấn để hủy'
                                    labelTapToRetry='Nhấn để thử lại'
                                    labelTapToUndo='Nhấn để hoàn tác'
                                    labelButtonRemoveItem='Xóa'
                                    labelButtonAbortItemLoad='Hủy'
                                    labelButtonRetryItemLoad='Thử lại'
                                    labelButtonAbortItemProcessing='Hủy'
                                    labelButtonUndoItemProcessing='Hoàn tác'
                                    labelButtonRetryItemProcessing='Thử lại'
                                    labelButtonProcessItem='Xử lý'
                                />
                            </div>
                        </div> 
                        </div>
                    <div className="btn">
                        <button type="submit" className="submit-button">Tạo sản phẩm</button>
                        <Link to="/marketplace" className="cancel-button">Hủy</Link>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default CreateProductPage;
