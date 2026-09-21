import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const  navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:3000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            console.log("Login response:", data);

            if (!response.ok) {
                alert(data.message);
                return;
            }

            localStorage.setItem("token", data.token);

             navigate("/dashboard");

        } catch (error) {

            console.log(error);
            alert("Something went wrong");

        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-950 text-white">

            <form
                onSubmit={handleLogin}
                className="w-96 bg-gray-900 p-6 rounded-lg"
            >

                <h1 className="text-2xl font-bold mb-6">
                    Login to CodeSync
                </h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-3 py-2 bg-gray-800 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 px-3 py-2 bg-gray-800 rounded"
                />

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 rounded hover:bg-blue-700"
                >
                    Login
                </button>

            </form>

        </div>
    );
}

export default Login;