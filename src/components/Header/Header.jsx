import { Search, Bell, Menu } from "lucide-react";
import styles from "./Header.module.css";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}></div>

        <div className={styles.right}>
          <button className={styles.iconButton}>
            <Bell className={styles.icon} />
          </button>
        </div>
      </div>
    </header>
  );
}
