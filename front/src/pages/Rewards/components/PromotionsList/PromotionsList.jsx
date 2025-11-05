import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import {
  createPromotion,
  getPromotions,
  updatePromotion,
} from "../../../../services/api";
import { PromotionForm } from "../PromotionForm/PromotionForm";
import { ModalPromotionList } from "./ModalPromotionList";
import styles from "./PromotionsList.module.css";

const normalizePromotion = (promotion) => ({
  id: promotion.id,
  title: promotion.title,
  description: promotion.description,
  type: promotion.type || "",
  conditions: promotion.conditions || "",
  active: promotion.active !== false,
  startDate: promotion.start_date || null,
  endDate: promotion.end_date || null,
  createdAt: promotion.created_at || null,
  updatedAt: promotion.updated_at || null,
});

const formatDate = (dateString) => {
  if (!dateString) return "Sem data";
  const date = new Date(dateString);
  return Number.isNaN(date.getTime())
    ? "Sem data"
    : date.toLocaleDateString("pt-BR");
};

const buildPromotionPayload = (data) => {
  const payload = {
    title: data.title,
    description: data.description,
    active: data.active,
  };

  payload.type = data.type || null;
  payload.conditions = data.conditions || null;
  payload.start_date = data.startDate || null;
  payload.end_date = data.endDate || null;

  return payload;
};

export const PromotionsList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getPromotions();
      const items = Array.isArray(response)
        ? response
        : response?.items || [];
      setPromotions(items.map(normalizePromotion));
    } catch (err) {
      console.error("Erro ao carregar promoções:", err);
      setError("Não foi possível carregar as promoções.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (promotion = null) => {
    if (saving) return;
    setEditingPromotion(promotion);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromotion(null);
  };

  const handleSubmitPromotion = async (data) => {
    setSaving(true);
    setError("");
    try {
      const payload = buildPromotionPayload(data);

      if (editingPromotion) {
        const updated = await updatePromotion(editingPromotion.id, payload);

        setPromotions((prev) =>
          prev.map((item) =>
            item.id === editingPromotion.id
              ? normalizePromotion(updated.item || updated)
              : item
          )
        );
      } else {
        const created = await createPromotion(payload);

        const createdItem = created.item || created;
        setPromotions((prev) => [
          normalizePromotion(createdItem),
          ...prev,
        ]);
      }

      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar promoção:", err);
      const message =
        err?.error || err?.message || "Não foi possível salvar a promoção.";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (promotion) => {
    setSaving(true);
    setError("");

    try {
      const updated = await updatePromotion(promotion.id, {
        active: !promotion.active,
      });

      setPromotions((prev) =>
        prev.map((item) =>
          item.id === promotion.id
            ? normalizePromotion(updated.item || updated)
            : item
        )
      );
    } catch (err) {
      console.error("Erro ao atualizar promoção:", err);
      setError("Não foi possível atualizar o status da promoção.");
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.feedback}>
          <p>Carregando promoções...</p>
        </div>
      );
    }

    if (error && !promotions.length) {
      return (
        <div className={styles.feedback}>
          <p>{error}</p>
        </div>
      );
    }

    if (!promotions.length) {
      return (
        <div className={styles.feedback}>
          <p>Nenhuma promoção cadastrada ainda.</p>
        </div>
      );
    }

    return (
      <div className={styles.body}>
        <div className={styles.promotionsContainer}>
          {promotions.map((promo) => (
            <div key={promo.id} className={styles.promotionCard}>
              <div className={styles.promotionInfoHeader}>
                <div className={styles.promotionCardTitle}>
                  <h4 className={styles.promotionName}>{promo.title}</h4>
                  <p className={styles.promotionDescription}>
                    {promo.description}
                  </p>
                </div>
                <p
                  className={
                    promo.active
                      ? styles.promotionStatus
                      : styles.promotionStatusPaused
                  }
                >
                  {promo.active ? "Ativa" : "Pausada"}
                </p>
              </div>

              <div className={styles.promotionInfoMetaActions}>
                <div className={styles.promotionDetails}>
                  <p className={styles.segment}>
                    Tipo: {promo.type || "Não informado"}
                  </p>
                  <p className={styles.validUntil}>
                    Vigência: {formatDate(promo.startDate)} →{" "}
                    {formatDate(promo.endDate)}
                  </p>
                </div>

                <div className={styles.actionsContainer}>
                  <button
                    className={styles.editButton}
                    onClick={() => handleOpenModal(promo)}
                    disabled={saving}
                  >
                    Editar
                  </button>
                  <button
                    className={
                      promo.active ? styles.pauseButton : styles.activateButton
                    }
                    onClick={() => handleToggleStatus(promo)}
                    disabled={saving}
                  >
                    {promo.active ? "Pausar" : "Reativar"}
                  </button>
                </div>
              </div>

              {promo.conditions && (
                <div className={styles.conditions}>
                  <strong>Condições:</strong> {promo.conditions}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Promoções</h3>
        <div className={styles.newPromotionButton} onClick={() => handleOpenModal()}>
          <Trophy className={styles.icon} />
          <button className={styles.button} disabled={saving}>
            Nova Promoção
          </button>
        </div>
      </div>

      {error && promotions.length > 0 && (
        <div className={styles.inlineError}>{error}</div>
      )}

      {renderContent()}

      <ModalPromotionList
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPromotion ? "Editar Promoção" : "Nova Promoção"}
      >
        <PromotionForm
          onClose={handleCloseModal}
          onSubmit={handleSubmitPromotion}
          initialData={editingPromotion}
          disabled={saving}
        />
      </ModalPromotionList>
    </div>
  );
};
