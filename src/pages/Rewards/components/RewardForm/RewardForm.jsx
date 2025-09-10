import { useState } from 'react';
import styles from './RewardForm.module.css';

export const RewardForm = ({ onClose, onAddReward }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    points: '',
    category: '',
    isAvailable: true,
    validityDate: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.validityDate) {
      alert('Por favor, selecione uma data de validade');
      return;
    }

    // Chama a função para adicionar a recompensa
    onAddReward(formData);
  };

  const handleCancel = () => {
    onClose(); // Fecha o modal sem salvar
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome da Recompensa<span>*</span></label>
          <input 
            type="text" 
            name="name"
            className={styles.input}
            placeholder="Ex: Desconto 10%"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição<span>*</span></label>
          <textarea 
            name="description"
            className={styles.textarea}
            rows="3"
            placeholder="Descreva os benefícios desta recompensa"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Pontos Necessários<span>*</span></label>
            <input 
              type="number" 
              name="points"
              className={styles.input}
              placeholder="100"
              min="1"
              value={formData.points}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Categoria<span>*</span></label>
            <select 
              name="category"
              required
              className={styles.select}
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Selecione uma categoria</option>
              <option value="desconto">Desconto</option>
              <option value="produto">Produto Grátis</option>
              <option value="brinde">Brinde</option>
              <option value="vip">Benefício VIP</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Data de Validade<span>*</span></label>
            <input 
              type="date" 
              name="validityDate"
              required
              className={styles.input}
              value={formData.validityDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox" 
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className={styles.checkbox}
              />
              Disponível para resgate
            </label>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Imagem da Recompensa (opcional)</label>
          <input 
            type="file" 
            name="image"
            className={styles.fileInput}
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className={styles.info}>
          <p>Os campos com <span>*</span> são obrigatórios.</p>
          <div className={styles.formActions}>
            <button 
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className={styles.submitButton}
            >
              Criar Recompensa
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};