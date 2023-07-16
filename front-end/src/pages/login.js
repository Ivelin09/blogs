import '../styles/login.css'
import '../hooks/useMessage'
import { useState } from 'react';
import useInfo from '../hooks/useMessage';

export default function LoginPage() {
    const { message, pushMessage } = useInfo();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        const response = await fetch(`${process.env.REACT_APP_PROXY_SERVER}/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(data),
        }).then((res) => res.json());

        if (response.status != 200)
            pushMessage(response);
    }
    return (
        <>
            {message ?? message}
            <h1 className="title">Login Page</h1>
            <div className="card glass block">
                <form onSubmit={handleSubmit}>
                    <label htmlFor="first">Username</label>
                    <input name="username" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />


                    <label htmlFor="last">Password</label>
                    <input name="password" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />


                    <div>
                        <button className="btn btn-neutral">Login</button>
                    </div>
                </form>

            </div>
        </>
    )
}