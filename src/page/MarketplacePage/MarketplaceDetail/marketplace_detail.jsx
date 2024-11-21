import React, { useEffect } from "react";
import "./marketplace_detail.scss";
import { FaChevronLeft, FaFacebookMessenger } from "react-icons/fa6";
import { FaChevronRight } from "react-icons/fa6";
import { MdDeleteSweep, MdOutlineClose } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";
import HeaderPost from "../../../layout/ListPosts/PostItem/HeaderPost/header_post";
import { FaEdit } from "react-icons/fa";
import { IoMdMore } from "react-icons/io";

function MarketplaceDetail({ titlePage }) {

    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);


    const navigate = useNavigate();


    useEffect(() => {
        const btnFunc = document.querySelector(".btn-func");
        const iconMore = document.querySelector(".icon-more");
        function handleClick() {
            btnFunc.classList.toggle("active");
        }
        iconMore.addEventListener("click", handleClick);
        return () => {
            iconMore.removeEventListener("click", handleClick);
        }
    }, []);
    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="marketplace-detail">
                <div className="container marketplace-detail--container">
                    <div className="marketplace-detail--media">
                        <div className="close" onClick={() => navigate(-1)}><MdOutlineClose /></div>
                        <div className="btn btn-prev"><FaChevronLeft /></div>
                        <div className="content-media--main">
                            <img src="https://vcdn1-giaitri.vnecdn.net/2023/12/31/sao4-1703997513.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=n2u9joDoWVg5V9VxyyWnrw" alt="" />
                        </div>
                        <div className="btn btn-next"><FaChevronRight /></div>
                    </div>
                    <div className="marketplace-detail--comment">
                        <div className="header-container--detail">
                            <div className="header-detail">
                                <HeaderPost /><div className="icon-more"><IoMdMore /></div>
                            </div>
                            <div className="btn-func">
                                <Link to="/marketplace/product/detail/123/edit">
                                    <span>
                                        <FaEdit /> Sửa thông tin
                                    </span>
                                </Link>
                                <Link>
                                    <span className="delete">
                                        <MdDeleteSweep /> Xóa sản phẩm
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="info-product-container">
                            <h3 className="name-prd">Giày Tây Nam</h3>
                            <h2 className="price-prd">200.000VNĐ</h2>
                            <p className="desc-prd"><b>Chi tiết: </b>Giày tây nam làm bằng 100% chất liệu da thật.</p>
                            <p className="desc-prd"><b>Địa chỉ: </b>Hà Nội</p>
                        </div>
                        <div className="map">
                            <iframe title="Hà Nội" src="https://www.openstreetmap.org/export/embed.html?bbox=106.20002746582033%2C20.890890528372452%2C106.35932922363283%2C20.99686195227438&amp;layer=mapnik" style={{ "border": "1px solid black" }}></iframe>
                        </div>

                        <Link>
                            <div className="contact">
                                <FaFacebookMessenger />
                                Liên hệ với người bán
                            </div>
                        </Link>
                        <div className="temp"></div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    );
}

export default MarketplaceDetail;