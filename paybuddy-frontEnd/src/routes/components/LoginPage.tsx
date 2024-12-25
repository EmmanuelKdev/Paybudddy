import React, { useContext, useState } from "react";
import './ComponentCss.css';
import { Link, useNavigate } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { AppContext } from "../App";


const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPass] = useState('');
  const { setLogInState, setTrigerr } = useContext(AppContext);
  const navigate = useNavigate();

  const [login, { loading, error: mutationError }] = useMutation(LOGIN_USER);

  const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const response = await login({ variables: { email, password } });
      if (response.data.login) {
        setLogInState(true);
        setTrigerr(true);
        navigate('/'); // Redirect to home page after successful login
        console.log("Login successful");
      } else {
        console.log("Login failed");
      }
    } catch (err) {
      console.error("Login error", err);
    }
  }

  return (
    <div className="authForm-containerL">
      <form className="loginform" onSubmit={handleSubmit}>
        <div className="heading">
          <p>Welcome to Pay-Buddy</p>
        </div>
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
        <br />
        {mutationError && <p className="error">{mutationError.message}</p>}
        <button className="logsubmit" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : '-Log In-'}
        </button>
        <Link to='forgotpass'><p>Forgotten Password?</p></Link>
        <Link to='register'><button className="regBtn">Don't have an account? Register here</button></Link>
      </form>
    </div>
  );
};

export default Login;