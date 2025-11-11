import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';

import { Clients } from "../pages/Clients";
import { Finances } from "../pages/Finances";
import PrivateRoute from "../components/PrivateRoute";
import { Messages } from "../pages/Messages";
import { Rewards } from "../pages/Rewards";
import { PointsOverview } from "../pages/Rewards/components";
import { RewardsListPage } from "../pages/Rewards";
import { RewardForm } from "../pages/Rewards/components";
import { HistoryPage } from "../pages/Rewards";
import { PromotionsPage } from "../pages/Rewards";
import { PromotionForm } from "../pages/Rewards/components";
import { Home } from "../pages/Home/index";


export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
       
        {/* Rotas privadas */}
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/messages" element={<Messages />} />

          <Route path="/rewards" element={<Rewards />}>
            <Route index element={<PointsOverview />} />

            <Route path="catalog" element={<RewardsListPage />}>
              <Route path="new-reward" element={<RewardForm />} />
            </Route>

            <Route path="history" element={<HistoryPage />} />

            <Route path="promotions" element={<PromotionsPage />}>
              <Route path="new-promotion" element={<PromotionForm />} />
            </Route>
          </Route>
        </Route>

        {/* Rota padrão */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

