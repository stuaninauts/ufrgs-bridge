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

    const [additionalQuestions, setAdditionalQuestions] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [formError, setFormError] = useState('');
    const [selectedProject, setSelectedProject] = useState(null);

    const [formQuestions, setFormQuestions] = useState([]);
    const [answers, setAnswers] = useState('');

    const [applications, setApplications] = useState([]);
    const [selectedResponse, setSelectedResponse] = useState(null);
    const [responseMessage, setResponseMessage] = useState('');

    const [homeProjects, setHomeProjects] = useState([]);

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
            setMessage('Projeto Criado!');
            fetchProjects(role);
            setError('');
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
            setMessage('');
        }
    };

    // criar formulario de inscricao
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            setFormError('Selecione um projeto.');
            return;
        }



        try {
            const response = await axios.post('/api/create_form/', 
                { 
                    project: selectedProject.id, 
                    additional_questions: additionalQuestions 
                },  
                { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' } }
            );
            setFormMessage('Application form created successfully.');
            console.log(additionalQuestions);
            setFormError('');
        } catch (error) {
            console.log(error);
            setFormError('Error creating form.');
            setFormMessage('');
        }
    };
    
    const fetchProjects = async (role) => {
        const url = role === 'professor' ? '/api/list_my_projects/' : '/api/list_projects/';
        
        try {
            const response = await axios.get(url, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setProjects(response.data);
        } catch (error) {
            console.error(error);
            setError('Failed to fetch projects.');
        }
    };

    useEffect(() => {
        fetchProjects(role);  // Fetch projects on component mount
    }, [role]);

    const fetchFormDetails = async (projectId) => {
        try {
            const response = await axios.get(`/api/form_details/${projectId}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setFormQuestions(response.data.questions);
        } catch (error) {
            console.error('Failed to fetch form details:', error);
            setError('Failed to fetch form details.');
        }
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            setError('2.');
            return;
        }

        console.log(selectedProject.id);

        try {
            await axios.post('/api/apply_to_project/', 
                { 
                    project: selectedProject.id, 
                    answers: answers 
                },  
                { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' } }
            );
            setMessage('Application submitted successfully.');
            setError('');
        } catch (error) {
            console.error('Failed to submit application:', error);
            setError('Failed to submit application.');
            setMessage('');
        }
    };

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
        fetchFormDetails(project.id);
    };

    const handleFetchApplications = () => {
        if (selectedProject) {
            fetchApplications(selectedProject.id);
        } else {""
            // TODO: ta ficando no lugar errado isso
            setError('Selecione um projeto. (buscar inscricoes)');
        }
    };
    
    const fetchApplications = async (projectId) => {
        try {
            const response = await axios.get(`/api/responses/${projectId}`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            setApplications(response.data);

        } catch (error) {
            console.error('Failed to fetch applications:', error);
            setError('Failed to fetch applications.');
        }
    };

    const handleResponseAction = async (applicationId, action) => {
        try {
            await axios.post(`/api/response_action/${applicationId}/`, 
                { action, applicationId },  
                { headers: { 'Authorization': `Token ${token}`, 'Content-Type': 'application/json' } }
            );
            setResponseMessage(`Application ${action} successfully.`);
            fetchApplications(selectedProject.id);  
        } catch (error) {
            setResponseMessage(`Failed to ${action} application.`);
        }
    };

    useEffect(() => {
        const fetchHomeProjects = async () => {
            try {
                const response = await axios.get('/api/user/projects/', {
                    headers: { 'Authorization': `Token ${token}` }
                });
                setHomeProjects(response.data.projects);
            } catch (error) {
                setError(error);
            }
        };

        fetchHomeProjects();
    }, []);

        return (
    <div className="bg-gray-900 min-h-screen text-white">
        <nav className="flex items-center justify-center bg-gray-800 p-4 shadow">
            <img src="static/icons/bridge.png" alt="Logo" className="h-12 w-12 rounded-full mr-4" />
            <h1 className="text-2xl font-bold text-white">UFRGS Bridge</h1>
        </nav>
        
        <div className="p-6">
            {homeProjects.length !== 0 ? (
                <p className="text-xl p-4 shadow rounded-lg bg-gray-800">
                    Você participa do(s) projeto(s):  
                    <span className="font-semibold px-2">
                        {homeProjects.map((project, index) => (
                            <span key={index}>
                                {project.title}
                                {index < homeProjects.length - 1 && ', '}
                            </span>
                        ))}
                    </span>
                </p>
            ) : (
                <p className="text-xl text-gray-400">Você não está em nenhum projeto.</p>
            )}
            
            <br />

            {role === 'professor' && (
                <>
                    <h2 className="text-2xl font-bold mb-4">Meus Projetos de Extensão</h2>
                    <ul className="space-y-4">
                        {projects.map(project => (
                            <li key={project.id} className="bg-gray-800 p-4 shadow rounded-lg">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <p className="text-gray-400">{project.description}</p>
                                <p className="text-gray-400">Contato: {project.contactEmail}</p>
                            </li>
                        ))}
                    </ul>
                    <br />

                    <h2 className="text-2xl font-bold mb-4">Criar um Projeto de Extensão</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            placeholder="Título" 
                            required 
                            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        />
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            placeholder="Descrição" 
                            required 
                            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        />
                        <input 
                            type="email" 
                            value={contactEmail} 
                            onChange={(e) => setContactEmail(e.target.value)} 
                            placeholder="Contato" 
                            required 
                            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        />
                        <button 
                            type="submit" 
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                        >
                            Criar Projeto
                        </button>
                    </form>
                    {message && <p className="text-green-500 mt-4">{message}</p>}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    <br />

                    <h2 className="text-2xl font-bold mb-4">Criar Formulário de Inscrição para um Projeto</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <select 
                            onChange={(e) => setSelectedProject(projects.find(p => p.id === parseInt(e.target.value)))} 
                            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        >
                            <option value="">Selecionar Projeto</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.title}</option>
                            ))}
                        </select>
                        <textarea 
                            value={additionalQuestions} 
                            onChange={(e) => setAdditionalQuestions(e.target.value)} 
                            placeholder="Perguntas adicionais, separadas por vírgula" 
                            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                        />
                        <button 
                            type="submit" 
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                        >
                            Criar Formulário
                        </button>
                    </form>
                    {formMessage && <p className="text-green-500 mt-4">{formMessage}</p>}
                    {formError && <p className="text-red-500 mt-4">{formError}</p>}
                    <br />

                    <h2 className="text-2xl font-bold mb-4">Gerenciar Inscrições de Alunos para os Projetos de Extensão</h2>
                    <button 
                        onClick={handleFetchApplications} 
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                    >
                        Buscar Inscrições
                    </button>
                    {selectedProject && (
                        <>
                            <h3 className="text-xl font-semibold mt-6">Inscrições para o Projeto {selectedProject.title}</h3>
                            <ul className="space-y-4">
                                {applications.map(app => (
                                    <li key={app.id} className="bg-gray-800 p-4 shadow rounded-lg">
                                        <p className="text-gray-400">ID: {app.id}</p>
                                        <p className="text-gray-400">Estudante: {app.student}</p>
                                        <p className="text-gray-400">Respostas: {app.answers}</p>
                                        <p className="text-gray-400">Status: {app.status}</p>
                                        <div className="flex space-x-4 mt-2">
                                            <button 
                                                onClick={() => handleResponseAction(app.id, 'accepted')} 
                                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                            >
                                                Aceitar
                                            </button>
                                            <button 
                                                onClick={() => handleResponseAction(app.id, 'rejected')} 
                                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                                            >
                                                Rejeitar
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {responseMessage && <p className="text-green-500 mt-4">{responseMessage}</p>}
                            {error && <p className="text-red-500 mt-4">{error}</p>}
                        </>
                    )}
                </>
            )}

            {role === 'student' && (
                <>
                    <h2 className="text-2xl font-bold mb-4">Todos Projetos</h2>
                    <ul className="space-y-4">
                        {projects.map(project => (
                            <li key={project.id} className="bg-gray-800 p-4 shadow rounded-lg">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <p className="text-gray-400">{project.description}</p>
                                <p className="text-gray-400">Contato: {project.contactEmail}</p>
                                <button 
                                    onClick={() => handleProjectSelect(project)} 
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900 mt-2"
                                >
                                    Se inscrever neste projeto
                                </button>
                            </li>
                        ))}
                    </ul>

                    {selectedProject && (
                        <>
                            <h3 className="text-xl font-semibold mt-6">Formulário de Inscrição para o Projeto {selectedProject.title}</h3>
                            <form onSubmit={handleApply} className="space-y-4">
                                {formQuestions.map((question, index) => (
                                    <div key={index}>
                                        <label className="block text-gray-400">{question}</label>
                                        <input
                                            type="text"
                                            onChange={(e) => setAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                                            placeholder={`Responda à questão ${index + 1}`}
                                            required
                                            className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                                        />
                                    </div>
                                ))}
                                <button 
                                    type="submit" 
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-900"
                                >
                                    Submeter Inscrição
                                </button>
                            </form>
                            {message && <p className="text-green-500 mt-4">{message}</p>}
                            {error && <p className="text-red-500 mt-4">{error}</p>}
                        </>
                    )}
                </>
            )}
        </div>
    </div>

    );
};

export default HomePage;