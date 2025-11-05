import { Outlet } from "react-router-dom";
import { RewardsList } from "./components";

export const RewardsListPage = () => {
  return (
    <>
      <RewardsList />
      <Outlet />
    </>
  );
};
