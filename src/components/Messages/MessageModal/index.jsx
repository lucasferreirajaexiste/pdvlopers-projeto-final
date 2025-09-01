import { useState } from "react";
import styles from './MessageModal.module.css'
import { Header } from "../Header";

export function MessageModal({ onSave, onClose }) {
    const [formData, setFormData] = useState({
        topic: "",
        segment: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();


        onSave();
        onClose();
    };


    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <Header
                        title="Enviar Email Promocional"
                        subtitle="Configure sua campanha de email marketing"
                        size="small"
                    />
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Assunto */}
                    <div className={styles.field}>
                        <label>Assunto</label>
                        <input
                            type="text"
                            placeholder="Assunto do email"
                            required
                        />
                    </div>

                    {/* Segmento */}
                    <div className={styles.field}>
                        <label>Segmento</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" disabled>Selecione o público</option>
                            <option value="VIP">Clientes VIP</option>
                            <option value="Gold">Clientes Gold</option>
                            <option value="Silver">Clientes Silver</option>
                            <option value="Inativos">Clientes Inativos</option>
                        </select>
                    </div>

                    {/* Mensagem */}
                    <div className={styles.field}>
                        <label>Mensagem</label>
                        <textarea
                            name="message"
                            id="message"
                            rows={5}
                            cols={33}
                            placeholder="Digite sua mensagem...">
                        </textarea>
                    </div>

                    {/* Botões */}
                    <div className={styles.buttons}>
                        <button type="button" className={styles.cancel} onClick={onClose}>Cancelar</button>
                        <button type="submit" className={styles.save}>Registar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
