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
import { postData } from "../../../ultils/fetchAPI/fetch_API";
import { API_MARKETPLACE_CREATE } from "../../../API/api_server";
import { toast } from "react-toastify";
import { LoadingIcon } from "../../../ultils/icons/loading";

registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateSize,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview
);

function CreateProductPage({ titlePage }) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    document.title = titlePage;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          fetchLocation(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, [titlePage]);

  const fetchLocation = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      if (data && data.address) {
        setLocation(data.display_name); // Đặt địa chỉ vào state `location`
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Khởi tạo FormData
    const formData = new FormData();
    formData.append("product_name", productName);
    formData.append("product_description", productDescription);
    formData.append("product_category", productCategory);
    formData.append("product_price", productPrice);
    formData.append("product_location", location);
    formData.append("product_latitude", latitude);
    formData.append("product_longitude", longitude);

    // Thêm từng file vào FormData
    files.forEach((file) => {
      formData.append(`files`, file.file);
    });

    try {
      // Gửi dữ liệu qua API (thay URL bằng endpoint thực tế)
      const response = await postData(API_MARKETPLACE_CREATE, formData);

      if (response.status) {
        toast.success("Sản phẩm đã được tạo thành công!");
      } else {
        console.error("Error creating product:", response.statusText);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
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
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Mô tả sản phẩm</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  required
                  className="form-textarea"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Loại sản phẩm</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="form-control"
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
                <label>Giá sản phẩm</label>
                <input
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Vị trí</label>
                <input
                  type="text"
                  value={location}
                  readOnly
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
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={5}
                  name="files"
                  labelIdle='Kéo và thả ảnh hoặc <span class="filepond--label-action">Chọn ảnh</span>'
                  acceptedFileTypes={["image/*"]}
                />
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingIcon />
          ) : (
            <div className="btn">
              <button type="submit" className="submit-button">
                Tạo sản phẩm
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

export default CreateProductPage;
