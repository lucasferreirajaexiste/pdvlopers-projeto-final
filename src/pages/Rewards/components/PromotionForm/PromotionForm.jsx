import { useState } from 'react';
import styles from './PromotionForm.module.css';

export const PromotionForm = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    segment: '',
    validUntil: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Passar dados para a função
    onClose(); // Fecha o modal após adicionar
  };

  const handleCancel = () => {
    onClose(); // Fecha o modal sem salvar
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome da Promoção</label>
          <input 
            type="text" 
            name="name"
            className={styles.input}
            placeholder="Ex: Dobro de Pontos"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea 
            name="description"
            className={styles.textarea}
            rows="3"
            placeholder="Descreva os benefícios da promoção"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Segmento</label>
            <select 
              name="segment"
              className={styles.select}
              value={formData.segment}
              onChange={handleChange}
              required
            >
              <option value="">Selecione um segmento</option>
              <option value="Todos os clientes">Todos os clientes</option>
              <option value="Clientes Bronze">Clientes Bronze</option>
              <option value="Clientes Silver">Clientes Silver</option>
              <option value="Clientes Gold">Clientes Gold</option>
              <option value="Clientes VIP">Clientes VIP</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Validade</label>
            <input 
              type="date" 
              name="validUntil"
              min={new Date().toISOString().split('T')[0]}
              className={styles.input}
              value={formData.validUntil}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
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
            {initialData ? "Atualizar Promoção" : "Criar Promoção"}
          </button>
        </div>
      </form>
    </div>
  );
};