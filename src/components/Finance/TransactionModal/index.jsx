import { useState } from "react";
import styles from './TransactionModal.module.css'
import { Header } from "../Header";
import clientsData from '../../../data/mockClients.json'
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'

export function TransactionModal({ onSave, onClose }) {
    const [formData, setFormData] = useState({
        type: "",
        title: "",
        category: "",
        date: "",
        amount: ""
    });

    const [somarPontos, setSomarPontos] = useState("não");
    const [cpfCliente, setCpfCliente] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        const amountValue = Number(formData.amount);
        const newTransaction = {
            id: Date.now(),
            ...formData,
            amount: formData.type === "saida" ? -Math.abs(amountValue) : Math.abs(amountValue),
            cliente: somarPontos === "sim" ? selectedClient : null
        };

        console.log("Nova transação:", newTransaction);
        onSave(newTransaction);
        onClose();
    };

    const handleBuscarCliente = () => {
        const cpfFormatado = cpfCliente.replace(/\D/g, "");
        const client = clientsData.find(c => c.cpf.replace(/\D/g, "") === cpfFormatado);
        setSelectedClient(client || null);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <Header
                        title="Registrar Transação"
                        subtitle="Adicione uma nova entrada ou saída financeira."
                        size="small"
                    />
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>

                    {/* Somar Pontos */}
                    <div className={styles.field}>
                        <label>Deseja somar pontos?</label>
                        <div className={styles.radioGroup}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="sim"
                                    checked={somarPontos === "sim"}
                                    onChange={(e) => setSomarPontos(e.target.value)}
                                />
                                Sim
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio"
                                    value="não"
                                    checked={somarPontos === "não"}
                                    onChange={(e) => setSomarPontos(e.target.value)}
                                />
                                Não
                            </label>
                        </div>
                    </div>

                    {/* Buscar Cliente */}
                    {somarPontos === "sim" && (
                        <div className={styles.field}>
                            <label>CPF do Cliente</label>
                            <div className={styles.cpfSearch}>
                                <input
                                    type="text"
                                    placeholder="Digite o CPF"
                                    value={cpfCliente}
                                    onChange={(e) => setCpfCliente(e.target.value)}
                                />
                                <button className={styles.buttonSearchClient} type="button" onClick={handleBuscarCliente}><FaSearch /></button>
                            </div>

                            {/* Botão para cadastrar cliente */}
                            <button
                                type="button"
                                className={styles.buttonAddClient}
                                onClick={() => navigate("/clients")}
                            >
                                Cadastrar Cliente
                            </button>

                            {selectedClient && (
                                <div className={styles.clientInfo}>
                                    <p>Nome: {selectedClient.nome}</p>
                                    <p>Email: {selectedClient.email}</p>
                                    <p>CPF: {selectedClient.cpf}</p>
                                    <p>Telefone: {selectedClient.telefone}</p>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Tipo */}
                    <div className={styles.field}>
                        <label>Tipo</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="" disabled selected>Selecione o tipo</option>
                            <option value="entrada">Entrada</option>
                            <option value="saida">Saída</option>
                        </select>
                    </div>

                    {/* Descrição */}
                    <div className={styles.field}>
                        <label>Descrição</label>
                        <input
                            type="text"
                            placeholder="Ex: Venda, Aluguel, Compra de estoque..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Valor */}
                    <div className={styles.field}>
                        <label>Valor</label>
                        <input
                            type="number"
                            placeholder="Ex: 1200"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                    </div>

                    {/* Categoria */}
                    <div className={styles.field}>
                        <label>Categoria</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="" disabled>Selecione a categoria</option>
                            <option value="Vendas">Vendas</option>
                            <option value="Estoque">Estoque</option>
                            <option value="Despesas">Despesas</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>

                    {/* Data */}
                    <div className={styles.field}>
                        <label>Data</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            required
                        />
                    </div>

                    {/* Botões */}
                    <div className={styles.buttons}>
                        <button type="button" className={styles.cancel} onClick={onClose}>Cancelar</button>
                        <button type="submit" className={styles.save}>Registrar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
