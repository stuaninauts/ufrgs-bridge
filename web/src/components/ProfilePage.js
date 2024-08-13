import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const ProfilePage = () => {
    const location = useLocation();
    const token = localStorage.getItem("Token") // Destructure token from state
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setError('Token não encontrado.');
                return;
            }

            try {
                const response = await fetch('/api/user/profile/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Falha ao buscar os dados do usuário.');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchUserData();
    }, [token]);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-blue-500 text-lg">Carregando...</p>
            </div>
        );
    }


    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center">Perfil do Usuário</h2>
                <div className="space-y-4">
                    <p><span className="font-semibold">Email:</span> {userData.email}</p>
                    <p><span className="font-semibold">Matrícula:</span> {userData.unique_code}</p>
                    <p><span className="font-semibold">Nome Completo:</span> {userData.full_name}</p>
                    <p><span className="font-semibold">Papel:</span> {userData.role}</p>
                </div>
                <div className="mt-8 text-center">
                    <Link 
                        to={{
                            pathname: '/home',
                            state: { token: token }
                        }} 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition duration-300"
                    >
                        Voltar para Home
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
