import { Outlet, Link, useLocation } from "react-router-dom";
import styles from "./RewardsPage.module.css";
import { Layout } from "../../../components/Layout/Layout";


export const RewardsPage = () => {
  const location = useLocation();

  // Verificação dos links ativos
  const isActive = (path) => {
    return location.pathname === `/rewards${path ? `/${path}` : ""}`;
  };

  return (
    <Layout>
      <div className={styles.container}>

        <div className={styles.navContainer}>
          <div className={styles.navLinks}>
            <Link
              to="/rewards"
              className={`${styles.link} ${isActive("") && styles.linkActive}`}
            >
              Visão Geral
            </Link>

            <Link
              to="/rewards/catalog"
              className={`${styles.link} ${
                isActive("catalog") && styles.linkActive
              }`}
            >
              Recompensas
            </Link>

            <Link
              to="/rewards/history"
              className={`${styles.link} ${
                isActive("history") && styles.linkActive
              }`}
            >
              Histórico
            </Link>

            <Link
              to="/rewards/promotions"
              className={`${styles.link} ${
                isActive("promotions") && styles.linkActive
              }`}
            >
              Promoções
            </Link>
          </div>
        </div>

        <Outlet />
      </div>
    </Layout>
  );
};
