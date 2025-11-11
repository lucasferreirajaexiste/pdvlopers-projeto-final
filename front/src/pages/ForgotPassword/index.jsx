import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import api from "../../services/api";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useToast } from "../../hooks/use-toast";
import styles from "../Login/login.module.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email });
      setSuccess(true);
      toast({
        title: "Email enviado!",
        description:
          data.message || "Verifique seu email para redefinir sua senha.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar email",
        description:
          error.response?.data?.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.iconWrapper}>
              <ShoppingCart className={styles.icon} />
            </div>
            <h2 className={styles.title}>Email Enviado!</h2>
            <p className={styles.subtitle}>
              Verifique sua caixa de entrada e siga as instruções para redefinir
              sua senha.
            </p>
          </div>
          <div className={styles.form}>
            <Link
              to="/login"
              className={styles.button}
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
              }}
            >
              <ArrowLeft style={{ marginRight: "8px", display: "inline" }} />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <ShoppingCart className={styles.icon} />
          </div>
          <h2 className={styles.title}>Recuperar Senha</h2>
          <p className={styles.subtitle}>
            Digite seu email para receber instruções de recuperação
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>E-Mail</label>
          <Input
            label="E-Mail"
            type="email"
            value={email}
            placeholder="seu@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              "Enviar Link de Recuperação"
            )}
          </Button>

          <Link to="/login" className={styles.link}>
            <ArrowLeft style={{ marginRight: "4px", display: "inline" }} />
            Voltar ao Login
          </Link>
        </form>
      </div>
    </div>
  );
}
