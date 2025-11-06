import styles from "./transactionCard.module.css";

export function TransactionCard({ title, amount, subtitle, icon, color }) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span>{title}</span>
                <span className={styles.icon}>{icon}</span>
            </div>
            <strong className={styles[color]}>{amount}</strong>
            <p>{subtitle}</p>
        </div>
    )
}