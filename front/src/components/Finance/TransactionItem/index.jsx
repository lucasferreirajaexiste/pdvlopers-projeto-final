import styles from './TransactionItem.module.css'

//icones
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

export function TransactionItem({ title, category, date, amount }) {
    const isPositive = Number(amount) >= 0;

    const formattedDate = (() => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    })();

    return (
        <div className={styles.item}>
            <div className={`${styles.iconWrapper} ${isPositive ? styles.incomeBg : styles.expenseBg}`}>
                {isPositive ? (
                    <FaArrowTrendUp className={styles.iconIncome} size={14} />
                ) : (
                    <FaArrowTrendDown className={styles.iconExpense} size={14} />
                )}
            </div>
            <div className={styles.details}>
                <span className={styles.title}>{title}</span>
                <div className={styles.meta}>
                    <span className={styles.category}>{category}</span>
                    <span className={styles.date}>{formattedDate}</span>
                </div>
            </div>
            <div
                className={
                    isPositive ? styles.amountIncome : styles.amountExpense
                }
            >
                {isPositive ? "+ " : "- "}R$ {Math.abs(amount).toFixed(2)}
            </div>
        </div>
    );
}
