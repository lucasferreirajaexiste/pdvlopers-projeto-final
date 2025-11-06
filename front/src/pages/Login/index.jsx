"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import styles from "./login.module.css";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext"; 
import { useToast } from "../../hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false); // novo
  const [error, setError] = useState(""); // novo

  const navigate = useNavigate();
  const { login } = useAuth(); // novo
  const { toast } = useToast(); // novo

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const success = await login(email, senha);

    if (success) {
      navigate("/home");
    } else {
      setError("Usuário ou senha inválidos");
      toast({
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconWrapper}>
            <ShoppingCart className={styles.icon} />
          </div>
          <h2 className={styles.title}>Balcão</h2>
          <p className={styles.subtitle}>Faça login para acessar o sistema</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.error}>{error}</div>}
          <label className={styles.label}>E-Mail</label>
          <Input
            label="E-Mail"
            type="email"
            value={email}
            placeholder="seu@email.com"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className={styles.label}>Senha</label>
          <Input
            label="Senha"
            type="password"
            placeholder="********"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <Button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? <span className={styles.spinner}></span> : "Entrar"}
          </Button>

          <Link to="/forgot-password" className={styles.link}>
            Esqueci minha senha
          </Link>
        </form>
      </div>
    </div>
  );
}
