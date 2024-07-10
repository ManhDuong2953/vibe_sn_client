import React, { useState } from "react";
import "./profile_editor.scss";
import NavigativeBar from "../../../layout/NavigativeBar/navigative_bar";

function ProfileEditor() {
    const [formData, setFormData] = useState({
        fullName: '',
        nickName: '',
        slogan: '',
        education: '',
        location: '',
        email: '',
        password: '',
        password_old: '',
        confirm_password: '',
    });

    const [showVerificationModal, setShowVerificationModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSave = () => {
        if (!formData.email || !formData.password_old || !formData.password || !formData.confirm_password) {
            setShowVerificationModal(true);
            return;
        }

        // Xử lý lưu thông tin cá nhân sau khi nhập mã xác thực
    };

    const closeVerificationModal = () => {
        setShowVerificationModal(false);
    };

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="personal-info-editor">
                <h2 className="form-title">Chỉnh sửa thông tin cá nhân</h2>
                <form>
                    <div className="form-group full-width">
                        <label htmlFor="fullName">Họ và tên:</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="nickName">Biệt danh:</label>
                        <input
                            type="text"
                            id="nickName"
                            name="nickName"
                            value={formData.nickName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="slogan">Giới thiệu:</label>
                        <input
                            type="text"
                            id="slogan"
                            name="slogan"
                            value={formData.slogan}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="education">Từng học tại:</label>
                        <input
                            type="text"
                            id="education"
                            name="education"
                            value={formData.education}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location">Đang sống:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="password_old">Mật khẩu cũ:</label>
                        <input
                            type="password"
                            id="password_old"
                            name="password_old"
                            value={formData.password_old}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu mới:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm_password">Nhắc lại mật khẩu:</label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            value={formData.confirm_password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group full-width">
                        <button type="button" onClick={handleSave}>Lưu</button>
                    </div>
                </form>

                {showVerificationModal && (
                    <div className="verification-modal">
                        <div className="modal-content">
                            <button className="close-button" onClick={closeVerificationModal}>&times;</button>
                            <h3>Nhập mã xác thực</h3>
                            <input
                                type="text"
                                placeholder="Nhập mã xác thực..."
                            />
                            <button>Xác nhận</button>
                        </div>
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default ProfileEditor;
