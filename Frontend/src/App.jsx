import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket, {
    codeChange,
    joinRoom,
    sendMessage
} from "./socket";

function App() {
    const { roomId } = useParams();
    const navigate = useNavigate();

    const editorRef = useRef(null);
    const isRemoteChange = useRef(false);
    const [messages, setMessages] = useState([]);
const [messageInput, setMessageInput] = useState("");

    function handleEditorChange(value) {

        console.log("Code changed:", value);

        if (isRemoteChange.current) {

            isRemoteChange.current = false;

            return;
        }

        codeChange(roomId, value);
    }

    function handleEditorMount(editor) {
        editorRef.current = editor;
    }
    function handleSendMessage() {

    if (!messageInput.trim()) {
        return;
    }

    sendMessage(roomId, messageInput);

    setMessages((previousMessages) => [
    ...previousMessages,
    {
        username: "You",
        message: messageInput
    }
]);

    setMessageInput("");
}
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }
        joinRoom(roomId);
    }, [roomId, navigate]);

   useEffect(() => {

    socket.on("code-change", (code) => {

        console.log(
            "FRONTEND RECEIVED CODE:",
            code
        );

        if (editorRef.current) {

            isRemoteChange.current = true;

            editorRef.current.setValue(code);
        }
    });

    return () => {
        socket.off("code-change");
    };

}, []);

    useEffect(() => {

    socket.on("receive-message", (message) => {

        console.log(
            "FRONTEND RECEIVED MESSAGE:",
            message
        );

        setMessages((previousMessages) => [
            ...previousMessages,
            message
        ]);

    });

    return () => {
        socket.off("receive-message");
    };

}, []);

    return (
        <div className="flex flex-col h-screen bg-gray-950 text-white">
            <header className="h-14 flex items-center justify-between px-5 border-b border-gray-800 bg-gray-900">
                   <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold">
                        CodeSync
                    </h1>
                    <div className="text-sm text-gray-400">
                    Room: {roomId}
                   </div>
                   </div>
                   <button className="px-4 py-2 text-sm rounded-md bg-red-600 hover:bg-red-700">
                    leave
                   </button>
            </header>
            {/* Main Content */}
        <main className="flex-1 flex min-h-0">

            {/* Editor */}
            <section className="flex-1 min-w-0">

                <Editor
                    height="100%"
                    theme="vs-dark"
                    defaultLanguage="javascript"
                    defaultValue={'console.log("Hello CodeSync");'}
                    onMount={handleEditorMount}
                    onChange={handleEditorChange}
                />

            </section>


            {/* Chat */}
            <aside className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col">

                <div className="p-4 border-b border-gray-800">
                    <h2 className="font-semibold">
                        Chat
                    </h2>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">

    {messages.map((message, index) => (
    <div key={index}>
        <p className="font-semibold">
            {message.username}
        </p>

        <p className="text-gray-300">
            {message.message}
        </p>
    </div>
))}

</div>

                <div className="flex gap-2">

    <input
        type="text"
        placeholder="Type a message..."
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                handleSendMessage();
            }
        }}
        className="flex-1 px-3 py-2 rounded-md bg-gray-800 border border-gray-700 outline-none"
    />

    <button
        onClick={handleSendMessage}
        className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700"
    >
        Send
    </button>

</div>

            </aside>

        </main>
            <footer className="h-12 flex items-center justify-between px-4 border-t border-gray-800 bg-gray-900">

            <div className="text-sm text-gray-400">
                JavaScript
            </div>

            <button className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700">
                Run Code
            </button>

        </footer>
        </div>
    );
}

export default App;