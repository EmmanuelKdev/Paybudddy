import React, { useState } from "react";
import './ComponentCss.css';
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { toast } from "react-toastify";

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdatePassword($token: String!, $password: String!) {
    updatePassword(token: $token, password: $password){
        _id
        name
    }
  }
`;

export function NewPass() {
  const [password, setPass] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();
  console.log(token);

  const handleInputChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPass(event.target.value);
  };

  const [updatePassword, { loading, error }] = useMutation(UPDATE_PASSWORD_MUTATION, {
    onCompleted: () => {
      toast.success("Password changed successfully.");
      navigate('/');
    },
    onError: (error) => {
      console.error("Failed to change password:", error);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await updatePassword({ variables: { token, password } });
    } catch (error) {
      console.error('Failed to change password:', error);
    }
  }

  return (
    <>
      <div className="authForm-containerL">
        <form className="loginform" onSubmit={handleSubmit}>
          <label htmlFor="password">Create new password</label>
          <input
            onChange={handleInputChangePass}
            value={password}
            type="password"
            placeholder="******"
            id="password"
            name="password"
          />
          <button className="logsubmit" type="submit" disabled={loading}>
            Create New Password
          </button>
        </form>
        {error && <p className="error-message">Failed to change password</p>}
      </div>
    </>
  );
}