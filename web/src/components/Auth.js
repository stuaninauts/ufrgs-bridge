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
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = isRegister
            ? { email, unique_code: uniqueCode, full_name: fullName, password, role }
            : { unique_code: uniqueCode, password };

        try {
            const url = isRegister ? '/api/register/' : '/api/login/';
            const response = await axios.post(url, user);
            console.log(response.data);
            setError('');  
            if (isRegister) {
                setMessage('Cadastro feito com sucesso! Por favor, acesse seu email para verificar a sua conta.');
            } else {
                setMessage('Login successful!');
                navigate('/home', { state: {fullName: response.data.full_name, token: response.data.token, role: response.data.role} });

            }
        } catch (error) {
            setError(error.response.data);
            console.error(error.response.data);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 space-y-6 shadow-lg">
                <div className="text-center">
                    <img src="logo.png" alt="Logo" className="mx-auto h-12 w-12 rounded-full" />
                    <h2 className="mt-6 text-3xl font-extrabold text-white">
                        {isRegister ? 'CADASTRO' : 'LOGIN'}
                    </h2>
                </div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {isRegister && (
                        <>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-white">Email</label>
                                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="00123456@ufrgs.br" required />
                            </div>
                            <div>
                                <label htmlFor="matricula" className="block text-sm font-medium text-white">Número de Matrícula</label>
                                <input id="matricula" type="text" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="00123456" required />
                            </div>
                            <div>
                                <label htmlFor="nome" className="block text-sm font-medium text-white">Nome</label>
                                <input id="nome" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="Nome Sobrenome" required />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block text-sm font-medium text-white">Senha</label>
                                <input id="senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="Senha" required />
                            </div>
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-white">Cargo</label>
                                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" required>
                                    <option value="student">Estudante</option>
                                    <option value="professor">Professor</option>
                                    <option value="tech">Técnico Administrativo</option>
                                </select>
                            </div>
                        </>
                    )}
                    {!isRegister && (
                        <>
                            <div>
                                <label htmlFor="matricula" className="block text-sm font-medium text-white">Matrícula</label>
                                <input id="matricula" type="text" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="00123456" required />
                            </div>
                            <div>
                                <label htmlFor="senha" className="block text-sm font-medium text-white">Senha</label>
                                <input id="senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 rounded bg-gray-700 text-white" placeholder="Senha" required />
                            </div>
                        </>
                    )}
                    <div>
                        <button type="submit" className="w-full p-2 bg-red-600 rounded text-white">
                            {isRegister ? 'Cadastrar' : 'Login'}
                        </button>
                    </div>
                    {error && <div className="text-red-500 text-sm mt-2">{JSON.stringify(error)}</div>}
                    {message && <div className="text-green-500 text-sm mt-2">{message}</div>}
                </form>
                <div className="mt-6 text-center">
                    <button onClick={() => setIsRegister(!isRegister)} className="text-white hover:text-gray-400">
                        {isRegister ? 'Trocar para Login' : 'Trocar para Cadastro'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
