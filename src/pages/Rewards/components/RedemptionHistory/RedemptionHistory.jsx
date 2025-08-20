import styles from './RedemptionHistory.module.css';
import { History, Gift } from 'lucide-react';

export const RedemptionHistory = () => {
  const redemptions = [
    { client: "João Silva", reward: "Desconto 10%", points: "-100 pts", date: "14/01/2024" },
    { client: "Maria Santos", reward: "Produto Grátis", points: "-250 pts", date: "13/01/2024" },
    { client: "Pedro Costa", reward: "Desconto 10%", points: "-100 pts", date: "12/01/2024" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <History className={styles.iconTitle} />
        <h3 className={styles.title}>Histórico de Resgates</h3>
      </div>
    
      <p className={styles.subtitle}>Últimas trocas de pontos por recompensas</p>
      
      <div className={styles.list}>
        {redemptions.map((item, index) => (
          <div key={index} className={styles.item}>
            <div className={styles.itemContent}>
              <div className={styles.itemIcon}>
                <div className={styles.backgroundIcon}>
                  <Gift className={styles.icon} />
                </div>
                <div className={styles.itemText}>
                  <p className={styles.client}>{item.client}</p>
                  <p className={styles.reward}>{item.reward}</p>
                </div>
              </div>
              
              <div className={styles.rightContent}>
                <p className={styles.points}>{item.points}</p>
                <p className={styles.date}>{item.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};