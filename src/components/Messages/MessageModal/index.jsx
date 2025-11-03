import { useState } from "react";
import styles from "./MessageModal.module.css";
import { Header } from "../../Finance/Header";

const MAX_MESSAGE_LENGTH = 360;

export function MessageModal({ isOpen, onClose }) {
    const [segment, setSegment] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSendMessage = async () => {
        if (!segment || !subject || !message) {
            alert("Preencha todos os campos antes de enviar.");
            return;
        }

        const data = {
            segment: segment.toUpperCase(),
            subject: subject,
            message: message,
            test_only: true, // evita envio real de e-mail durante testes
        };

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/promotions/send-email`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao enviar mensagem");
            }

            const result = await response.json();
            console.log("Mensagem enviada com sucesso:", result);
            alert("Mensagem enviada com sucesso!");

            // Limpa o modal
            setSegment("");
            setSubject("");
            setMessage("");
            onClose();
        } catch (error) {
            console.error("Erro ao enviar mensagem:", error);
            alert("Falha ao enviar mensagem. Verifique o console.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <Header
                        title="Enviar Email Promocional"
                        subtitle="Configure sua campanha de email marketing."
                        size="small"
                    />
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSendMessage();
                    }}
                    className={styles.form}
                >
                    <div className={styles.field}>
                        <label>Assunto</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Digite o assunto"
                        />
                    </div>

                    <div className={styles.field}>
                        <label>Segmento</label>
                        <select
                            value={segment}
                            onChange={(e) => setSegment(e.target.value)}
                        >
                            <option value="">Selecione um segmento</option>
                            <option value="ALL">Todos os clientes</option>
                            <option value="VIP">Clientes VIP</option>
                            <option value="GOLD">Clientes Gold</option>
                            <option value="SILVER">Clientes Silver</option>
                            <option value="INACTIVE">Clientes Inativos</option>
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
                            <p>
                                {message.length}/{MAX_MESSAGE_LENGTH}
                            </p>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button
                            type="button"
                            className={styles.cancel}
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className={styles.save}
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Enviar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
