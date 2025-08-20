import { useNavigate } from 'react-router-dom';
import styles from './PromotionForm.module.css';

export const PromotionForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para criar a promoção
    navigate('/rewards/promotions'); // Volta para a página anterior (lista de promoções)
  };

  const handleCancel = () => {
    navigate('/rewards/promotions'); // Volta para a lista após criar
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Nova Promoção</h3>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Nome da Promoção</label>
          <input 
            type="text" 
            className={styles.input}
            placeholder="Ex: Dobro de Pontos"
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label className={styles.label}>Descrição</label>
          <textarea 
            className={styles.textarea}
            rows="3"
            placeholder="Descreva os benefícios da promoção"
            required
          ></textarea>
        </div>
        
        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Segmento</label>
            <select className={styles.select} required>
              <option value="">Selecione um segmento</option>
              <option>Todos os clientes</option>
              <option>Clientes Bronze</option>
              <option>Clientes Silver</option>
              <option>Clientes Gold</option>
              <option>Clientes VIP</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Validade</label>
            <input 
              type="date" 
              className={styles.input}
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
            Criar Promoção
          </button>
        </div>
      </form>
    </div>
  );
};