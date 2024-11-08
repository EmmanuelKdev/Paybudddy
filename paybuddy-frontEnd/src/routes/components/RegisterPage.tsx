import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import './ComponentCss.css';

const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      _id
      name
      email
    }
  }
`;

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [register, { loading, error: mutationError }] = useMutation(REGISTER_USER);

  const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };

  const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length >= 8) {
      try {
        await register({ variables: { name, email, password } });
        navigate('/'); // Redirect to home page after successful registration
      } catch (err) {
        setError('Registration failed');
      }
    } else {
      setError('Password must be at least 8 characters long');
    }
  }

  return (
    <div className="authForm-containerL">
      <form className="loginform" onSubmit={handleSubmit}>
        <label htmlFor="name">Full Name</label>
        <input
          onChange={handleInputChangeName}
          value={name}
          name="name"
          id="name"
          placeholder="Full name"
          type="text"
        />
        <label htmlFor="email">Email</label>
        <input
          onChange={handleInputChangeEmail}
          value={email}
          type="email"
          placeholder="youremail@example.com"
          id="email"
          name="email"
        />
        <label htmlFor="password">Password</label>
        <input
          onChange={handleInputChangePassword}
          value={password}
          type="password"
          placeholder="******"
          id="password"
          name="password"
        />
        {error && <p className="error">{error}</p>}
        {mutationError && <p className="error">{mutationError.message}</p>}
        <button className="logsubmit" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <br />
        <Link to="/">
          <button className="regBtn">Already have an account? Login here</button>
        </Link>
      </form>
    </div>
  );
};

export default Register;