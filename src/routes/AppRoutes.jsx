import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Clients } from "../pages/Clients";
import { Finances } from "../pages/Finances";
import { Login } from "../pages/Login";
import { Messages } from "../pages/Messages";
import { Rewards } from "../pages/Rewards";
import { Signup } from "../pages/Signup";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/finances" element={<Finances />} />
                <Route path="/login" element={<Login />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/rewards" element={<Rewards />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    )
}