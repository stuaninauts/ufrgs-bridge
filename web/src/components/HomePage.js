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
            setMessage('Criou o projeto!');
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

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject) {
            setFormError('Please select a project.');
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
            setError('Please select a project.');
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
            setError('Please select a project.');
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
        <div>
            <h1>Bem vindo ao UFRGS Bridge!</h1>
            {homeProjects.length != 0 ? (
                <ul>
                    {homeProjects.map((project, index) => (
                        <li key={index}>
                            <p>Você é do projeto: {project.title}</p></li>
                    ))}
                </ul>
            ) : (
                <p>Você não está em nenhum projeto.</p>
            )}
            <br></br>

            {role === 'professor' && (
                <>
                    <b><h1>Create a Project</h1></b>
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titulo" required />
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descricao" required />
                        <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Contato" required />
                        
                        <button type="submit">Create Project</button>
                    </form>
                    {message && <p>{message}</p>}
                    {error && <p>{error}</p>}
                    <br/>
                    <b><h1>My Projects</h1></b>
                    <ul>
                        {projects.map(project => (
                            <li key={project.id}>
                                <h2>{project.title}</h2>
                                <p>{project.description}</p>
                                <p>Contact: {project.contactEmail}</p>
                                <br />
                            </li>
                        ))}
                    </ul>
                    <br/>
                    <b><h1>Create an Application Form</h1></b>
                    <form onSubmit={handleFormSubmit}>
                        <select onChange={(e) => setSelectedProject(projects.find(p => p.id === parseInt(e.target.value)))}>
                            <option value="">Select Project</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.title}</option>
                            ))}
                        </select>
                        <textarea value={additionalQuestions} onChange={(e) => setAdditionalQuestions(e.target.value)} placeholder="Comma-separated additional questions" />
                        <button type="submit">Create Form</button>
                    </form>
                    {formMessage && <p>{formMessage}</p>}
                    {formError && <p>{formError}</p>}
                    <br/>
                    <h1>Manage Applications</h1>
                    <button onClick={handleFetchApplications}>Fetch Applications</button>
                    {selectedProject && (
                        <>
                            <h2>Applications for {selectedProject.title}</h2>
                            <ul>
                                {applications.map(app => (
                                    <li key={app.id}>
                                        <p> id: {app.id}</p>
                                        <p>Student: {app.student}</p>
                                        <p>Answers: {app.answers}</p>
                                        <p>Status: {app.status}</p>
                                        <button onClick={() => handleResponseAction(app.id, 'accepted')}>Accept</button>
                                        <button onClick={() => handleResponseAction(app.id, 'rejected')}>Reject</button>
                                    </li>
                                ))}
                            </ul>
                            {responseMessage && <p>{responseMessage}</p>}
                            {error && <p>{error}</p>}
                        </>
                    )}

                </>
            )}

            {role === 'student' && (
                <>
                    <h1>All Projects</h1>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        <h2>{project.title}</h2>
                        <p>{project.description}</p>
                        <p>Contact: {project.contactEmail}</p>
                        <button onClick={() => handleProjectSelect(project)}>Apply to this project</button>
                        <br />
                    </li>
                ))}
            </ul>

            {selectedProject && (
                <>
                    <h2>Application Form for {selectedProject.title}</h2>
                    <form onSubmit={handleApply}>
                        {formQuestions.map((question, index) => (
                            <div key={index}>
                                <label>{question}</label>
                                <input
                                    type="text"
                                    onChange={(e) => setAnswers(prev => ({ ...prev, [index]: e.target.value }))}
                                    placeholder={`Answer for question ${index + 1}`}
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit">Submit Application</button>
                    </form>
                    {message && <p>{message}</p>}
                    {error && <p>{error}</p>}
                </>
            )}
                </>
            )}
        </div>
    );
};

export default HomePage;