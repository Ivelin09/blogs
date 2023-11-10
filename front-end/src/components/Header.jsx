import '../styles/header.css'
import { useEffect, useState } from 'react';
import { socket } from '../socket';

export default () => {
    const [suggest, setSuggest] = useState([]);

    useEffect(() => {
        socket.on('suggestions', (data) => {

            setSuggest(data.message);
        })

        return () => {
            socket.off('suggestions');
        }
    }, []);

    const searching = (e) => {
        console.log(e.target.value.length);
        if (e.target.value.length == 0) {
            setSuggest([]);
            return;
        }
        console.log('teststst');
        socket.emit("searching", {
            search: e.target.value
        });
    };

    return (
        <div>
            <div className="head">
                <div className="navbar">
                    <input onChange={(e) => searching(e)} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                    <div className="indicator">
                        <span className="indicator-item badge badge-secondary">99+</span>
                        <details className="dropdown mb-32">
                            <summary className="m-1 btn">inbox</summary>
                            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52">
                                <li><a>Item 1</a></li>
                                <li><a>Item 2</a></li>
                            </ul>
                        </details>
                    </div>
                    <div className="post">
                        <button className="btn">Add a post</button>
                    </div>
                    <div className="suggestions">
                        {suggest.map((suggestion, idx) => {
                            return (<>
                                <div className="suggestion">
                                    <h1>{suggestion.title}</h1>
                                </div>
                            </>)
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}