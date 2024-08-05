import React, { useEffect, useState } from 'react';
import './search_page.scss';
import NavigativeBar from '../../layout/NavigativeBar/navigative_bar';
import ListSuggest from '../../layout/SideBarRight/Suggest/list_suggest';
import ListPosts from '../../layout/ListPosts/list_posts';
import PostItem from '../../layout/ListPosts/PostItem/post_item';
import SuggestItem from '../../layout/SideBarRight/Suggest/SuggestItem/suggest_item';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchPage =({ titlePage })=> {
    useEffect(() => {
        document.title = titlePage;
    }, [titlePage]);
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialSearchTerm = query.get('searchString') || '';
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [filter, setFilter] = useState('users'); // 'users', 'groups', 'posts'
  

    const handleInput = (e) => {
        setSearchTerm(e);
    }

    const handleSubmit = (e) => {
        if (e === "Enter") {
            navigate(`/search?searchString=` + searchTerm);
        }
    }

    return (
        <React.Fragment>
            <NavigativeBar />
            <div className="search-page">
                <div className="left-panel">
                    <h1>Tìm kiếm</h1>
                    <input
                        type="text"
                        value={searchTerm}
                        onKeyDown={e=>handleSubmit(e.key)}
                        onChange={(e) => handleInput(e.target.value)}
                        placeholder="Tìm kiếm..."
                    />
                    <div className="filters">
                        <div className="filter">
                            <input
                                type="checkbox"
                                id="users"
                                checked={filter === 'users'}
                                onChange={() => setFilter('users')}
                            />
                            <label htmlFor="users">Người dùng</label>
                        </div>
                        <div className="filter">
                            <input
                                type="checkbox"
                                id="groups"
                                checked={filter === 'groups'}
                                onChange={() => setFilter('groups')}
                            />
                            <label htmlFor="groups">Nhóm</label>
                        </div>
                        <div className="filter">
                            <input
                                type="checkbox"
                                id="posts"
                                checked={filter === 'posts'}
                                onChange={() => setFilter('posts')}
                            />
                            <label htmlFor="posts">Bài viết</label>
                        </div>
                    </div>

                </div>
                <div className="right-panel">
                    <div className="results">
                        {/* Render results based on the selected filter */}
                        {filter === 'users' && <UserResults searchTerm={searchTerm} />}
                        {filter === 'groups' && <GroupResults searchTerm={searchTerm} />}
                        {filter === 'posts' && <PostResults searchTerm={searchTerm} />}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const UserResults = ({ searchTerm }) => {
    return (
        <React.Fragment>
            <div id="user-container">
                <div className="title">Hiển thị <b>Người dùng </b>cho: <i>{searchTerm}</i></div>
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />

                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
            </div>
        </React.Fragment>
    )
};

const GroupResults = ({ searchTerm }) => {
    return (

        <React.Fragment>
            <div id="group-container">
                <div className="title">Hiển thị <b>Nhóm </b>cho: <i>{searchTerm}</i></div>

                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
                <SuggestItem />
            </div>
        </React.Fragment>
    )
};

const PostResults = ({ searchTerm }) => {
    return (
        <React.Fragment>
            <div id="post-container">
                <div className="title">Hiển thị <b>Bài viết </b>cho: <i>{searchTerm}</i></div>
                <PostItem />
                <PostItem />
                <PostItem />
                <PostItem />
            </div>
        </React.Fragment>
    )
};

export default SearchPage;
