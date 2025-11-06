import { Calendar, Gift, Tag, X } from "lucide-react";
import styles from "./ModalRewardsDetails.module.css";

export const ModalRewardsDetails = ({
  isOpen,
  onClose,
  reward,
  onToggleStatus,
  isProcessing = false,
}) => {
  if (!isOpen || !reward) return null;

  const isActive = reward.active;

  const handleToggle = () => {
    if (!onToggleStatus) return;
    onToggleStatus(reward);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
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
              <span
                className={isActive ? styles.statusAvailable : styles.statusUnavailable}
              >
                {isActive ? "Disponível" : "Indisponível"}
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
              <span className={styles.pointsValue}>
                {reward.pointsRequired} pontos
              </span>
            </div>

            {reward.description && (
              <div className={styles.descriptionSection}>
                <h4>Descrição</h4>
                <p>{reward.description}</p>
              </div>
            )}

            {reward.validUntil && (
              <div className={styles.validitySection}>
                <Calendar size={16} />
                <span>
                  Válido até:{" "}
                  {new Date(reward.validUntil).toLocaleDateString("pt-BR")}
                </span>
              </div>
            )}

            <div className={styles.additionalInfo}>
              {reward.createdAt && (
                <p>
                  Criado em:{" "}
                  {new Date(reward.createdAt).toLocaleDateString("pt-BR")}
                </p>
              )}
              {reward.updatedAt && (
                <p>
                  Atualizado em:{" "}
                  {new Date(reward.updatedAt).toLocaleDateString("pt-BR")}
                </p>
              )}
            </div>

            <div className={styles.actions}>
              <button className={styles.cancelButton} onClick={onClose}>
                Fechar
              </button>
              {onToggleStatus && (
                <button
                  className={styles.redeemButton}
                  onClick={handleToggle}
                  disabled={isProcessing}
                >
                  {isActive ? "Pausar" : "Reativar"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
