
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import Input from "../../components/Input";
import Button from "../../components/Button";

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            const {data} = await api.post('/login', {email, senha});
            localStorage.setItem('token', data.token);
            navigate('/dashboard')

        } catch {
            alert('Usuário ou senha inválidos');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input label="E-Mail" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            <Input label="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} />
            <Button type="submit">Entrar</Button>
            <Link to ="/forto-password">Esqueci minha senha</Link>
        </form>
    )
}


