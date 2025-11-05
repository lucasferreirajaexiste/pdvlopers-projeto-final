import { useEffect, useState } from "react";
import styles from "./RewardForm.module.css";

const DEFAULT_FORM = {
  name: "",
  description: "",
  pointsRequired: "",
  active: true,
};

export const RewardForm = ({ onClose, onSubmit, initialData, disabled = false }) => {
  const [formData, setFormData] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        pointsRequired: String(initialData.pointsRequired ?? ""),
        active: initialData.active !== false,
      });
    } else {
      setFormData({ ...DEFAULT_FORM });
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.pointsRequired || Number(formData.pointsRequired) <= 0) {
      window.alert("Informe a quantidade de pontos necessária para resgate.");
      return;
    }

    onSubmit?.({
      name: formData.name.trim(),
      description: formData.description.trim(),
      pointsRequired: Number(formData.pointsRequired),
      active: formData.active,
    });
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Nome da Recompensa<span>*</span>
          </label>
          <input
            type="text"
            name="name"
            className={styles.input}
            placeholder="Ex: Desconto 10%"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Descrição<span>*</span>
          </label>
          <textarea
            name="description"
            className={styles.textarea}
            rows="3"
            placeholder="Descreva os benefícios desta recompensa"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Pontos Necessários<span>*</span>
          </label>
          <input
            type="number"
            name="pointsRequired"
            className={styles.input}
            placeholder="100"
            min="1"
            value={formData.pointsRequired}
            onChange={handleChange}
            required
            disabled={disabled}
          />
          <small className={styles.helperText}>
            Informe um número inteiro. Esses pontos serão debitados no resgate.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
              className={styles.checkbox}
              disabled={disabled}
            />
            Disponível para resgate
          </label>
        </div>

        <div className={styles.info}>
          <p>
            Os campos com <span>*</span> são obrigatórios.
          </p>
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={disabled}
            >
              Cancelar
            </button>
            <button type="submit" className={styles.submitButton} disabled={disabled}>
              {initialData ? "Atualizar Recompensa" : "Criar Recompensa"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
