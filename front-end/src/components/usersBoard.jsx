import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import "../styles/usersBoard.css";

const Page = () => {
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState({});
    const [showSetting, setSetting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/onlineUsers`, {
                method: 'GET',
                credentials: 'include'
            }).then((res) => res.json());
            setUsers(response.message);
        }

        const fetchData = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/profile`, {
                method: 'GET',
                credentials: 'include'
            }).then((res) => res.json());

            setUser((prev) => {
                return { ...prev, ...response }

            });
            console.log('imagePath', response);
        }

        socket.on('online', (data) => {
            console.log('here?')
            if (users.includes(data.user) == true)
                return;
            setUsers((prev) => {
                if (prev.includes(data.user) == true)
                    return prev;

                return [...prev, data.user];
            });

        })
        socket.on('leave', (data) => {
            setUsers((prev) => {//asd
                const arr = [...prev];
                return arr.filter((user) => user != data.user);
            });
        })

        fetchUsers();
        fetchData();

        return () => {
            socket.off('online');
            socket.off('leave');
        }
    }, []);

    return (
        <div className="modifyGlass glass">
            <h1>My Profile</h1>
            <div className="myProfile">
                <div Nameclass="user glass">
                    <div className="avatar online">
                        <div className="w-24 rounded-full">
                            <img src={`${process.env.REACT_APP_BACK_END_SERVER}/${user.imagePath}`} onMouseEnter={() => setSetting(!showSetting)} />
                        </div>

                    </div>
                    <img className="setting" onClick={() => navigate('/profile')} src="https://cdn.icon-icons.com/icons2/1880/PNG/512/iconfinder-settings-4341324_120534.png" />
                    <h2>{user.username}</h2>
                </div>
            </div>
            <h1>Users</h1>
            {users.map((user, idx) => {
                console.log('path', user.imagePath)
                return (<div Nameclass="user glass">
                    <div className="avatar online">
                        <div className="w-24 rounded-full">
                            <img src={`${process.env.REACT_APP_BACK_END_SERVER}/${user.imagePath}`} />
                        </div>

                    </div><div><p>{user.username}</p></div></div>)

            })}
        </div>
    )
}

export default Page;