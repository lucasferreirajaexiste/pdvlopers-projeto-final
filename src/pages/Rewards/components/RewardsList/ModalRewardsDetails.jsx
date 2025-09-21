import styles from './ModalRewardsDetails.module.css';
import { X, Calendar, Gift, Tag } from 'lucide-react';

export const ModalRewardsDetails = ({ isOpen, onClose, reward }) => {
  if (!isOpen || !reward) return null;

  const handleRedeem = () => {
    // Lógica para resgatar a recompensa
    console.log('Resgatando recompensa:', reward.id);
    alert(`Recompensa "${reward.name}" resgatada com sucesso!`);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Detalhes da Recompensa</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.rewardImage}>
            <Gift size={64} className={styles.imagePlaceholder} />
          </div>

          <div className={styles.rewardInfo}>
            <h3 className={styles.rewardName}>{reward.name}</h3>
            
            <div className={styles.badgeContainer}>
              <span className={reward.available ? styles.statusAvailable : styles.statusUnavailable}>
                {reward.available ? 'Disponível' : 'Indisponível'}
              </span>
              {reward.category && (
                <span className={styles.categoryBadge}>
                  <Tag size={14} />
                  {reward.category}
                </span>
              )}
            </div>

            <div className={styles.pointsSection}>
              <span className={styles.pointsLabel}>Pontos necessários:</span>
              <span className={styles.pointsValue}>{reward.points} pontos</span>
            </div>

            {reward.description && (
              <div className={styles.descriptionSection}>
                <h4>Descrição</h4>
                <p>{reward.description}</p>
              </div>
            )}

            {reward.validityDate && (
              <div className={styles.validitySection}>
                <Calendar size={16} />
                <span>Válido até: {new Date(reward.validityDate).toLocaleDateString('pt-BR')}</span>
              </div>
            )}

            <div className={styles.actions}>
              <button 
                className={styles.cancelButton} 
                onClick={onClose}
              >
                Fechar
              </button>
              {reward.available && (
                <button 
                  className={styles.redeemButton}
                  onClick={handleRedeem}
                >
                  Resgatar Agora
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};