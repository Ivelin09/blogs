import '../styles/register.css'
import Cookies from "universal-cookie";

export default function Home() {
    const handleSubmit = async (event) => {
        event.preventDefault();

        const data = {
            username: event.target.username.value,
            password: event.target.password.value
        };

        console.log('data', data);
        const response = await fetch("http://localhost:5000/api/register", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify(data)
        });

        console.log('token', response.token)

    }
    return (
        <div className="block">
            <form onSubmit={handleSubmit}>
                <label htmlFor="first">Username</label>
                <input name="username" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />


                <label htmlFor="last">Password</label>
                <input name="password" type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />


                <div>
                    <button className="btn btn-neutral">Register</button>
                </div>
            </form>

        </div>
    )
}
