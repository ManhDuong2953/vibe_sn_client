import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./marketplace_search.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import { IoMdAddCircle } from "react-icons/io";
import Pagination from "../../../layout/Pagination/pagination";
import { FaLocationCrosshairs } from "react-icons/fa6";

function MarketplaceSearchPage({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="marketplace-container">
        <div className="side-left">
          <h3 className="title-page">Marketplace</h3>
          <Link to="/marketplace/create" className="create-product-button">
            <IoMdAddCircle /> Tạo sản phẩm
          </Link>
          <div className="search-section">
            <input
              type="text"
              placeholder=" 🔍Tìm kiếm theo tên sản phẩm hoặc mô tả"
              className="search-input"
            />
            <span className="my-product-checkbox">
              <input type="checkbox" name="" id="my-prd" />
              <label htmlFor="my-prd">Sản phẩm của tôi</label>
            </span>
            <div className="filter-section">
              <h4>Lọc giá</h4>
              <span>
                <input
                  type="number"
                  placeholder="Từ"
                  className="filter-input"
                />
                <input
                  type="number"
                  placeholder="Đến"
                  className="filter-input"
                />
              </span>
              <h4>Lọc loại sản phẩm</h4>
              <select className="filter-select">
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

              <h4>Lọc theo vị trí</h4>
              <input
                type="text"
                placeholder="Nhập vị trí"
                className="filter-input"
              />
              <span className="nearest">
                <FaLocationCrosshairs />
                Gần bạn nhất
              </span>
              <button className="filter-button">Lọc</button>
            </div>
          </div>
        </div>
        <div className="side-right">
          <h3 className="product-list-title">Danh sách sản phẩm</h3>
          <ul className="product-list">
            {/* Sản phẩm mẫu */}
            {Array.from({ length: 20 }).map((_, index) => (
              <Link
                to={`/marketplace/product/detail/${index}`}
                key={index}
                className="product-item"
              >
                <li>
                  <img
                    src={`https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg`}
                    alt="Product"
                  />
                  <div className="product-info">
                    <h4 className="product-name">Giày Tây Nam {index + 1}</h4>
                    <p className="product-description">
                      Giày tây nam chính hãng làm bằng 100% da thật.
                    </p>
                    <p className="product-price">
                      Giá: <b>100.000 VNĐ</b>
                    </p>
                    <p className="product-location">
                      Vị trí: <b>Hà Nội</b>
                    </p>
                  </div>
                </li>
              </Link>
            ))}
            <Pagination totalPages={10} currentPage={4} />
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MarketplaceSearchPage;
