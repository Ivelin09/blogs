import { useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

import '../styles/profile.css'

export default () => {
    const [user, setUser] = useState({});
    const search = useLocation().search;

    useEffect(() => {
        const fetchData = async () => {
            const username = new URLSearchParams(search).get('username');
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/profile/${username}`, {
                method: 'GET'
            }).then((res) => res.json());

            setUser((prev) => {
                return { ...prev, ...response }

            });
            console.log('imagePath', response);
        }

        const fetchPosts = async () => {
            const username = new URLSearchParams(search).get('username');
            console.log('username', username);
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/userPosts/username=${username}`, {
                method: 'GET'
            }).then((res) => res.json());

            setUser((prev) => {
                return { ...prev, posts: response.message }
            });
        }

        fetchPosts();
        fetchData();
    }, []);

    useEffect(() => {
        if (!document.querySelectorAll(".posts")[0].children[4])
            return;
        document.querySelectorAll(".posts")[0].children[4].style.borderBottom = 'none';
    }, [user])

    const changeProfilePciture = async () => {
        const formData = new FormData();
        formData.append("image", document.querySelectorAll("#profilePicture")[0].files[0]);

        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/profilePicutre`, {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        }).then((res) => res.json());
    }

    return (
        <div className="profile">
            <div className='modifyGlass glass'>
                <div className="profileBoard">
                    <div className="profile avatar">
                        <div className="picture w-24 rounded-full">
                            <label for="file-input">
                                <img src={`${process.env.REACT_APP_BACK_END_SERVER}/${user.imagePath}`} />
                            </label>
                            <button id="file-input" onClick={() => window.my_modal_1.showModal()}>open modal</button>
                            <dialog id="my_modal_1" className="modal">
                                <form method="dialog" className="modal-box">
                                    <p>Do you want to change your profile picture?</p>
                                    <label for="profilePicture">
                                        <h2>Select an image</h2>
                                    </label>
                                    <input id="profilePicture" type="file" name="image" className="file-input file-input-bordered w-full max-w-xs" />
                                    <div className="modal-action">
                                        <button onClick={() => changeProfilePciture()} className="btn btn-success">Save Changes</button>
                                        <button className="btn btn-error">Exit</button>
                                    </div>
                                </form>
                            </dialog>
                        </div>
                    </div>
                    <h1 className='title'>{user.username}</h1>
                </div>
                <div className="group">
                    <h1>friends</h1>
                    <div className="firends modifyGlass glass">
                        <h1>asd</h1>
                    </div>
                    <h1>posts</h1>
                    <div className="posts modifyGlass glass">
                        {user.posts && user.posts.map((post, idx) => {
                            return <h1>{post.title}</h1>
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}