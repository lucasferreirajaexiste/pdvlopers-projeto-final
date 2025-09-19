//styles
import styles from "./finances.module.css";
//hook
import { useState, useMemo } from "react";
//Layout
import { Layout } from "../../components/Layout/Layout";
//components
import { Button } from "../../components/Finance/Button";
import { TransactionCard } from "../../components/Finance/TransactionCard";
import { Tabs } from "../../components/Finance/Tabs";
import { TabContent } from "../../components/Finance/TabContent";
import { TransactionItem } from "../../components/Finance/TransactionItem";
import { TransactionList } from "../../components/Finance/TransactionList";
import { Header } from "../../components/Finance/Header";
import { TransactionModal } from "../../components/Finance/TransactionModal";
//icons
import { MdOutlineAttachMoney } from "react-icons/md";
import { LuCalendar, LuPlus, LuTrendingUp, LuTrendingDown } from "react-icons/lu";

export function Finances() {
    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [periodo, setPeriodo] = useState(1);

    // ===========================
    // FILTRO: Transações do mês atual
    // ===========================
    const transacoesMesAtual = useMemo(() => {
        const hoje = new Date();
        const mesAtual = hoje.getMonth();
        const anoAtual = hoje.getFullYear();

        return transactions.filter((t) => {
            const data = new Date(t.date);
            return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
        });
    }, [transactions]);

    // ===========================
    // CÁLCULOS DOS CARDS
    // ===========================
    const totalEntradas = transacoesMesAtual
        .filter(t => t.type === "entrada")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalSaidas = transacoesMesAtual
        .filter(t => t.type === "saida")
        .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const saldo = transacoesMesAtual.reduce((acc, t) => acc + t.amount, 0);
    const totalTransacoes = transacoesMesAtual.length;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);

    // ===========================
    // TABS
    // ===========================
    const buttons = [
        { id: 'transacoes', label: "Transações" },
        { id: 'graficos', label: "Gráficos" },
    ];

    const contents = {
        transacoes: (
            <TabContent
                title="Transações"
                subtitle="Visualize e gerencie suas transações"
            >
                {transacoesMesAtual.length > 0 ? (
                    transacoesMesAtual.map((t) => (
                        <TransactionItem key={t.id} {...t} />
                    ))
                ) : (
                    <p>Nenhuma transação cadastrada neste mês</p>
                )}
            </TabContent>
        ),
        graficos: (
            <TabContent
                title="Lucro vs Prejuízo"
                subtitle="Comparativo de transações dos últimos meses"
            >
                <TransactionList periodo={periodo} setPeriodo={setPeriodo} transactions={transactions} />
            </TabContent>
        ),
    };

    // ===========================
    // RENDER
    // ===========================
    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <Header
                        title="Financeiro"
                        subtitle="Controle suas finanças e fluxo de caixa"
                    />
                    <div>
                        <Button icon={<LuPlus />} text="Nova Transação" onClick={() => setShowModal(true)} />

                        {showModal && (
                            <TransactionModal
                                onSave={(newTransaction) =>
                                    setTransactions((prev) => [...prev, newTransaction])
                                }
                                onClose={() => setShowModal(false)}
                            />
                        )}
                    </div>
                </div>

                <div className={styles.cards}>
                    <TransactionCard
                        title="Total Entradas"
                        amount={formatCurrency(totalEntradas)}
                        subtitle="Este mês"
                        icon={<LuTrendingUp />}
                        color="green"
                    />
                    <TransactionCard
                        title="Total Saídas"
                        amount={formatCurrency(totalSaidas)}
                        subtitle="Este mês"
                        icon={<LuTrendingDown />}
                        color="red"
                    />
                    <TransactionCard
                        title="Saldo"
                        amount={formatCurrency(saldo)}
                        subtitle="Saldo atual"
                        icon={<MdOutlineAttachMoney />}
                        color={saldo >= 0 ? "green" : "red"}
                    />
                    <TransactionCard
                        title="Transações"
                        amount={totalTransacoes}
                        subtitle="Este mês"
                        icon={<LuCalendar />}
                        color="black"
                    />
                </div>

                <div className={styles.tabs}>
                    <Tabs buttons={buttons} contents={contents} />
                </div>
            </div>
        </Layout>
    );
}
