import styles from './button.module.css';

export function Button({ icon, text, onClick }) {
    return (
        <button className={styles.button} onClick={onClick}>
            {icon && <span className={styles.icon}>{icon}</span>}
            {text}
        </button>
    );
}