import React, { useState } from 'react';
import './create_group.scss';
import NavigativeBar from '../../../layout/NavigativeBar/navigative_bar';

const CreateGroupPage = () => {
    const [groupName, setGroupName] = useState('');
    const [privacy, setPrivacy] = useState('public');
    const [introduction, setIntroduction] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log({ groupName, privacy, introduction });
    };

    return (
        <React.Fragment>
            <NavigativeBar />

            <div className="create-group-page">
                <form onSubmit={handleSubmit}>
                <h1>Tạo Nhóm Mới</h1>
                    <div className="form-group">
                        <label htmlFor="group-name">Tên nhóm</label>
                        <input
                            type="text"
                            id="group-name"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="privacy">Quyền riêng tư</label>
                        <select
                            id="privacy"
                            value={privacy}
                            onChange={(e) => setPrivacy(e.target.value)}
                        >
                            <option value="public">🌐 Công khai</option>
                            <option value="private">🔒 Riêng tư</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="introduction">Giới thiệu</label>
                        <textarea
                            id="introduction"
                            value={introduction}
                            onChange={(e) => setIntroduction(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Tạo Nhóm</button>
                </form>
            </div>
        </React.Fragment>
    );
};

export default CreateGroupPage;
