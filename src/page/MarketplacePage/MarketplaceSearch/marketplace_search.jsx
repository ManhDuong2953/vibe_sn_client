import React from "react";
import { Link } from "react-router-dom";
import "./marketplace_search.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";

function MarketplaceSearchPage() {
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="marketplace-container">
                <div className="side-left">
                    <h3 className="title-page">Marketplace</h3>
                    <Link to="/create-product" className="create-product-button">Tạo sản phẩm</Link>
                    <div className="search-section">
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên sản phẩm hoặc mô tả"
                            className="search-input"
                        />
                        <div className="filter-section">
                            <h4>Lọc giá</h4>
                            <input type="number" placeholder="Từ" className="filter-input" />
                            <input type="number" placeholder="Đến" className="filter-input" />
                            <h4>Lọc loại sản phẩm</h4>
                            <select className="filter-select">
                                <option value="">Chọn loại sản phẩm</option>
                                <option value="electronics">Điện tử</option>
                                <option value="furniture">Nội thất</option>
                                <option value="clothing">Thời trang</option>
                            </select>
                            <h4>Lọc theo vị trí</h4>
                            <input
                                type="text"
                                placeholder="Nhập vị trí"
                                className="filter-input"
                            />
                            <button className="filter-button">Lọc</button>
                        </div>
                    </div>
                </div>
                <div className="side-right">
                    <h3 className="product-list-title">Danh sách sản phẩm</h3>
                    <div className="product-list">
                        {/* Sản phẩm mẫu */}
                        {Array.from({ length: 5 }).map((_, index) => (
                            <Link to={`/product/${index}`} key={index} className="product-item">
                                <img src={`https://via.placeholder.com/150`} alt="Product" />
                                <div className="product-info">
                                    <h4 className="product-name">Tên sản phẩm {index + 1}</h4>
                                    <p className="product-description">Mô tả sản phẩm {index + 1}</p>
                                    <p className="product-price">Giá: 100.000 VNĐ</p>
                                    <p className="product-location">Vị trí: Hà Nội</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MarketplaceSearchPage;
