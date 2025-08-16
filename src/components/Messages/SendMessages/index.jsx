import styles from './SendMessages.module.css'

import { Button } from '../../Finance/Button'

import { FaRegPaperPlane } from "react-icons/fa";

export function SendMessages({ text }) {
    return (
        <div className={styles.button}>
            <Button icon={<FaRegPaperPlane />} text={text} />
        </div>

    )
}