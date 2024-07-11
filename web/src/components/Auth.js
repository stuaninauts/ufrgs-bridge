import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(true);
    const [email, setEmail] = useState('');
    const [uniqueCode, setUniqueCode] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = isRegister
            ? { email, unique_code: uniqueCode, full_name: fullName, password, role }
            : { unique_code: uniqueCode, password };

        try {
            const url = isRegister ? '/api/register/' : '/api/login/';
            const response = await axios.post(url, user);
            console.log(response.data);
            setError('');  // Clear error if request is successful
            if (isRegister) {
                setMessage('Cadastro feito com sucesso! Por favor, acesse seu email para verificar a sua conta.');
            } else {
                setMessage('Login successful!');
                navigate('/home', { state: { fullName: response.data.full_name } });

            }
        } catch (error) {
            setError(error.response.data);
            console.error(error.response.data);
        }
    };

    return (
        <div>
            <button onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Trocar para Login' : 'Trocar para Cadastro'}
            </button>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <>  
                        <label for="email">Email</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="00123456@ufrgs.br" required />
                        <br />
                        
                        <label for="matricula">Número de Matrícula</label>
                        <input id="matricula" type="text" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} placeholder="00123456" required />
                        <br />

                        <label for="nome">Nome</label>
                        <input id="nome" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nome Sobrenome" required />
                        <br />

                        <label for="senha">Senha</label>
                        <input id="senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                        <br />

                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="student">Estudante</option>
                            <option value="professor">Professor</option>
                            <option value="tech">Técnico Administrativo</option>
                        </select>
                    </>
                )}
                {!isRegister && (
                    <>
                        <label for="matricula">Matrícula</label>
                        <input id="matricula" type="text" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} placeholder="00123456" required />
                        <br />

                        <label for="senha">Senha</label>
                        <input id="senha"type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" required />
                        <br />
                    </>
                )}
                <button type="submit">{isRegister ? 'Cadastrar' : 'Login'}</button>
                {error && <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>}
                {message && <div style={{ color: 'green' }}>{message}</div>}
            </form>
        </div>
    );
};

export default Auth;
