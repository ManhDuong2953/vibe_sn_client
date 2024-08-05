import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./marketplace_edit.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";


function EditProductPage({ titlePage }) {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic to handle product creation
    };

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="edit-product-container">
                <h3 className="title">Sửa Sản Phẩm </h3>
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
                                <div className="text-danger">*Lưu ý: Ảnh đã đăng sẽ không thể chỉnh sửa</div>
                                <ul className="list-img">
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                <li><img src="https://giaycaosmartmen.com/wp-content/uploads/2020/12/cach-chup-giay-dep-6.jpg" alt="" /></li>
                                </ul>
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

export default EditProductPage;
