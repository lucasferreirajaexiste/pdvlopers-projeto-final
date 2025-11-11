import { useEffect, useMemo, useState } from "react";
import { Gift, History as HistoryIcon } from "lucide-react";
import {
  getClients,
  getLoyaltyHistory,
  getRewards,
} from "../../../../services/api";
import styles from "./RedemptionHistory.module.css";

const normalizeClient = (client) => ({
  id: client.id,
  name: client.nome || client.name || "Cliente",
});

export const RedemptionHistory = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [history, setHistory] = useState([]);
  const [rewardsMap, setRewardsMap] = useState({});
  const [loadingClients, setLoadingClients] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitialData = async () => {
      setLoadingClients(true);
      setError("");
      try {
        const [clientsResponse, rewardsResponse] = await Promise.all([
          getClients(),
          getRewards().catch(() => []),
        ]);

        const clientItems = clientsResponse?.items || [];
        const normalizedClients = clientItems.map(normalizeClient);

        setClients(normalizedClients);
        if (normalizedClients.length) {
          setSelectedClientId(String(normalizedClients[0].id));
        }

        const rewardsArray = Array.isArray(rewardsResponse)
          ? rewardsResponse
          : rewardsResponse?.items || [];
        const rewardsDictionary = rewardsArray.reduce((acc, reward) => {
          acc[reward.id] = reward.name;
          return acc;
        }, {});
        setRewardsMap(rewardsDictionary);
      } catch (err) {
        console.error("Erro ao carregar clientes ou recompensas:", err);
        setError("Não foi possível carregar os clientes cadastrados.");
      } finally {
        setLoadingClients(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!selectedClientId) {
      setHistory([]);
      return;
    }

    const loadHistory = async () => {
      setLoadingHistory(true);
      setError("");
      try {
        const transactions = await getLoyaltyHistory(selectedClientId);
        const ordered = Array.isArray(transactions)
          ? transactions.sort(
              (a, b) =>
                new Date(b.created_at || b.createdAt) -
                new Date(a.created_at || a.createdAt)
            )
          : [];
        setHistory(ordered);
      } catch (err) {
        console.error("Erro ao carregar histórico de fidelidade:", err);
        setError("Não foi possível carregar o histórico do cliente.");
      } finally {
        setLoadingHistory(false);
      }
    };

    loadHistory();
  }, [selectedClientId]);

  const selectedClient = useMemo(
    () => clients.find((client) => String(client.id) === selectedClientId),
    [clients, selectedClientId]
  );

  const transactions = useMemo(() => {
    return history.map((entry) => {
      const createdAt = new Date(entry.created_at || entry.createdAt);
      const isRedeem = entry.type === "redeem";
      const pointsValue = isRedeem ? -entry.points : entry.points;

      const rewardName =
        (entry.reward_id && rewardsMap[entry.reward_id]) || entry.description;

      return {
        id: entry.id,
        reward: rewardName || (isRedeem ? "Resgate de pontos" : "Pontuação"),
        description: entry.description,
        type: entry.type,
        points: pointsValue,
        formattedPoints: `${isRedeem ? "-" : "+"}${entry.points} pts`,
        date: Number.isNaN(createdAt.getTime())
          ? "-"
          : createdAt.toLocaleDateString("pt-BR"),
      };
    });
  }, [history, rewardsMap]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <HistoryIcon className={styles.iconTitle} />
          <h3 className={styles.title}>Histórico de Fidelidade</h3>
        </div>

        <div className={styles.filters}>
          <label className={styles.filterLabel} htmlFor="client">
            Cliente
          </label>
          <select
            id="client"
            className={styles.select}
            value={selectedClientId}
            onChange={(event) => setSelectedClientId(event.target.value)}
            disabled={loadingClients}
          >
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className={styles.subtitle}>
        {selectedClient
          ? `Transações do programa de pontos para ${selectedClient.name}.`
          : "Selecione um cliente para visualizar as transações."}
      </p>

      {error && (
        <div className={styles.feedback}>
          <p>{error}</p>
        </div>
      )}

      {!error && (loadingClients || loadingHistory) && (
        <div className={styles.feedback}>
          <p>Carregando histórico...</p>
        </div>
      )}

      {!error && !loadingHistory && !transactions.length && (
        <div className={styles.feedback}>
          <p>Nenhuma movimentação registrada para este cliente.</p>
        </div>
      )}

      {!error && !loadingHistory && transactions.length > 0 && (
        <div className={styles.list}>
          {transactions.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.itemContent}>
                <div className={styles.itemIcon}>
                  <div className={styles.backgroundIcon}>
                    <Gift className={styles.icon} />
                  </div>
                  <div className={styles.itemText}>
                    <p className={styles.client}>{item.reward}</p>
                    <p className={styles.reward}>{item.description}</p>
                  </div>
                </div>

                <div className={styles.rightContent}>
                  <p
                    className={`${styles.points} ${
                      item.type === "redeem"
                        ? styles.pointsRedeem
                        : styles.pointsEarn
                    }`}
                  >
                    {item.formattedPoints}
                  </p>
                  <p className={styles.date}>{item.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
