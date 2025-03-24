import React, { useContext, useEffect, useState } from "react";
import "./marketplace_detail.scss";
import { FaChevronLeft, FaFacebookMessenger } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { MdDeleteSweep, MdOutlineClose } from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import HeaderPost from "../../../layout/ListPosts/PostItem/HeaderPost/header_post";
import { FaEdit, FaMoneyCheckAlt } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";
import { deleteData, getData } from "../../../ultils/fetchAPI/fetch_API";
import {
  API_MARKETPLACE_DELETE_BY_ID,
  API_MARKETPLACE_GET_BY_ID,
} from "../../../API/api_server";
import { timeAgo } from "../../../ultils/formatDate/format_date";
import PopupInfoShort from "../../../component/PopupInfoShort/popup_info_short";
import { generateMapIframe } from "../../../ultils/generateLinkMap/generateLinkMap";
import { OwnDataContext } from "../../../provider/own_data";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendTransaction } from "../../../ultils/transaction/transaction";

function MarketplaceDetail({ titlePage }) {
  useEffect(() => {
    document.title = titlePage;
  }, [titlePage]);
  const dataOwner = useContext(OwnDataContext);
  const [showFunc, setShowFunc] = useState(false);
  const { account } = useSelector((state) => state.wallet);
  const [isTrans, setIsTrans] = useState(false);

  const toggleFunc = () => {
    setShowFunc((prev) => !prev);
  };

  const navigate = useNavigate();
  const { id_product } = useParams();

  const [data, setData] = useState([]);

  const fetchProductById = async () => {
    const response = await getData(API_MARKETPLACE_GET_BY_ID(id_product));
    if (response?.status) {
      setData(response.data);
    }
  };
  useEffect(() => {
    if (!id_product) return;
    try {
      fetchProductById();
    } catch (error) {
      console.error(error);
    }
  }, [id_product]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? data.media.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === data.media.length - 1 ? 0 : prev + 1
    );
  };

  const deleteProduct = async () => {
    try {
      const response = await deleteData(
        API_MARKETPLACE_DELETE_BY_ID(id_product)
      );
      if (response?.status) {
        navigate("/marketplace");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransaction = async () => {
    if (!data) return;
    try {
      setIsTrans(true)
      await sendTransaction(data.product.seller_wallet_address, data.product.product_price)
    } catch (error) {
      toast.error(error.message);
    } finally{
      setIsTrans(false)
    }
  };
  return (
    <React.Fragment>
      <NavigativeBar />
      <div className="marketplace-detail">
        <div className="container marketplace-detail--container">
          {/* Media Section */}
          <div className="marketplace-detail--media">
            <div className="close" onClick={() => navigate("/marketplace")}>
              <MdOutlineClose />
            </div>
            <div className="btn btn-prev" onClick={handlePrevImage}>
              <FaChevronLeft />
            </div>
            <div className="content-media--main">
              {data?.media?.length > 0 && (
                <img
                  src={data.media[currentImageIndex]?.media_link}
                  alt={`Product Image ${currentImageIndex + 1}`}
                />
              )}
            </div>
            <div className="btn btn-next" onClick={handleNextImage}>
              <FaChevronRight />
            </div>
          </div>
          <div className="marketplace-detail--comment">
            <div className="header-container--detail">
              <div className="header-detail">
                <div className="header-post--item">
                  <div className="avt-img popup">
                    <PopupInfoShort user_id={data?.user?.user_id} />
                    <img
                      className="avt-member--group avt-user"
                      src={data?.user?.avatar}
                      alt=""
                    />
                  </div>
                  <div className="info-header">
                    <div className="row">
                      <Link to={"/profile/" + data?.user?.user_id}>
                        <p className="name">{data?.user?.user_name}</p>
                      </Link>
                    </div>
                    <div className="row">
                      <p className="time">
                        {timeAgo(data?.product?.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
                {dataOwner?.user_id === data?.user?.user_id && (
                  <>
                    <IoMdMore className="icon-more" onClick={toggleFunc} />
                    {showFunc && (
                      <div className="btn-func">
                        <Link
                          to={`/marketplace/product/detail/${data?.product?.marketplace_product_id}/edit`}
                        >
                          <span>
                            <FaEdit /> Sửa thông tin
                          </span>
                        </Link>
                        <Link>
                          <span
                            className="delete"
                            onClick={() => deleteProduct()}
                          >
                            <MdDeleteSweep /> Xóa sản phẩm
                          </span>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="info-product-container">
              <h3 className="name-prd">{data?.product?.product_name}</h3>
              <h2 className="price-prd">
                {" "}
                {(Number(data?.product?.product_price) || 0).toLocaleString() +
                  " ETH"}
              </h2>
              <p className="desc-prd">
                <b>Chi tiết: </b>
                {data?.product?.product_description}
              </p>
              <p className="desc-prd">
                <b>Địa chỉ: </b>
                {data?.product?.product_location}
              </p>
            </div>
            {!account && (
              <p className="text-danger">* Kết nối ví để mua sản phẩm</p>
            )}
            <div className="row-buy">
              {account && (
                <button disabled={isTrans} onClick={handleTransaction}>
                  <FaMoneyCheckAlt />
                  <b>{isTrans? 'Đang mua' : "Mua sản phẩm"}</b>
                </button>
              )}
              <Link to={"/messenger/" + data?.user?.user_id}>
                <div className="contact">
                  <FaFacebookMessenger />
                  Liên hệ với người bán
                </div>
              </Link>
            </div>
            <div className="map">
              <iframe
                src={
                  data?.product?.product_latitude &&
                  data?.product?.product_longitude
                    ? generateMapIframe(
                        data.product.product_latitude,
                        data.product.product_longitude
                      )
                    : ""
                }
                style={{ border: "1px solid black" }}
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default MarketplaceDetail;
