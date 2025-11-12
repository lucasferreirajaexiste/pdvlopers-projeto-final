import { useEffect, useMemo, useState } from "react";
import styles from './TransactionModal.module.css';
import { Header } from "../Header";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { createTransaction, getClients } from "../../../services/api";

export function TransactionModal({ onSave, onClose, categories = [] }) {
    const [formData, setFormData] = useState({
        type: "",
        description: "",
        category: "",
        date: "",
        amount: ""
    });

    const [somarPontos, setSomarPontos] = useState("não");
    const [cpfCliente, setCpfCliente] = useState("");
    const [selectedClient, setSelectedClient] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [clientsLoading, setClientsLoading] = useState(false);
    const [clientSearchError, setClientSearchError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        const loadClients = async () => {
            setClientsLoading(true);
            setClientSearchError("");
            try {
                const response = await getClients();
                if (!active) return;
                setClients(response?.items || []);
            } catch (error) {
                console.error("Erro ao buscar clientes para o modal:", error);
                if (active) {
                    setClientSearchError("Não foi possível carregar os clientes.");
                }
            } finally {
                if (active) setClientsLoading(false);
            }
        };
        loadClients();
        return () => {
            active = false;
        };
    }, []);

    const availableCategories = useMemo(() => {
        if (categories.length) return categories;
        return [
            { id: "Vendas", name: "Vendas" },
            { id: "Estoque", name: "Estoque" },
            { id: "Despesas", name: "Despesas" },
            { id: "Marketing", name: "Marketing" },
            { id: "Outros", name: "Outros" },
        ];
    }, [categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const amountValue = Number(formData.amount);

            const newTransaction = {
                description: formData.description.trim(),
                amount: Math.abs(amountValue),
                type: formData.type,
                transaction_date: formData.date,
                category: formData.category || null,
            };

            console.log("Nova transação:", newTransaction);

            // ✅ Envia para o backend
            const response = await createTransaction(newTransaction);
            console.log("Transação registrada com sucesso:", response);

            // Atualiza o estado do pai (opcional)
            if (onSave) onSave(response);

            alert("Transação registrada com sucesso!");
            onClose();
        } catch (error) {
            console.error("Erro ao registrar transação:", error);
            alert(
                error?.error ||
                error?.message ||
                "Erro ao registrar transação. Verifique o console."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBuscarCliente = () => {
        setClientSearchError("");
        const cpfFormatado = cpfCliente.replace(/\D/g, "");
        if (!cpfFormatado || cpfFormatado.length < 11) {
            setClientSearchError("Informe um CPF válido para buscar.");
            setSelectedClient(null);
            return;
        }

        const client = clients.find(
            (c) => (c.cpf || "").replace(/\D/g, "") === cpfFormatado
        );
        if (!client) {
            setSelectedClient(null);
            setClientSearchError("Nenhum cliente encontrado com esse CPF.");
            return;
        }
        setSelectedClient(client);
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
                                <button
                                    className={styles.buttonSearchClient}
                                    type="button"
                                    onClick={handleBuscarCliente}
                                >
                                    <FaSearch />
                                </button>
                            </div>

                            {clientsLoading && (
                                <small className={styles.helperText}>
                                    Carregando clientes...
                                </small>
                            )}
                            {clientSearchError && (
                                <small className={styles.errorText}>
                                    {clientSearchError}
                                </small>
                            )}

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
                                    <p>Telefone: {selectedClient.telefone || "Não informado"}</p>
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
                            required
                        >
                            <option value="" disabled>Selecione o tipo</option>
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
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                            <option value="">Selecione a categoria</option>
                            {availableCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
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
                        <button type="button" className={styles.cancel} onClick={onClose} disabled={loading}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.save} disabled={loading}>
                            {loading ? "Registrando..." : "Registrar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
