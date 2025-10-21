import { FaWhatsapp } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import styles from './MessageHistory.module.css';

export function MessageHistory({ title, category, numberRecipients, date }) {
    // Verifica se é email ou whatsapp
    const isEmail = category?.toLowerCase() === "email";
    const isWhatsApp = category?.toLowerCase() === "whatsapp";

    // Define ícone e classes dinamicamente
    const icon = isEmail ? (
        <MdOutlineEmail className={styles.iconEmail} size={16} />
    ) : isWhatsApp ? (
        <FaWhatsapp className={styles.iconWhatsapp} size={16} />
    ) : null;

    const bgClass = isEmail
        ? styles.emailBg
        : isWhatsApp
            ? styles.whatsappBg
            : "";

    // Formata a data para DD/MM/YYYY
    const formattedDate = (() => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        return `${day}/${month}/${year}`;
    })();

    return (
        <div className={styles.item}>
            {/* Ícone com fundo dinâmico */}
            <div className={`${styles.iconWrapper} ${bgClass}`}>
                {icon}
            </div>

            {/* Detalhes da mensagem */}
            <div className={styles.details}>
                <span className={styles.title}>{title}</span>
                <div className={styles.meta}>
                    <span className={styles.category}>
                        {isEmail ? "Email" : isWhatsApp ? "WhatsApp" : category}
                    </span>
                    <span className={styles.numberRecipients}>
                        {numberRecipients} destinatários
                    </span>
                    <span className={styles.date}>{formattedDate}</span>
                </div>
            </div>
        </div>
    );
}
