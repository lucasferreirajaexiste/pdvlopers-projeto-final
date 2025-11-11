import { useEffect, useMemo, useState } from "react";
import { Star, Gift, Users } from "lucide-react";
import {
  getClientPoints,
  getClients,
  getLoyaltyHistory,
} from "../../../../services/api";
import styles from "./PointsOverview.module.css";

const LEVELS = [
  { level: "bronze", label: "Bronze", range: "0-99", min: 0, max: 99 },
  { level: "silver", label: "Silver", range: "100-499", min: 100, max: 499 },
  { level: "gold", label: "Gold", range: "500-999", min: 500, max: 999 },
  { level: "vip", label: "VIP", range: "1000+", min: 1000, max: Infinity },
];

const getBadgeByPoints = (points) => {
  if (points >= 1000) return "VIP";
  if (points >= 500) return "Gold";
  if (points >= 100) return "Silver";
  return null;
};

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("pt-BR", {
    maximumFractionDigits: 0,
  });

export const PointsOverview = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOverview = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getClients();
        const clients = response?.items || [];

        if (!clients.length) {
          setStats([]);
          return;
        }

        const enriched = await Promise.all(
          clients.map(async (client) => {
            const [pointsResult, historyResult] = await Promise.allSettled([
              getClientPoints(client.id),
              getLoyaltyHistory(client.id),
            ]);

            const points =
              pointsResult.status === "fulfilled"
                ? Number(pointsResult.value?.points || 0)
                : 0;

            const history =
              historyResult.status === "fulfilled"
                ? historyResult.value || []
                : [];

            return {
              id: client.id,
              name: client.nome || client.name || "Cliente",
              points,
              history,
            };
          })
        );

        setStats(enriched);
      } catch (err) {
        console.error("Erro ao carregar visão geral de pontos:", err);
        setError("Não foi possível carregar os dados de fidelidade.");
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  const overview = useMemo(() => {
    if (!stats.length) {
      return {
        totalPoints: 0,
        monthlyRedemptions: 0,
        redemptionGrowth: null,
        activeClients: 0,
        topClients: [],
        levelsProgress: LEVELS.map((level) => ({
          ...level,
          clients: 0,
          percentage: 0,
        })),
      };
    }

    const totalPoints = stats.reduce((acc, item) => acc + item.points, 0);
    const activeClients = stats.filter((item) => item.points > 0).length;

    const topClients = stats
      .slice()
      .sort((a, b) => b.points - a.points)
      .slice(0, 3)
      .map((item, index) => ({
        position: index + 1,
        name: item.name,
        badge: getBadgeByPoints(item.points),
        points: item.points,
      }));

    const now = new Date();
    const startCurrent = new Date(now.getFullYear(), now.getMonth(), 1);
    const startPrevious = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endPrevious = new Date(now.getFullYear(), now.getMonth(), 0);

    const redemptionCounters = stats.reduce(
      (acc, item) => {
        item.history.forEach((tx) => {
          if (tx.type !== "redeem") return;
          const createdAt = new Date(tx.created_at || tx.createdAt);
          if (Number.isNaN(createdAt.getTime())) return;

          if (createdAt >= startCurrent) acc.current += 1;
          else if (createdAt >= startPrevious && createdAt <= endPrevious)
            acc.previous += 1;
        });
        return acc;
      },
      { current: 0, previous: 0 }
    );

    const { current: monthlyRedemptions, previous: previousRedemptions } =
      redemptionCounters;

    const redemptionGrowth =
      previousRedemptions === 0
        ? null
        : Math.round(
            ((monthlyRedemptions - previousRedemptions) / previousRedemptions) *
              100
          );

    const levelsProgress = LEVELS.map((level) => {
      const clientsInLevel = stats.filter((item) => {
        if (level.max === Infinity) return item.points >= level.min;
        return item.points >= level.min && item.points <= level.max;
      }).length;

      const percentage = stats.length
        ? Math.round((clientsInLevel / stats.length) * 100)
        : 0;

      return {
        ...level,
        clients: clientsInLevel,
        percentage,
      };
    });

    return {
      totalPoints,
      monthlyRedemptions,
      redemptionGrowth,
      activeClients,
      topClients,
      levelsProgress,
    };
  }, [stats]);

  const renderStatus = () => {
    if (loading) {
      return (
        <div className={styles.feedback}>
          <p>Carregando visão geral...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className={styles.feedback}>
          <p>{error}</p>
        </div>
      );
    }

    if (!stats.length) {
      return (
        <div className={styles.feedback}>
          <p>Nenhum cliente cadastrado até o momento.</p>
        </div>
      );
    }

    return null;
  };

  const status = renderStatus();

  return (
    <div className={`${styles.tabContent} ${styles.active}`} id="overview">
      {status ? (
        status
      ) : (
        <>
          <div className={styles.cardsGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Total de Pontos</h3>
                <Star className={styles.icon} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardValue}>
                  {formatNumber(overview.totalPoints)}
                </div>
                <p className={styles.cardDescription}>
                  Distribuídos entre todos os clientes
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Resgates do Mês</h3>
                <Gift className={styles.icon} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardValue}>
                  {overview.monthlyRedemptions}
                </div>
                <p className={styles.cardDescription}>
                  {overview.redemptionGrowth === null
                    ? "Sem histórico do mês anterior"
                    : `${overview.redemptionGrowth >= 0 ? "+" : ""}${
                        overview.redemptionGrowth
                      }% vs. mês anterior`}
                </p>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Clientes Ativos</h3>
                <Users className={styles.icon} />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardValue}>
                  {overview.activeClients}
                </div>
                <p className={styles.cardDescription}>
                  Com pontos disponíveis para resgate
                </p>
              </div>
            </div>
          </div>

          <div className={styles.grid2Col}>
            <div className={styles.card}>
              <div className={styles.cardHeaderPoints}>
                <h3>Top Clientes por Pontos</h3>
                <p className={styles.cardDescriptionPoints}>
                  Ranking dos clientes mais fiéis
                </p>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.clientList}>
                  {overview.topClients.map((client) => (
                    <div
                      key={client.position}
                      className={styles.clientItem}
                    >
                      <div className={styles.clientInfo}>
                        <div className={styles.clientAvatar}>
                          {client.position}
                        </div>
                        <div>
                          <p className={styles.clientName}>{client.name}</p>
                          {client.badge && (
                            <span className={styles.badge}>{client.badge}</span>
                          )}
                        </div>
                      </div>
                      <div className={styles.clientPoints}>
                        {formatNumber(client.points)} pts
                      </div>
                    </div>
                  ))}
                  {!overview.topClients.length && (
                    <p className={styles.emptyState}>
                      Aguardando movimentação de pontos para montar o ranking.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeaderPoints}>
                <h3>Progresso de Níveis</h3>
                <p className={styles.cardDescriptionPoints}>
                  Distribuição dos clientes por nível
                </p>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.progressContainer}>
                  {overview.levelsProgress.map((item) => (
                    <div key={item.level} className={styles.progressItem}>
                      <div className={styles.progressLabel}>
                        <span className={styles.titleProgress}>
                          {item.label} ({item.range} pts)
                        </span>
                        <span className={styles.titleProgress}>
                          {item.clients} clientes
                        </span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progressFill} ${
                            styles[item.level]
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
