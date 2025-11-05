import { useEffect, useState } from "react";
import styles from "./PromotionForm.module.css";

const DEFAULT_VALUES = {
  title: "",
  description: "",
  type: "",
  conditions: "",
  startDate: "",
  endDate: "",
  active: true,
};

const TYPE_OPTIONS = [
  { value: "", label: "Selecione o tipo" },
  { value: "double_points", label: "Pontos em dobro" },
  { value: "cashback", label: "Cashback" },
  { value: "bonus_reward", label: "Bônus na primeira compra" },
  { value: "custom", label: "Personalizado" },
];

export const PromotionForm = ({
  onClose,
  onSubmit,
  initialData,
  disabled = false,
}) => {
  const [formData, setFormData] = useState(DEFAULT_VALUES);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        type: initialData.type || "",
        conditions: initialData.conditions || "",
        startDate: initialData.startDate
          ? initialData.startDate.slice(0, 10)
          : "",
        endDate: initialData.endDate ? initialData.endDate.slice(0, 10) : "",
        active: initialData.active !== false,
      });
    } else {
      setFormData({ ...DEFAULT_VALUES });
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

    if (formData.endDate && formData.startDate > formData.endDate) {
      window.alert("A data final deve ser posterior à data inicial.");
      return;
    }

    onSubmit?.({
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      conditions: formData.conditions.trim(),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
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
            Título da promoção<span>*</span>
          </label>
          <input
            type="text"
            name="title"
            className={styles.input}
            placeholder="Ex: Pontos em dobro"
            value={formData.title}
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
            placeholder="Descreva os benefícios da promoção"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo</label>
            <select
              name="type"
              className={styles.select}
              value={formData.type}
              onChange={handleChange}
              disabled={disabled}
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Ativa</label>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className={styles.checkbox}
                disabled={disabled}
              />
              Disponível para os clientes
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Condições / Público</label>
          <textarea
            name="conditions"
            className={styles.textarea}
            rows="2"
            placeholder="Informe segmentação ou regras (opcional)"
            value={formData.conditions}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Início</label>
            <input
              type="date"
              name="startDate"
              className={styles.input}
              value={formData.startDate || ""}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Término</label>
            <input
              type="date"
              name="endDate"
              min={formData.startDate || undefined}
              className={styles.input}
              value={formData.endDate || ""}
              onChange={handleChange}
              disabled={disabled}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={disabled}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={disabled}
          >
            {initialData ? "Atualizar Promoção" : "Criar Promoção"}
          </button>
        </div>
      </form>
    </div>
  );
};
