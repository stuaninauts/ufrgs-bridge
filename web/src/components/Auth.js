import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
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
        <div className="flex items-center justify-center min-h-screen w-full bg-gray-900 p-4">
            <div className="w-full max-w-md p-8 bg-gray-800 border border-gray-700 rounded-lg shadow-md">
                <img src="static/icons/bridge.png" alt="Logo" className="mx-auto h-12 w-12 rounded-full" />
                <h2 className="my-6 text-center text-3xl font-extrabold text-white">
                    {isRegister ? 'CADASTRO' : 'LOGIN'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegister ? (
                        <>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-200">Email</label>
                                <input 
                                    id="email" 
                                    type="email" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    placeholder="00123456@ufrgs.br" 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="matricula" className="block mb-2 text-sm font-medium text-gray-200">Número de Matrícula</label>
                                <input 
                                    id="matricula" 
                                    type="text" 
                                    value={uniqueCode} 
                                    onChange={(e) => setUniqueCode(e.target.value)} 
                                    placeholder="00123456" 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-200">Nome</label>
                                <input 
                                    id="nome" 
                                    type="text" 
                                    value={fullName} 
                                    onChange={(e) => setFullName(e.target.value)} 
                                    placeholder="Nome Sobrenome" 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-200">Senha</label>
                                <input 
                                    id="senha" 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Senha" 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-200">Cargo</label>
                                <select 
                                    id="role"
                                    value={role} 
                                    onChange={(e) => setRole(e.target.value)} 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                >
                                    <option value="student">Estudante</option>
                                    <option value="professor">Professor</option>
                                    <option value="tech">Técnico Administrativo</option>
                                </select>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <label htmlFor="matricula" className="block mb-2 text-sm font-medium text-gray-200">Matrícula</label>
                                <input 
                                    id="matricula" 
                                    type="text" 
                                    value={uniqueCode} 
                                    onChange={(e) => setUniqueCode(e.target.value)} 
                                    placeholder="00123456" 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                />
                            </div>

                            <div>
                                <label htmlFor="senha" className="block mb-2 text-sm font-medium text-gray-200">Senha</label>
                                <input 
                                    id="senha" 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Senha" 
                                    required 
                                    className="w-full p-2.5 bg-gray-700 border border-gray-600 text-white rounded-lg"
                                />
                            </div>
                        </>
                    )}

                    <button 
                        type="submit" 
                        className="w-full text-white bg-blue-600 hover:bg-blue-900 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                    >
                        {isRegister ? 'Cadastrar' : 'Login'}
                    </button>

                    {/* TODO: arrumar que ta aparecendo {'error': msg} nao soh mensagem */}
                    {error && <div className="text-red-500">{JSON.stringify(error)}</div>}
                    {message && <div className="text-green-500">{message}</div>}
                </form>

                <div className="text-center text-sm font-medium py-2 text-gray-500 dark:text-gray-300">
                    {!isRegister ? 'Ainda não tem uma conta? ' : ''}
                    <a 
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-blue-700 hover:underline dark:text-blue-900 cursor-pointer"
                        style={{ cursor: 'pointer' }}
                    >
                        {!isRegister ? 'Criar Conta' : 'Voltar para Login'}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Auth;