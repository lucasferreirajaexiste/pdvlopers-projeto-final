import styles from './BirthdayItem.module.css'

export function BirthdayItem({ title, category, date }) {
    return (
        <div className={styles.item}>
            <div className={styles.iconWrapper}>
            </div>
            <div className={styles.details}>
                <span className={styles.title}>{title}</span>
                <div className={styles.meta}>
                    <span className={styles.category}>{category}</span>
                    <span className={styles.date}>{date}</span>
                </div>
            </div>
        </div>
    )
}