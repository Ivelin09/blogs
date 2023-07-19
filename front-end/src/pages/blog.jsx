import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import '../styles/blog.css'

import ReplyField from '../components/ReplyField';

const replies = async (comment, id) => {
    const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/replies/${id}`, {
        method: 'GET'
    }).then((res) => res.json());

    comment.subComment = response.message;
    console.log(response);
}

const Comment = ({ comment }) => {
    const [showReplies, setReplies] = useState(false);
    const [showReplyField, setReplyField] = useState(false);

    const handleSubmit = async () => {
        if (!showReplies)
            await replies(comment, comment._id);

        setReplies((prev) => !prev);
    }

    return (
        <div style={{ paddingLeft: 10 }} className="comment">
            <h1>{comment.author}</h1>
            <p className='description'>{comment.description}</p>
            <div onClick={handleSubmit} style={{ display: 'inline' }} >{showReplies ? <p>Hide Replies</p> : <p>View Replies</p>}</div>
            <p onClick={() => { setReplyField(true) }} style={{ display: 'inline', paddingLeft: '1%' }}> Reply </p>
            {showReplyField && <ReplyField parentId={comment._id} />}
            {showReplies && comment.subComment &&
                comment.subComment.map((curr, subIdx) => {
                    return <Comment key={subIdx} comment={curr} idx={subIdx} />;
                })
            }
        </div>
    )
}


export default function Page() {
    const [blog, setBlog] = useState(null);
    const [comments, setComments] = useState([]);

    const commentRef = useRef();
    const blogId = new URLSearchParams(document.location.search).get("id");

    const { search } = useLocation().search;
    useEffect(() => {
        const fetchBlog = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/blog/${blogId}`, {
                method: 'GET'
            }).then((res) => res.json()).then((res) => res.message);

            setBlog(response);
        };

        const fetchComments = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/comments/${blogId}`, {
                method: 'GET'
            }).then((res) => res.json()).then((res) => res.message);

            setComments(response.comments);
        };

        fetchComments();
        fetchBlog();
    }, []);

    const handleSubmit = async () => {
        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/comment`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: blogId,
                description: commentRef.current.value
            })
        })
    }
    return (
        <>
            {blog && (<>
                <div className="card glass center">
                    <h1>{blog.title}</h1>
                    <img src={`http://localhost:8000/${blog.imagePath}`} />
                    <p>{blog.description}</p>
                    <div className="comments">
                        <h1>Comments</h1>
                        <hr />
                        <textarea className="textarea textarea-bordered" placeholder="Bio" ref={commentRef} />
                        <button className="btn blogSubmit" onClick={handleSubmit}>Send</button>
                        {comments.map((el, idx) => {
                            return <Comment comment={el} />
                        })}
                    </div>
                </div>
            </>)}
        </>
    )
}