import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Login from "./login.jsx";
import Register from "./Register.jsx";
import Dashboard from "./Dashboard.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/Register" element={<Register/>}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/dashboard" element={<Dashboard />}/>
                <Route path="/room/:roomId" element={<App />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);