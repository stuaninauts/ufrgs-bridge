import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
    const location = useLocation();
    const { token } = location.state || {}; // Destructure token from state
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                setError('No token found');
                return;
            }

            try {
                const response = await fetch('api/user/profile/', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
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
        return <p>Error: {error}</p>;
    }

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>Perfil</h2>
            <p>Email: {userData.email}</p>
            <p>Matrícula: {userData.unique_code}</p>
            <p>Nome Completo: {userData.full_name}</p>
            <p>Papel: {userData.role}</p>
        </div>
    );
};

export default ProfilePage;
