import { Outlet } from 'react-router-dom';
import { PromotionsList } from "./components";


export const PromotionsPage = () => {
  return (
    <>
      <PromotionsList />
      <Outlet /> {/* Renderizará o PromotionForm quando a rota new-promotion estiver ativa */}
    </>
  );
};