import { useState, useEffect } from 'react';
import '../styles/blogs.css'

import { useNavigate } from 'react-router-dom';

export default function Page() {
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBlogs = async () => {
            const blogs = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/blogs`, {
                method: 'GET'
            }).then((res) => res.json())
                .then((res) => res.message);
            setBlogs(() => blogs);
        };

        fetchBlogs();
    }, []);

    const redirect = () => {

    }

    return (
        <>
            {blogs.map((el, idx) => {
                return (
                    <>
                        <div className="flex" onClick={() => navigate(`/blog?id=${el.id}`)} >
                            <h1>{el.title}</h1>
                            <img src={`http://localhost:8000/${el.imagePath}`} />
                        </div >
                    </>
                )
            })}
        </>
    )
}