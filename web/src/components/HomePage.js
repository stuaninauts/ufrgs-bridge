import React from 'react';
import { useLocation } from 'react-router-dom';

const HomePage = () => {
    const location = useLocation();
    const { fullName } = location.state;

    return (
        <div>
            <h1>Bem vindo ao UFRGS Bridge, {fullName}!</h1>
        </div>
    );
};

export default HomePage;