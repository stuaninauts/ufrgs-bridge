import React from 'react';
import { useLocation } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
const HomePage = () => {
    const location = useLocation();
    const { username } = location.state;

    return (
        <div>
            <h1>Welcomeeeee, {username}!</h1>
        </div>
    );
};

export default HomePage;