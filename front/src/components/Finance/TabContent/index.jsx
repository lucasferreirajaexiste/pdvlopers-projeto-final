import styles from "./TabContent.module.css";

import { Header } from "../Header";

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
