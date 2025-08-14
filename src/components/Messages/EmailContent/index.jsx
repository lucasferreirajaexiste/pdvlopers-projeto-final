import { Header } from '../../Finance/Header'
import styles from './EmailContent.module.css'
import { SendMessages } from '../SendMessages'
import { MdOutlineEmail } from "react-icons/md";


export function EmailContent() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Header title="Envio por Email" subtitle="Envie promoções e newsletters por email" size='small' />
            </div>
            <div className={styles.content}>
                <SendMessages icon={<MdOutlineEmail />} text="Criar Email" />
            </div>
        </div>
    )
}