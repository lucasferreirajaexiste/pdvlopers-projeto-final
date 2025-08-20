import styles from './RewardsList.module.css';
import { Gift } from 'lucide-react';

export const RewardsList = () => {
  const rewardsList = [
    { id: 1, name: "Desconto 10%", points: 100, available: true },
    { id: 2, name: "Produto Grátis", points: 250, available: true },
    { id: 3, name: "Desconto 20%", points: 500, available: false },
    { id: 4, name: "Brinde Especial", points: 1000, available: false },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recompensas Disponíveis</h3>

        <div className={styles.newRewardButton}>
          <Gift className={styles.icon} />
          <button className={styles.button}>
            Nova Recompensa
          </button>
        </div>
      </div>
      
      <div className={styles.grid}>
        {rewardsList.map((reward) => (
          <div 
            key={reward.id} 
            className={`${styles.card} ${!reward.available ? styles.cardDisabled : ''}`}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>{reward.name}</h3>
              <p className={reward.available ? styles.cardStatusActive : styles.cardStatusInactive}>
                {reward.available ? 'Disponível' : 'Indisponível'}
              </p>
            </div>

            
            <p className={styles.cardPoints}>{reward.points}</p>
            <p className={styles.cardDescription}>pontos necessários</p>
            

            <button 
              className={reward.available ? styles.cardButtonActive : styles.cardButtonDisabled}
              disabled={!reward.available}
            >
              {reward.available ? 'Configurar' : 'Indisponível'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};