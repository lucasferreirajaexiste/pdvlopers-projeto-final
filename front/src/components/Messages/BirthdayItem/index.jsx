import styles from './BirthdayItem.module.css'

import { IoGiftOutline } from "react-icons/io5";


export function BirthdayItem({ name, date, phoneNumber, email }) {
    // Garantir que a data esteja no horário local
    let localDate;
    if (typeof date === 'string') {
        const [year, month, day] = date.split('-').map(Number);
        localDate = new Date(year, month - 1, day); // mês começa em 0
    } else {
        localDate = date;
    }

    const formattedDate = localDate.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit"
    });

    return (
        <div className={styles.list}>
            <div className={styles.item}>
                <div className={styles.left}>
                    <div className={styles.iconWrapper}>
                        <span className={styles.icon}><IoGiftOutline /></span>
                    </div>

                    <div className={styles.details}>
                        <span className={styles.title}>{name}</span>
                        <div className={styles.meta}>
                            <span>Aniversário: {formattedDate}</span>
                        </div>
                        <div className={styles.information}>
                            <span>{phoneNumber}</span>
                            <span>{email}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
