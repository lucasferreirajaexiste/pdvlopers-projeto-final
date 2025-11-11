import { Search, Bell, Menu } from "lucide-react";
import styles from "./Header.module.css";
import { useLocation } from "react-router-dom";

export function Header() {
  const location = useLocation();

  const pageTitles = {
    "/": "Dashboard",
    "/clients": "Clientes",
    "/rewards": "Programa de Fidelidade",
    "/finances": "Financeiro",
    "/messages": "Mensagens",
  };

  const title = pageTitles[location.pathname] || "";

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h2 className={styles.pageTitle}>{title}</h2>
        </div>

        <div className={styles.right}>
          <button className={styles.iconButton}>
            <Bell className={styles.icon} />
          </button>
        </div>
      </div>
    </header>
  );
}
