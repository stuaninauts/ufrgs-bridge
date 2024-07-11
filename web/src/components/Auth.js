import React, { useState } from 'react';
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
            setError('');  // Clear error if request is successful
            if (isRegister) {
                setMessage('Registration successful! Please check your email to activate your account.');
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
                {isRegister ? 'Switch to Login' : 'Switch to Register'}
            </button>
            <form onSubmit={handleSubmit}>
                {isRegister && (
                    <>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                        <input type="text" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} placeholder="Unique Code" required />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name" required />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                        <select value={role} onChange={(e) => setRole(e.target.value)} required>
                            <option value="student">Student</option>
                            <option value="tech">Tech</option>
                            <option value="professor">Professor</option>
                        </select>
                    </>
                )}
                {!isRegister && (
                    <>
                        <input type="text" value={uniqueCode} onChange={(e) => setUniqueCode(e.target.value)} placeholder="Unique Code" required />
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                    </>
                )}
                <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
                {error && <div style={{ color: 'red' }}>{JSON.stringify(error)}</div>}
                {message && <div style={{ color: 'green' }}>{message}</div>}
            </form>
        </div>
    );
};

export default Auth;
