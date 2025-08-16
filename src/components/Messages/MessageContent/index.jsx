import styles from './MessageContent.module.css'


export function MessageContent({ icon, text, children }) {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <span className={styles.icon}>{icon}</span>
                <p className={styles.text}>{text}</p>
                {children}
            </div>
        </div>
    )
}