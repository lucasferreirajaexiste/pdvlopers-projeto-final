import { useState } from "react";
import styles from "./Tabs.module.css";

export function Tabs({ buttons = [], contents }) {
    const [tabAtiva, setTabAtiva] = useState(buttons[0]?.id);

    return (
        <div className={styles.tabsWrapper}>
            {buttons.length > 0 && (
                <div className={styles.tabsContainer}>
                    {buttons.map((btn) => (
                        <button
                            key={btn.id}
                            className={
                                tabAtiva === btn.id
                                    ? `${styles.tab} ${styles.ativa}`
                                    : styles.tab
                            }
                            onClick={() => setTabAtiva(btn.id)}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            )}

            {buttons.length > 0 ? contents[tabAtiva] : contents}
        </div>
    );
}
