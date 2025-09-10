import { useState } from 'react';
import styles from './PromotionsList.module.css';
import { Trophy } from 'lucide-react';
import { ModalPromotionList } from './ModalPromotionList';
import { PromotionForm } from '../PromotionForm/PromotionForm';

export const PromotionsList = () => {
  // Função para formatar a data
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR'); // Formato brasileiro
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [promotions, setPromotions] = useState([ 
    {
      name: "Dobro de Pontos",
      description: "Ganhe pontos em dobro em compras acima de R$ 100",
      segment: "Clientes VIP",
      validUntil: "2024-02-14",
      status: "Ativa"
    },
    {
      name: "Cashback 5%",
      description: "Receba 5% de volta em pontos",
      segment: "Todos os clientes",
      validUntil: "2024-01-30", // Formato ISO
      status: "Ativa"
    }
  ]);

  
  const handleOpenModal = () => {
    setEditingPromotion(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  // Função para abrir modal de edição
  const handleEdit = (promotion) => {
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  // Função para adicionar nova promoção 
  const handleAddPromotion = (newPromotion) => {
    const newPromotionActive = {
      name: newPromotion.name,
      description: newPromotion.description,
      segment: newPromotion.segment,
      validUntil: newPromotion.validUntil,
      status: "Ativa"
    };
    setPromotions(prev => [...prev, newPromotionActive]);
    handleCloseModal();
  };

  // Função para atualizar promoção existente
  const handleUpdatePromotion = (updatedData) => {
    setPromotions(prev => prev.map(promo => 
      promo === editingPromotion ? { 
        ...updatedData, 
        status: promo.status 
      } : promo
    ));
    handleCloseModal();
  };

  // Função para alternar status da promoção
  const handleToggleStatus = (promotion) => {
    setPromotions(prev => prev.map(promo => 
      promo === promotion 
        ? { ...promo, status: promo.status === "Ativa" ? "Pausada" : "Ativa" }
        : promo
    ));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Promoções Ativas</h3>
        <div className={styles.newPromotionButton} onClick={handleOpenModal}> 
          <Trophy className={styles.icon} />
          <button className={styles.button}>Nova Promoção</button>
        </div>
      </div>
      
      <div className={styles.body}>
        <div className={styles.promotionsContainer}>
          {promotions.map((promo, index) => (
            <div key={index} className={styles.promotionCard}>
              <div className={styles.promotionInfoHeader}>
                <div className={styles.promotionCardTitle}>
                  <h4 className={styles.promotionName}>{promo.name}</h4>
                  <p className={styles.promotionDescription}>{promo.description}</p>
                </div>
                <p className={styles.promotionStatus}>{promo.status}</p>
              </div>

              <div className={styles.promotionInfoMetaActions}>
                <div className={styles.promotionDetails}>
                  <p className={styles.segment}>Segmento: {promo.segment}</p>
                  <p className={styles.validUntil}>Validade até: {formatDate(promo.validUntil)}</p>
                </div>

                <div className={styles.actionsContainer}>
                  <button 
                    className={styles.editButton}
                    onClick={() => handleEdit(promo)} 
                  >
                    Editar
                  </button>
                  <button 
                  className={promo.status === "Ativa" ? styles.pauseButton : styles.activateButton} 
                  onClick={() => handleToggleStatus(promo)}
                  >
                    {promo.status === "Ativa" ? "Pausar" : "Reativar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ModalPromotionList 
        isOpen={isModalOpen} 
        onClose={handleCloseModal}
        title={editingPromotion ? "Editar Promoção" : "Nova Promoção"} // Título alternativo para edição ou criação
      >
        <PromotionForm 
          onClose={handleCloseModal}
          onSubmit={editingPromotion ? handleUpdatePromotion : handleAddPromotion} // Função dinâmica
          initialData={editingPromotion} // Passa dados se for edição
        />
      </ModalPromotionList>
    </div>
  );
};