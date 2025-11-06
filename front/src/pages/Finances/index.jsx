import styles from "./finances.module.css";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Layout } from "../../components/Layout/Layout";
import { Button } from "../../components/Finance/Button";
import { TransactionCard } from "../../components/Finance/TransactionCard";
import { Tabs } from "../../components/Finance/Tabs";
import { TabContent } from "../../components/Finance/TabContent";
import { TransactionItem } from "../../components/Finance/TransactionItem";
import { TransactionList } from "../../components/Finance/TransactionList";
import { Header } from "../../components/Finance/Header";
import { TransactionModal } from "../../components/Finance/TransactionModal";
import { MdOutlineAttachMoney } from "react-icons/md";
import { LuCalendar, LuPlus, LuTrendingUp, LuTrendingDown } from "react-icons/lu";

import { getFinancialAll, getCategories } from "../../services/api"; // ajuste o caminho se necessário

export function Finances() {
  const [transactions, setTransactions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [periodo, setPeriodo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  // Normaliza cada item vindo do backend para o formato usado no front
  const normalize = (t) => ({
    id: t.id,
    description: t.description ?? t.title ?? "",
    amount: Number(t.amount ?? 0),
    type: t.type, // 'entrada' | 'saida' (o backend já normaliza)
    date: t.date ?? t.transaction_date ?? null,
    categoryId: t.categoryId ?? t.category_id ?? null,
  });

  const refreshList = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getFinancialAll();
      setTransactions((data || []).map(normalize));
    } catch (err) {
      console.error("Erro ao carregar transações:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshList();
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.warn("Não foi possível carregar categorias:", err);
      }
    })();
  }, [refreshList]);

  // FILTRO: Transações do mês atual
  const transacoesMesAtual = useMemo(() => {
    const hoje = new Date();
    const mesAtual = hoje.getMonth();
    const anoAtual = hoje.getFullYear();

    return transactions.filter((t) => {
      if (!t.date) return false;
      const data = new Date(t.date);
      return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
    });
  }, [transactions]);

  // CÁLCULOS DOS CARDS
  const totalEntradas = transacoesMesAtual
    .filter((t) => t.type === "entrada")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSaidas = transacoesMesAtual
    .filter((t) => t.type === "saida")
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);

  const saldo = transacoesMesAtual.reduce((acc, t) => acc + (t.type === "saida" ? -Math.abs(t.amount) : t.amount), 0);
  const totalTransacoes = transacoesMesAtual.length;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  // TABS
  const buttons = [
    { id: "transacoes", label: "Transações" },
    { id: "graficos", label: "Gráficos" },
  ];

  const contents = {
    transacoes: (
      <TabContent title="Transações" subtitle="Visualize e gerencie suas transações">
        {loading ? (
          <p>Carregando...</p>
        ) : transacoesMesAtual.length > 0 ? (
          transacoesMesAtual.map((t) => <TransactionItem key={t.id} {...t} />)
        ) : (
          <p>Nenhuma transação cadastrada neste mês</p>
        )}
      </TabContent>
    ),
    graficos: (
      <TabContent title="Lucro vs Prejuízo" subtitle="Comparativo de transações dos últimos meses">
        <TransactionList periodo={periodo} setPeriodo={setPeriodo} transactions={transactions} />
      </TabContent>
    ),
  };

  // Ao criar uma transação o modal deve retornar o objeto criado pelo backend.
  const handleSaveFromModal = (created) => {
    if (!created) {
      // fallback: refazer a lista
      refreshList();
      return;
    }
    // Inserir localmente (objeto já normalizado do backend). Mantém o mais recente no topo.
    setTransactions((prev) => [normalize(created), ...prev]);
  };

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.header}>
          <Header title="Financeiro" subtitle="Controle suas finanças e fluxo de caixa" />
          <div>
            <Button icon={<LuPlus />} text="Nova Transação" onClick={() => setShowModal(true)} />

            {showModal && (
              <TransactionModal
                onSave={(created) => {
                  handleSaveFromModal(created);
                  setShowModal(false);
                }}
                onClose={() => setShowModal(false)}
                categories={categories}
              />
            )}
          </div>
        </div>

        <div className={styles.cards}>
          <TransactionCard title="Total Entradas" amount={formatCurrency(totalEntradas)} subtitle="Este mês" icon={<LuTrendingUp />} color="green" />
          <TransactionCard title="Total Saídas" amount={formatCurrency(totalSaidas)} subtitle="Este mês" icon={<LuTrendingDown />} color="red" />
          <TransactionCard title="Saldo" amount={formatCurrency(saldo)} subtitle="Saldo atual" icon={<MdOutlineAttachMoney />} color={saldo >= 0 ? "green" : "red"} />
          <TransactionCard title="Transações" amount={totalTransacoes} subtitle="Este mês" icon={<LuCalendar />} color="black" />
        </div>

        <div className={styles.tabs}>
          <Tabs buttons={buttons} contents={contents} />
        </div>
      </div>
    </Layout>
  );
}
