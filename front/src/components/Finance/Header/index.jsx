import styles from './Header.module.css'

export function Header({ title, subtitle, size = "default" }) {
    return (
        <div className={`${styles.header} ${styles[size]}`}>
            <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>

        </div>
    )
}