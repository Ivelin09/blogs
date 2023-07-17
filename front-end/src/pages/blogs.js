import { useState, useEffect } from 'react';
import '../styles/blogs.css'

export default function Page() {
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        const fetchBlogs = async () => {
            const blogs = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/blogs`, {
                method: 'GET'
            }).then((res) => res.json())
                .then((res) => res.message);
            setBlogs(() => blogs);
        };

        fetchBlogs();
    }, []);

    return (
        <>
            {blogs.map((el, idx) => {
                console.log(el);
                return (
                    <>
                        <div className="flex">
                            <h1>{el.title}</h1>
                            <img src={`http://localhost:8000/${el.imagePath}`} />
                        </div>
                    </>
                )
            })}
        </>
    )
}