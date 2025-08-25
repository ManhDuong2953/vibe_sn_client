import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./marketplace_search.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import { IoMdAddCircle } from "react-icons/io";
import Pagination from "../../../layout/Pagination/pagination";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { postData } from "../../../ultils/fetchAPI/fetch_API";
import { API_MARKETPLACE_SEARCH } from "../../../API/api_server";

function MarketplaceSearchPage({ titlePage }) {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filters, setFilters] = useState({
    searchText: "",
    minPrice: "",
    maxPrice: "",
    category: "",
    location: "",
    myProducts: false,
  });

  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newFilters = {
      searchText: params.get("searchText") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      category: params.get("category") || "",
      location: params.get("location") || "",
      myProducts: params.get("myProducts") === "true",
    };
    setFilters(newFilters);
  }, [location.search]);

  const fetchFilteredProducts = async () => {
    try {
      const response = await postData(API_MARKETPLACE_SEARCH, {
        query: filters.searchText.trim().toLowerCase(),
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        category: filters.category,
        location: filters.location,
        myProducts: filters.myProducts,
        currentPage: currentPage
      });
      if (response?.status) {
        setData(response.data);
        setOriginalData(response.data); // Lưu dữ liệu gốc để xử lý sắp xếp
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };



  useEffect(() => {
    fetchFilteredProducts();
  }, [filters]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [currentPage]);

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleApplyFilters = () => {
    const params = new URLSearchParams(filters);
    window.history.replaceState(null, "", `?${params.toString()}`);
    fetchFilteredProducts();
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Khoảng cách tính bằng km
  };

  const handleNearestSearch = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;

      const sortedData = [...originalData].sort((a, b) => {
        const distanceA = calculateDistance(
          latitude,
          longitude,
          a.product_latitude,
          a.product_longitude
        );
        const distanceB = calculateDistance(
          latitude,
          longitude,
          b.product_latitude,
          b.product_longitude
        );
        return distanceA - distanceB;
      });

      setData(sortedData);
    });
  };

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
              placeholder=" 🔍 Tìm kiếm theo tên sản phẩm hoặc mô tả"
              className="search-input"
              name="searchText"
              value={filters.searchText}
              onChange={handleFilterChange}
            />
            <span className="my-product-checkbox">
              <input
                type="checkbox"
                name="myProducts"
                id="my-prd"
                checked={filters.myProducts}
                onChange={handleFilterChange}
              />
              <label htmlFor="my-prd">Sản phẩm của tôi</label>
            </span>
            <div className="filter-section">
              <h4>Lọc giá</h4>
              <span>
                <input
                  type="number"
                  placeholder="Từ"
                  className="filter-input"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                />
                <input
                  type="number"
                  placeholder="Đến"
                  className="filter-input"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                />
              </span>
              <h4>Lọc loại sản phẩm</h4>
              <select
                className="filter-select"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
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

              <h4>Lọc theo vị trí</h4>
              <input
                type="text"
                placeholder="Nhập vị trí"
                className="filter-input"
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
              />
              <span className="nearest" onClick={handleNearestSearch}>
                <FaLocationCrosshairs />
                <p>Gần bạn nhất</p>
              </span>
              <button className="filter-button" onClick={handleApplyFilters}>
                Lọc
              </button>
            </div>
          </div>
        </div>
        <div className="side-right">
          <h3 className="product-list-title">Danh sách sản phẩm</h3>
          <ul className="product-list">
            {data.length > 0 ? (
              data.map((item, index) => (
                <Link
                  to={`/marketplace/product/detail/${item?.marketplace_product_id}`}
                  key={index}
                  className="product-item"
                >
                  <li>
                    <img onError={(e) => { e.target.src = "https://tenten.vn/tin-tuc/wp-content/uploads/2022/06/loi-http-error-4.png"; }}src={item?.media[0]?.media_link} alt="Product" />
                    <div className="product-info">
                      <h4 className="product-name">{item?.product_name}</h4>
                      <p className="product-description">
                        {item?.product_description}
                      </p>
                      <p className="product-price">
                        Giá:
                        <b>
                          {(Number(item?.product_price) || 0).toLocaleString() + ' ETH'}
                        </b>
                      </p>
                      <p className="product-location">
                        Vị trí: <b>{item?.product_location}</b>
                      </p>
                    </div>
                  </li>
                </Link>
              ))
            ) : (
              <h3 className="box-center">Không có sản phẩm phù hợp!</h3>
            )}
          </ul>
          {data?.length > 0 && (
            <Pagination
              totalPages={Math.ceil(data?.length / 1)}
              currentPage={currentPage}
              onPageChange={() => setCurrentPage(currentPage + 1)}
            />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default MarketplaceSearchPage;
