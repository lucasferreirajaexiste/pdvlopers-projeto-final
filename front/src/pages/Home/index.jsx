import { useEffect, useState } from "react";
import {
  DollarSign,
  Users,
  Gift,
  TrendingUp,
  Star,
  Wallet,
  Calendar,
} from "lucide-react";
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

  console.log(promotions);

  return (
    <Layout>
      <div className={styles.container}>
        {/* Cards financeiros */}
        <div className={styles.grid3}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Saldo do Dia</span>
              <DollarSign color="var(--chart-1)" />
            </div>
            <div className={styles.cardValue}>
              <p className={styles.cardAmount}>R$ {sumDay.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Saldo do Mês</span>
              <Calendar color="var(--chart-2)" />
            </div>
            <div className={styles.cardValue}>
              <p className={styles.cardAmount}>R$ {sumMonth.toFixed(2)}</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <span>Total Acumulado</span>
              <Wallet color="var(--chart-3)" />
            </div>
            <div className={styles.cardValue}>
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
              {topClients.map((client) => {
                const initials = client.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <div key={client.id} className={styles.clientRow}>
                    <div className={styles.left}>
                      <span className={styles.avatar}>{initials}</span>
                      <span className={styles.clientName}>{client.nome}</span>
                    </div>
                    <div className={styles.right}>{client.points} pts</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Gift /> Promoções Ativas
            </div>

            <div className={styles.cardContent}>
              {promotions.length > 0 ? (
                promotions.map((promo) => {
                  // Calcula dias restantes
                  const today = new Date();
                  const endDate = new Date(promo.end_date);
                  const diffTime = endDate - today;
                  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  return (
                    <div key={promo.id} className={styles.promoItem}>
                      <div className={styles.clientInfo}>
                        <span className={styles.clientName}>{promo.title}</span>
                        <span className={styles.clientPoints}>
                          {promo.description}
                        </span>
                      </div>
                      <div className={styles.clientInfo}>
                        {daysLeft > 0 ? (
                          <span className={styles.promoDays}>
                            {daysLeft} dia(s) restante(s)
                          </span>
                        ) : (
                          <span className={styles.promoExpired}>Expirada</span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Nenhuma promoção ativa.</p>
              )}
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
    clients.slice(0, 5).map((client) => {
      const initials = client.nome
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return (
        <div key={client.id} className={styles.clientRow}>
          <div className={styles.left}>
            <span className={styles.avatar}>{initials}</span>
            <span className={styles.clientName}>{client.nome}</span>
          </div>
          <div className={styles.right}>
            {new Date(client.created_at).toLocaleDateString("pt-BR")}
          </div>
        </div>
      );
    })
  ) : (
    <p>Nenhum cliente encontrado.</p>
  )}
</div>

        </div>
      </div>
    </Layout>
  );
}
