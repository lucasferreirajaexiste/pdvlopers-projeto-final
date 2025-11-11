import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api'
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ResetPassword() {
    const { token } = useParams();
    const [novaSenha, setNovaSenha] = useState('');
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        await api.post(`/reset-password/${token}`, { senha: novaSenha })
        alert('Senha alterada com sucesso!');
        navigate('/login');
    }

    return (
        <form onSubmit={handleSubmit}>
            <Input label="Nova senha" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)}/>
            <Button type="submit">Redefinir senha</Button>
        </form>
    )
}



