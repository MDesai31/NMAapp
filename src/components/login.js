import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:9000/login', { username, password });
      alert(`Login successful! Token: ${data.token}`);
      navigate('/home');
    } catch (err) {
      console.error(err);
      alert('Invalid credentials!');
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>

    <button onClick={() => navigate('/register')}>Go to Register</button>
    </div>
  );
};

export default Login;
