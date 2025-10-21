import { useState } from "react";
import styles from "./MessageModal.module.css";
import { Header } from "../../Finance/Header";

const MAX_MESSAGE_LENGTH = 360;

export function MessageModal({ type, isOpen, onClose }) {
    const [segment, setSegment] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleSendMessage = () => {
        const data = {
            tipo: type,
            segmento: segment,
            assunto: subject,
            mensagem: message,
        };

        console.log("Enviando mensagem:", data);

        onClose();

        setSegment("");
        setSubject("");
        setMessage("");
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    {type === "Email" ? (
                        <Header
                            title="Enviar Email Promocional"
                            subtitle="Configure sua campanha de email marketing."
                            size="small"
                        />
                    ) : (
                        <Header
                            title="Enviar WhatsApp"
                            subtitle="Configure sua mensagem para WhatsApp"
                            size="small"
                        />
                    )}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className={styles.form}
                >

                    {type === "Email" && (
                        <div className={styles.field}>
                            <label>Assunto</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="Digite o assunto"
                            />
                        </div>
                    )}

                    <div className={styles.field}>
                        <label>Segmento</label>
                        <select value={segment} onChange={(e) => setSegment(e.target.value)}>
                            <option value="">Selecione um segmento</option>
                            <option value="todos">Todos os clientes</option>
                            <option value="vip">Clientes VIP</option>
                            <option value="golds">Clientes Golds</option>
                            <option value="silver">Clientes Silver</option>
                            <option value="inativos">Clientes Inativos</option>
                        </select>
                    </div>



                    <div className={styles.field}>
                        <label>Mensagem</label>
                        <textarea
                            value={message}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
                                    setMessage(e.target.value);
                                }
                            }}
                            placeholder="Escreva sua mensagem"
                        />
                        <div className={styles.textareaWarning}>
                            <p>Máximo {MAX_MESSAGE_LENGTH} caracteres</p>
                            <p>{message.length}/{MAX_MESSAGE_LENGTH}</p>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" className={styles.cancel} onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.save}>
                            Enviar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
