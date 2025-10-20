import styles from './PointsOverview.module.css';
import { Star, Gift, Users } from 'lucide-react';

export const PointsOverview = () => {
  // Dados que virão do backend (estrutura simples em JS)
  const overviewData = {
    totalPoints: 45230,
    monthlyRedemptions: 127,
    redemptionGrowth: 23,
    activeClients: 89,
    topClients: [
      { position: 1, name: "João Silva", badge: "VIP", points: 1250 },
      { position: 2, name: "Maria Souza", badge: "Gold", points: 1100 },
      { position: 3, name: "Carlos Oliveira", badge: "Gold", points: 980 },
    ],
    levelsProgress: [
      { level: "bronze", range: "0-99", clients: 45, percentage: 45 },
      { level: "silver", range: "100-499", clients: 30, percentage: 30 },
      { level: "gold", range: "500-999", clients: 10, percentage: 10 },
      { level: "vip", range: "1000+", clients: 4, percentage: 4 },
    ]
  };

  // Desestruturando os dados para uso nos componentes
  const {
    totalPoints,
    monthlyRedemptions,
    redemptionGrowth,
    activeClients,
    topClients,
    levelsProgress
  } = overviewData;

  return (
    <div className={`${styles.tabContent} ${styles.active}`} id="overview">
      {/* Grid de cards */}
      <div className={styles.cardsGrid}>
        {/* Card 1: Total de Pontos */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Total de Pontos</h3>
            <Star className={styles.icon} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{totalPoints.toLocaleString('pt-BR')}</div>
            <p className={styles.cardDescription}>Distribuídos entre todos os clientes</p>
          </div>
        </div>

        {/* Card 2: Resgates do Mês */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Resgates do Mês</h3>
            <Gift className={styles.icon} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{monthlyRedemptions}</div>
            <p className={styles.cardDescription}>
              +{redemptionGrowth}% em relação ao mês anterior
            </p>
          </div>
        </div>

        {/* Card 3: Clientes Ativos */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Clientes Ativos</h3>
            <Users className={styles.icon} />
          </div>
          <div className={styles.cardBody}>
            <div className={styles.cardValue}>{activeClients}</div>
            <p className={styles.cardDescription}>Com pontos para resgatar</p>
          </div>
        </div>
      </div>

      {/* Grid de 2 colunas */}
      <div className={styles.grid2Col}>
        {/* Coluna 1: Top Clientes */}
        <div className={styles.card}>
          <div className={styles.cardHeaderPoints}>
            <h3>Top Clientes por Pontos</h3>
            <p className={styles.cardDescriptionPoints}>Ranking dos clientes mais fiéis</p>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.clientList}>
              {topClients.map(client => (
                <div key={client.position} className={styles.clientItem}>
                  <div className={styles.clientInfo}>
                    <div className={styles.clientAvatar}>{client.position}</div>
                    <div>
                      <p className={styles.clientName}>{client.name}</p>
                      {client.badge && <span className={styles.badge}>{client.badge}</span>}
                    </div>
                  </div>
                  <div className={styles.clientPoints}>{client.points.toLocaleString('pt-BR')} pts</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 2: Progresso de Níveis */}
        <div className={styles.card}>
          <div className={styles.cardHeaderPoints}>
            <h3>Progresso de Níveis</h3>
            <p className={styles.cardDescriptionPoints}>Distribuição dos clientes por nível</p>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.progressContainer}>
              {levelsProgress.map(item => (
                <div key={item.level} className={styles.progressItem}>
                  <div className={styles.progressLabel}>
                    <span className={styles.titleProgress}>
                      {item.level.charAt(0).toUpperCase() + item.level.slice(1)} ({item.range} pts)
                    </span>
                    <span className={styles.titleProgress}>{item.clients} clientes</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={`${styles.progressFill} ${styles[item.level]}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};