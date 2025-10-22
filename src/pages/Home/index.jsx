import { useEffect, useState } from "react";
import { DollarSign, Users, Gift, TrendingUp, Star } from "lucide-react";
import styles from "./home.module.css";
import { Layout } from "../../components/Layout/Layout";
import {
  getClients,
  getFinancialAll,
  getFinancialByDay,
  getFinancialByMonth,
  getLoyaltyHistory,
  getPromotions,
} from "../../services/api";

export function Home() {
  const [loadingClients, setLoadingClients] = useState(true);
  const [clients, setClients] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const [sumDay, setSumDay] = useState(0);
  const [sumMonth, setSumMonth] = useState(0);
  const [sumAll, setSumAll] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          responseClients,
          responseByDay,
          responseByMonth,
          responseAll,
          responsePromotions,
        ] = await Promise.all([
          getClients(),
          getFinancialByDay(),
          getFinancialByMonth(),
          getFinancialAll(),
          getPromotions(),
        ]);

        // Clientes
        const clientsList = responseClients?.items || [];
        const sortedByDate = clientsList.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setClients(sortedByDate);

        // Somas financeiras
        setSumDay(responseByDay.reduce((acc, t) => acc + t.amount, 0));
        setSumMonth(responseByMonth.reduce((acc, t) => acc + t.amount, 0));
        setSumAll(responseAll.reduce((acc, t) => acc + t.amount, 0));

        // Pontos dos clientes
        const clientsWithPoints = await Promise.all(
          sortedByDate.map(async (client) => {
            const history = await getLoyaltyHistory(client.id);
            const points = history.reduce((acc, h) => {
              return h.type === "earn" ? acc + h.points : acc - h.points;
            }, 0);
            return { ...client, points };
          })
        );

        const top5 = clientsWithPoints
          .sort((a, b) => b.points - a.points)
          .slice(0, 5);
        setTopClients(top5);

        // Promoções ativas
        setPromotions(responsePromotions?.items || []);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoadingClients(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>Visão geral do seu negócio</p>

        {/* Cards financeiros */}
        <div className={styles.grid3}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Saldo do Dia</span>
              <DollarSign />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardAmount}>R$ {sumDay.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Saldo do Mês</span>
              <TrendingUp />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardAmount}>R$ {sumMonth.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Total Acumulado</span>
              <DollarSign />
            </div>
            <div className={styles.cardContent}>
              <p className={styles.cardAmount}>R$ {sumAll.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Top clientes e promoções */}
        <div className={styles.grid2}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Star /> Top 5 Clientes do Mês
            </div>
            <div className={styles.cardContent}>
              {topClients.map((client, index) => (
                <div key={client.id} className={styles.item}>
                  <span>
                    {index + 1}. {client.nome}
                  </span>
                  <span>{client.points} pts</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Gift /> Promoções Ativas
            </div>
            <div className={styles.cardContent}>
              {promotions.map((promo) => (
                <div key={promo.id} className={styles.item}>
                  <strong>{promo.title}</strong>
                  <p>{promo.description}</p>
                  <span className={styles.badge}>
                    {promo.active ? "Ativa" : "Inativa"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Últimos clientes cadastrados */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Users /> Últimos Clientes Cadastrados
          </div>
          <div className={styles.cardContent}>
            {loadingClients ? (
              <p>Carregando clientes...</p>
            ) : clients.length > 0 ? (
              clients.slice(0, 5).map((client) => (
                <div key={client.id} className={styles.item}>
                  <span>{client.nome}</span>
                  <span>
                    Cadastrado em{" "}
                    {new Date(client.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              ))
            ) : (
              <p>Nenhum cliente encontrado.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
