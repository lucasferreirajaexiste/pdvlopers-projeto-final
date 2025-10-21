import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Gift,
  DollarSign,
  MessageSquare,
  ShoppingCart,
  LogOut,
} from "lucide-react";
import styles from "./Sidebar.module.css";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clientes", url: "/clients", icon: Users },
  { title: "Fidelidade", url: "/rewards", icon: Gift },
  { title: "Financeiro", url: "/finances", icon: DollarSign },
  { title: "Mensagens", url: "/messages", icon: MessageSquare },
];

// Dados mockados
const mockUser = {
  name: "Codifica Edu",
  email: "codificaedu@maisprati.com",
};

export function Sidebar() {

  const [user] = useState(mockUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeUrl, setActiveUrl] = useState(location.pathname);

  const handleLogout = () => {
    alert("Logout clicado!");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <ShoppingCart />
          </div>
          <div>
            <h2 className={styles.title}>Sistema PDV</h2>
            <p className={styles.subtitle}>v1.0</p>
          </div>
        </div>
      </div>


      <nav className={styles.menuGroup}>
        <p className={styles.menuGroupLabel}>Menu Principal</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeUrl === item.url;
          return (
            <div key={item.title} className={styles.menuItem}>
              <button
                className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ""
                  }`}
                onClick={() => {
                  setActiveUrl(item.url);
                  navigate(item.url);
                }}
              >
                <Icon />
                <span>{item.title}</span>
              </button>
            </div>
          );
        })}
      </nav>

      {/* usuário mockado */}
      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <p>{user.name}</p>
          <p className={styles.subtitle}>{user.email}</p>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <LogOut />
          Sair
        </button>
      </div>
    </aside >
  );
}
