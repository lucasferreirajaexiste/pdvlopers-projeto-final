"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import api from "../../services/api";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post("/login", { email, senha });
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch {
      alert("Usuário ou senha inválidos");
    }
  }

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Login</h2>
        <Input
          label="E-Mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="senha"
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <Button type="submit" className={styles.button}>
          Entrar
        </Button>
        <Link to="/forgot-password" className={styles.link}>
          Esqueci minha senha
        </Link>
      </form>
    </div>
  );
}
