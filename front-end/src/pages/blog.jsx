import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'


export default function Page() {
    const [blog, setBlog] = useState(null);
    const { search } = useLocation().search;
    useEffect(() => {
        const fetchBlog = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/blog/${new URLSearchParams(search).get("id")}`, {
                method: 'GET'
            }).then((res) => res.json()).then((res) => res.message);

            setBlog(response);
        };

        fetchBlog();
    }, []);
    return (
        <>
            {blog && (<>

                <h1>{blog.title}</h1>
                <img src={`http://localhost:8000/${blog.imagePath}`} />
                <p>{blog.description}</p>
            </>)}
        </>
    )
}