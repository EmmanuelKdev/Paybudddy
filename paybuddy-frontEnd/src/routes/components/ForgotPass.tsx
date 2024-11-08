import React, { useState } from "react";
import './ComponentCss.css';
import { Link } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { toast } from "react-toastify";


const FORGOTTEN_PASS_MUTATION = gql`
  mutation ForgottenPass($email: String!) {
    forgottenPass(email: $email)
  }
`;

export function Forgottpass() {
  const [email, setEmail] = useState('');
  

  const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const [forgottenPass, { loading, error }] = useMutation(FORGOTTEN_PASS_MUTATION, {
    onCompleted: () => {
      toast.success("Reset password email sent. Please check your inbox.");
     
    },
    onError: (error) => {
      console.error("Failed to send reset password email:", error);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await forgottenPass({ variables: { email } });
    } catch (error) {
      console.error('Failed to send reset password email:', error);
    }
  }

  return (
    <>
      <div className="authForm-containerL">
        <form className="loginform" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            onChange={handleInputChangeEmail}
            value={email}
            type="email"
            placeholder="youremail@example.com"
            id="email"
            name="email"
          />
          <button className="logsubmit" type="submit" disabled={loading}>
            Reset
          </button>
          <br />
          <Link to="/"><button className="regBtn">Cancel</button></Link>
        </form>
        {error && <p className="error-message">Failed to send reset password email</p>}
      </div>
    </>
  );
}