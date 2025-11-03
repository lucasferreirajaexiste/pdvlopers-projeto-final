 import { Outlet } from 'react-router-dom';
import { RewardsList } from './components';

export const RewardsListPage = () => {
  return (
    <>
    <RewardsList />;
    <Outlet /> {/* Renderizará o RewardForm quando a rota new-reward estiver ativa */}
  </>
  );    
};