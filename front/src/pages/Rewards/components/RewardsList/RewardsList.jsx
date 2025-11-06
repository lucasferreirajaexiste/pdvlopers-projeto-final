import { useEffect, useState } from "react";
import { Gift } from "lucide-react";
import {
  createReward,
  getRewards,
  updateReward,
} from "../../../../services/api";
import styles from "./RewardsList.module.css";
import { ModalRewardsList } from "./ModalRewardsList";
import { ModalRewardsDetails } from "./ModalRewardsDetails";
import { RewardForm } from "../RewardForm/RewardForm";

const normalizeReward = (reward) => ({
  id: reward.id,
  name: reward.name,
  description: reward.description,
  pointsRequired: Number(reward.points_required ?? reward.points ?? 0),
  active: reward.active !== false,
  validUntil:
    reward.valid_until || reward.validity_date || reward.expires_at || null,
  category: reward.category || null,
  createdAt: reward.created_at || null,
  updatedAt: reward.updated_at || null,
});

export const RewardsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardsList, setRewardsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getRewards();
      const data = Array.isArray(response)
        ? response
        : response?.items || [];
      setRewardsList(data.map(normalizeReward));
    } catch (err) {
      console.error("Erro ao carregar recompensas:", err);
      setError("Não foi possível carregar as recompensas.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    if (saving) return;
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleViewDetails = (reward) => {
    setSelectedReward(reward);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedReward(null);
  };

  const handleToggleStatus = async (reward) => {
    setSaving(true);
    try {
      const updated = await updateReward(reward.id, {
        active: !reward.active,
      });

      setRewardsList((prev) =>
        prev.map((item) =>
          item.id === reward.id ? normalizeReward(updated) : item
        )
      );
      if (selectedReward?.id === reward.id) {
        setSelectedReward(normalizeReward(updated));
      }
    } catch (err) {
      console.error("Erro ao atualizar status da recompensa:", err);
      setError("Não foi possível atualizar a recompensa.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddReward = async (formData) => {
    setSaving(true);
    setError("");
    try {
      const created = await createReward({
        name: formData.name,
        description: formData.description,
        points_required: Number(formData.pointsRequired),
      });

      let normalized = normalizeReward(created);

      if (!formData.active && normalized.active) {
        const updated = await updateReward(normalized.id, { active: false });
        normalized = normalizeReward(updated);
      }

      setRewardsList((prev) => [normalized, ...prev]);
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao criar recompensa:", err);
      const message =
        err?.error || err?.message || "Não foi possível criar a recompensa.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.feedback}>
          <p>Carregando recompensas...</p>
        </div>
      );
    }

    if (error && !rewardsList.length) {
      return (
        <div className={styles.feedback}>
          <p>{error}</p>
        </div>
      );
    }

    if (!rewardsList.length) {
      return (
        <div className={styles.feedback}>
          <p>Ainda não há recompensas cadastradas.</p>
        </div>
      );
    }

    return (
      <div className={styles.grid}>
        {rewardsList.map((reward) => {
          const isActive = reward.active;

          return (
            <div
              key={reward.id}
              className={`${styles.card} ${
                !isActive ? styles.cardDisabled : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{reward.name}</h3>
                <p
                  className={
                    isActive
                      ? styles.cardStatusActive
                      : styles.cardStatusInactive
                  }
                >
                  {isActive ? "Disponível" : "Indisponível"}
                </p>
              </div>

              <p className={styles.cardPoints}>{reward.pointsRequired}</p>
              <p className={styles.cardDescription}>pontos necessários</p>

              {reward.validUntil && (
                <p className={styles.validityDate}>
                  Válido até:{" "}
                  {new Date(reward.validUntil).toLocaleDateString("pt-BR")}
                </p>
              )}

              <div className={styles.actions}>
                <button
                  className={
                    isActive
                      ? styles.cardButtonActive
                      : styles.cardButtonDisabled
                  }
                  onClick={() => handleViewDetails(reward)}
                >
                  Ver detalhes
                </button>
                <button
                  className={styles.secondaryButton}
                  disabled={saving}
                  onClick={() => handleToggleStatus(reward)}
                >
                  {isActive ? "Pausar" : "Reativar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Recompensas Disponíveis</h3>

        <div className={styles.newRewardButton} onClick={handleOpenModal}>
          <Gift className={styles.icon} />
          <button className={styles.button} disabled={saving}>
            Nova Recompensa
          </button>
        </div>
      </div>

      {error && rewardsList.length > 0 && (
        <div className={styles.inlineError}>{error}</div>
      )}

      {renderContent()}

      <ModalRewardsList
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      title="Nova Recompensa"
    >
        <RewardForm
          onClose={handleCloseModal}
          onSubmit={handleAddReward}
          disabled={saving}
        />
      </ModalRewardsList>

      <ModalRewardsDetails
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        reward={selectedReward}
        onToggleStatus={handleToggleStatus}
        isProcessing={saving}
      />
    </div>
  );
};
