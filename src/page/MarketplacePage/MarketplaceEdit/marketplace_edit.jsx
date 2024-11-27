import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import { getData, postData } from "../../../ultils/fetchAPI/fetch_API";
import {
  API_MARKETPLACE_GET_BY_ID,
  API_MARKETPLACE_UPDATE_BY_ID,
} from "../../../API/api_server";
import "./marketplace_edit.scss";
import { LoadingIcon } from "../../../ultils/icons/loading";
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

function EditProductPage({ titlePage }) {
  const { id_product } = useParams();
  const [formData, setFormData] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_location: "",
  });
  const navigate = useNavigate();
  const [files, setFiles] = useState([]); // Quản lý ảnh FilePond
  const [isFilesChanged, setIsFilesChanged] = useState(false); // Theo dõi thay đổi file
  const originalFilesRef = useRef([]); // Lưu trữ file ban đầu trong ref
  const [loading, setLoading] = useState(false);
  // Lấy dữ liệu chi tiết sản phẩm
  useEffect(() => {
    document.title = titlePage;
    const fetchProductDetail = async () => {
      try {
        const response = await getData(API_MARKETPLACE_GET_BY_ID(id_product));
        if (response.status) {
          const product = response?.data;
          setFormData({
            product_name: product?.product.product_name || "",
            product_description: product?.product.product_description || "",
            product_price: product?.product.product_price || "",
            product_location: product?.product.product_location || "",
            product_category: product?.product.product_category || "",
          });

          // Hiển thị ảnh sẵn có từ media
          const initialFiles =
            product.media?.map((media) => ({
              source: media.media_link,
            })) || [];

          setFiles(initialFiles);
          originalFilesRef.current = initialFiles; // Lưu files ban đầu vào ref
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetail();
  }, [id_product, titlePage]);

  // So sánh file mới với file ban đầu
  const checkFilesChanged = (newFiles) => {
    if (newFiles.length !== originalFilesRef.current.length) {
      return true; // Số lượng file thay đổi
    }

    // So sánh từng file dựa trên `source` hoặc `file.name`
    const originalSources = originalFilesRef.current.map((file) => file.source);
    const newSources = newFiles.map((file) => file.source || file.file.name);

    return !newSources.every((source) => originalSources.includes(source));
  };

  // Xử lý cập nhật file trong FilePond
  const handleFileUpdate = (fileItems) => {
    setFiles(fileItems);
    const hasChanged = checkFilesChanged(fileItems);
    setIsFilesChanged(hasChanged); // Cập nhật trạng thái thay đổi
  };

  // Xử lý khi người dùng thay đổi form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const formDataToSubmit = new FormData();

      // Thêm các dữ liệu form vào FormData
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      formDataToSubmit.append("isFilesChanged", isFilesChanged);

      // Kiểm tra nếu có thay đổi file và thêm các file vào FormData
      if (isFilesChanged) {
        // Nếu có thay đổi file
        files.forEach((fileItem) => {
          const file = fileItem.file || fileItem.source;
          formDataToSubmit.append("files", file);
        });
      }
      // Gửi FormData qua API
      const response = await postData(
        API_MARKETPLACE_UPDATE_BY_ID(id_product),
        formDataToSubmit
      );

      if (response?.status) {
        navigate("/marketplace/product/detail/" + id_product);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="edit-product-container">
        <h3 className="title">Sửa Sản Phẩm</h3>
        <form onSubmit={handleSubmit} className="product-form">
          <div className="side-container">
            <div className="side-left">
              <div className="form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Mô tả sản phẩm</label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleChange}
                  required
                  className="form-textarea"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Giá sản phẩm</label>
                <input
                  type="number"
                  name="product_price"
                  value={formData.product_price}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Loại sản phẩm</label>
                <select
                  value={formData.product_category}
                  onChange={handleChange}
                  className="form-control"
                  name="product_category"
                >
                  <option value="">Chọn loại sản phẩm</option>
                  <option value="electronics">Điện tử</option>
                  <option value="furniture">Nội thất</option>
                  <option value="clothing">Thời trang</option>
                  <option value="appliances">Đồ gia dụng</option>
                  <option value="groceries">Thực phẩm</option>
                  <option value="beauty">Làm đẹp</option>
                  <option value="sports">Thể thao</option>
                  <option value="toys">Đồ chơi</option>
                  <option value="books">Sách</option>
                  <option value="automotive">Ô tô và xe máy</option>
                  <option value="health">Sức khỏe</option>
                  <option value="garden">Làm vườn</option>
                  <option value="office">Văn phòng phẩm</option>
                  <option value="jewelry">Trang sức</option>
                  <option value="pet_supplies">Đồ dùng thú cưng</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vị trí</label>
                <input
                  type="text"
                  name="product_location"
                  value={formData.product_location}
                  disabled
                  required
                  className="form-input"
                />
              </div>
            </div>
            <div className="side-right">
              <div className="form-group">
                <label>Ảnh sản phẩm</label>
                <FilePond
                  files={files}
                  onupdatefiles={handleFileUpdate}
                  allowMultiple={true}
                  maxFiles={5}
                  acceptedFileTypes={["image/*"]}
                  labelIdle='Kéo & thả file hoặc <span class="filepond--label-action">Chọn file</span>'
                />
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingIcon />
          ) : (
            <div className="btn">
              <button type="submit" className="submit-button">
                Cập nhật sản phẩm
              </button>
              <Link to="/marketplace" className="cancel-button">
                Hủy
              </Link>
            </div>
          )}
        </form>
      </div>
    </React.Fragment>
  );
}

export default EditProductPage;
