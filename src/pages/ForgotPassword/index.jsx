import { useState } from 'react';
import api from '../../services/api'
import Input from '../../components/Input';
import Button from '../../components/Button';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        await api.post('/forgot-password', { email })
        alert('Verifique seu email para redefinir sua senha');
    }
    return (
        <form onSubmit={handleSubmit}>
            <Input label="Digite seu e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)}/>
            <Button type="submit">Enviar Link</Button>
        </form>
    )
}


