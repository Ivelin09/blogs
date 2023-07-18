import { useRef } from 'react';

const ReplyField = ({ parentId }) => {

    const comment = useRef();

    const handleSubmit = async () => {
        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/comment`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: parentId,
                description: comment.current.value
            })
        });
    }

    return (
        <div>
            <textarea className="reply" type="text" ref={comment} />
            <button onClick={handleSubmit}>Send</button>
        </div>
    )
}

export default ReplyField;