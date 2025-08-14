import { Header } from "../Header";
import styles from "./TabContent.module.css";

export function TabContent({ title, subtitle, children }) {
    return (
        <div className={styles.tabContent}>
            <div className={styles.tabContentHeader}>
                <Header title={title} subtitle={subtitle} size="small" />
            </div>
            {children}
        </div>
    );
}
