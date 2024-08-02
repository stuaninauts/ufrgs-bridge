import React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
    const location = useLocation();
    const { fullName, token, user, role} = location.state || {}

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const [projects, setProjects] = useState([]);

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {
            const response = await axios.post('/api/create_project/', 
                {title, description, contactEmail},  
                {
                    headers: {
                        'Authorization': `Token ${token}`, 
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(response);
            setMessage('Criou o projeto!');
            setError('');
            fetchProjects();
        } catch (error) {
            console.log('Error caught:');
            console.log(error);  // Log the error for debugging

            if (error.response) {
                // Server responded with a status other than 2xx
                console.log('Response data:', error.response.data);
                console.log('Response status:', error.response.status);
                console.log('Response headers:', error.response.headers);
                setError(`Error: ${error.response.data.detail || 'Something went wrong.'}`);
            } else if (error.request) {
                // Request was made but no response was received
                console.log('Request data:', error.request);
                setError('No response from the server.');
            } else {
                // Something else caused the error
                console.log('Error message:', error.message);
                setError('Error: Request failed.');
            }
            //setError('Erro.');
            setMessage('');
        }
    };
    
    const fetchProjects = async () => {

        try {
            const response = await axios.get('/api/list_my_projects/', {
                headers: { 'Authorization': `Token ${token}` }
            });
            setProjects(response.data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch projects.');
        }
    };

    useEffect(() => {
        fetchProjects();  // Fetch projects on component mount
    }, []);

    return (
        <div>
            <h1>Bem vindo ao UFRGS Bridge, {fullName}!</h1>

            <h1>Create a Project</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo" required />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descricao" required />
                <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Contato" required />
                <button type="submit">Create Project</button>
            </form>
            {message && <p>{message}</p>}
            {error && <p>{error}</p>}

            <h1>My Projects</h1>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <p>Contact: {project.contactEmail}</p>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default HomePage;