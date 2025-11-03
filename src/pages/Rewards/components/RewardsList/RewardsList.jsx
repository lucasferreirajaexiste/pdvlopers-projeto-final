import { useState, useEffect } from "react";
import styles from "./RewardsList.module.css";
import { Gift } from "lucide-react";
import { ModalRewardsList } from "./ModalRewardsList";
import { ModalRewardsDetails } from "./ModalRewardsDetails";
import { RewardForm } from "../RewardForm/RewardForm";

export const RewardsList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardsList, setRewardsList] = useState([
    {
      id: 1,
      name: "Desconto 10%",
      points: 100,
      available: true,
      validityDate: null,
    },
    {
      id: 2,
      name: "Produto Grátis",
      points: 250,
      available: true,
      validityDate: null,
    },
    {
      id: 3,
      name: "Desconto 20%",
      points: 500,
      available: false,
      validityDate: null,
    },
    {
      id: 4,
      name: "Brinde Especial",
      points: 1000,
      available: false,
      validityDate: null,
    },
  ]);

  // Função para verificar e atualizar a disponibilidade das recompensas
  const checkRewardsValidity = () => {
    const now = new Date();

    setRewardsList((prevRewards) => {
      return prevRewards
        .map((reward) => {
          if (!reward.validityDate) return reward;

          // A data vale até 23:59 do mesmo dia
          const validityDate = new Date(reward.validityDate);
          validityDate.setHours(23, 59, 59, 999);

          const isExpired = validityDate < now;

          return {
            ...reward,
            available: !isExpired,
          };
        })
        .filter((reward) => {
          // Remove recompensas expiradas há mais de 30 dias
          if (reward.validityDate) {
            const validityDate = new Date(reward.validityDate);
            validityDate.setHours(23, 59, 59, 999);
            validityDate.setDate(validityDate.getDate() + 30);
            return validityDate >= now;
          }
          return true;
        });
    });
  };

  // Verifica a validade a cada minuto e ao carregar o componente
  useEffect(() => {
    checkRewardsValidity();
    const interval = setInterval(checkRewardsValidity, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Função para abrir os detalhes de uma recompensa
  const handleViewDetails = (reward) => {
    setSelectedReward(reward);
    setIsDetailsModalOpen(true);
  };

  // Função para fechar os detalhes
  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedReward(null);
  };

  // Função para adicionar uma nova recompensa
  const handleAddReward = (newRewardData) => {
    const newReward = {
      id: Date.now(),
      name: newRewardData.name,
      points: parseInt(newRewardData.points),
      available: true, // Inicia como disponível
      validityDate: newRewardData.validityDate,
      category: newRewardData.category,
      description: newRewardData.description,
    };

    setRewardsList((prevRewards) => [...prevRewards, newReward]);
    handleCloseModal();
  };

  return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Recompensas Disponíveis</h3>

          <div className={styles.newRewardButton} onClick={handleOpenModal}>
            <Gift className={styles.icon} />
            <button className={styles.button}>Nova Recompensa</button>
          </div>
        </div>

        <div className={styles.grid}>
          {rewardsList.map((reward) => (
            <div
              key={reward.id}
              className={`${styles.card} ${
                !reward.available ? styles.cardDisabled : ""
              }`}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{reward.name}</h3>
                <p
                  className={
                    reward.available
                      ? styles.cardStatusActive
                      : styles.cardStatusInactive
                  }
                >
                  {reward.available ? "Disponível" : "Indisponível"}
                </p>
              </div>

              <p className={styles.cardPoints}>{reward.points}</p>
              <p className={styles.cardDescription}>pontos necessários</p>

              {reward.validityDate && (
                <p className={styles.validityDate}>
                  Válido até:{" "}
                  {new Date(reward.validityDate).toLocaleDateString("pt-BR")}
                </p>
              )}

              <button
                className={
                  reward.available
                    ? styles.cardButtonActive
                    : styles.cardButtonDisabled
                }
                disabled={!reward.available}
                onClick={() => reward.available && handleViewDetails(reward)}
              >
                {reward.available ? "Ver Detalhes" : "Indisponível"}
              </button>
            </div>
          ))}
        </div>

        <ModalRewardsList
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title="Nova Recompensa"
        >
          <RewardForm
            onClose={handleCloseModal}
            onAddReward={handleAddReward}
          />
        </ModalRewardsList>

        <ModalRewardsDetails
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetails}
          reward={selectedReward}
        />
      </div>
  );
};
