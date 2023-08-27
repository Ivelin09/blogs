import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom'
import { socket } from '../socket';

import '../styles/blog.css'

import ReplyField from '../components/ReplyField';

const replies = async (comment, id) => {
    const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/reply/${id}`, {
        method: 'GET'
    }).then((res) => res.json());

    comment.subComment = response.message;
}

const Comment = ({ comment, comments, setComments }) => {
    const [showReplies, setReplies] = useState(false);
    const [showReplyField, setReplyField] = useState(false);

    const handleSubmit = async () => {
        if (!showReplies)
            await replies(comment, comment._id);

        setReplies((prev) => !prev);
    }

    const deleteComment = async () => {
        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/comment/${comment._id}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        setComments(() => {
            const arr = [...comments];
            return arr.filter((otherComment) => otherComment._id != comment._id)
        });
    }

    return (
        <div style={{ paddingLeft: 10 }} className="comment">
            <h1>{comment.author}</h1>
            <p className='description'>{comment.description}</p>
            <div onClick={handleSubmit} style={{ display: 'inline' }} >{showReplies ? <p>Hide Replies</p> : <p>View Replies</p>}</div>
            <p onClick={() => { setReplyField(true) }} style={{ display: 'inline', paddingLeft: '1%' }}> Reply </p>
            <p onClick={() => deleteComment()}> Delete </p>
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
    const [username, setUsername] = useState(null);
    const [typers, setTyper] = useState([]);

    const commentRef = useRef();
    const blogId = new URLSearchParams(document.location.search).get("id");

    const { search } = useLocation().search;
    useEffect(() => {
        const fetchBlog = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/blog/${blogId}`, {
                method: 'GET'
            }).then((res) => res.json()).then((res) => res.message);

            setBlog(response);
        };

        const fetchComments = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/comments/${blogId}`, {
                method: 'GET'
            }).then((res) => res.json()).then((res) => res.message);

            setComments(response.comments);
        };

        const fetchNickname = async () => {
            const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/authorize`, {
                method: 'GET',
                credentials: 'include'
            }).then((res) => res.json());

            setUsername(response.username);//
        };

        socket.on('typer', (socket) => {
            setTyper([...typers, socket.username]);
        });

        socket.on('typerQuit', (socket) => {
            setTyper(() => {
                const arr = [...typers];
                return arr.filter((user) => user != socket.username)
            });
        })

        socket.on('comment', (socket) => {//
            setComments((prev) => [...prev, socket])
        })

        socket.emit('blogConnect', {
            blog: blogId
        });


        fetchNickname();
        fetchComments();
        fetchBlog();

        return () => {
            socket.off('typer');
            socket.off('typerQuit');
            socket.off('comment');
        }
    }, []);

    const userIsTyping = async () => {
        socket.emit('typer', {
            blog: blogId,
            username
        });
    };

    const userQuitTyping = async () => {
        socket.emit('typerQuit', {
            blog: blogId,
            username
        });
    }

    const handleSubmit = async () => {
        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/api/comment`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: blogId,
                description: commentRef.current.value
            })
        }).then((res) => res.json());

        socket.emit("comment", {
            blog: blogId,
            ...response.comment
        });
    }
    return (
        <div className="blog">
            {blog && (<>
                <div className="card glass center">
                    <h1>{blog.title}</h1>
                    <img src={`http://localhost:8000/${blog.imagePath}`} />
                    <p>{blog.description}</p>
                    <div className="comments">
                        <h1>Comments</h1>
                        <hr />
                        {typers.length != 0 && (
                            typers.length > 1 &&
                            <p>{[...typers] + " are typing"}</p>
                            ||
                            typers.length == 1 &&
                            <p>{[...typers] + " is typing"}</p>
                        )}
                        {username && <><textarea className="textarea textarea-bordered" onChange={() => userIsTyping()} onBlur={() => userQuitTyping()} placeholder="Bio" ref={commentRef} />
                            <button className="btn blogSubmit" onClick={handleSubmit}>Send</button>
                        </>
                        }
                        {comments.map((el, idx) => {
                            return <Comment comment={el} setComments={setComments} comments={comments} key={idx} />
                        })}
                    </div>
                </div>
            </>)}
        </div>
    )
}