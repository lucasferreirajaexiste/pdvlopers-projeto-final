import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import { Clients } from "../pages/Clients";
import { Finances } from "../pages/Finances";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";
import PrivateRoute from "../components/PrivateRoute";
import ForgotPassword from "../pages/ForgotPassword";
import { Messages } from "../pages/Messages";
import { Rewards } from "../pages/Rewards";
import { Signup } from "../pages/Signup";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route path="/clients" element={<Clients />} />
        <Route path="/finances" element={<Finances />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
