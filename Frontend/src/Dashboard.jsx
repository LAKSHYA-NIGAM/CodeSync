import { useNavigate } from "react-router-dom";

function Dashboard() {

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="h-screen bg-gray-950 text-white">

            <header className="h-14 flex items-center justify-between px-6 border-b border-gray-800 bg-gray-900">

                <h1 className="text-xl font-bold">
                    CodeSync
                </h1>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-700"
                >
                    Logout
                </button>

            </header>

            <main className="p-6">

                <h2 className="text-2xl font-semibold">
                    Welcome to CodeSync
                </h2>

                <p className="mt-2 text-gray-400">
                    Create a room or join an existing room.
                </p>

            </main>

        </div>
    );
}

export default Dashboard;