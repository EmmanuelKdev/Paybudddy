/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import './ComponentCss.css';
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from '@apollo/client';
import { toast } from "react-toastify";



const SEND_VERIFICATION_CODE_CLIENT = gql`
  mutation SendVerificationCode_Client($token: String!, $tid: Int!, $status: String!) {
    sendVerificationCode_Client(token: $token, tid: $tid, status: $status)
  }
`;

export function UserCodeEntry() {
  const [tid, setTid] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>('Complete');
  const {token} = useParams();
 

  const handleInputChangeTid = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTid(parseInt(event.target.value, 10));
  };

  const [sendVerificationCode, { loading, error }] = useMutation(SEND_VERIFICATION_CODE_CLIENT, {
    onCompleted: () => {
      toast.success("Verification code sent successfully.");
      
    },
    onError: (error) => {
      console.error("Failed to send verification code:", error);
      toast.error("Failed to send verification code.");
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await sendVerificationCode({ variables: { token, tid, status } });
    } catch (error) {
      console.error('Failed to send verification code:', error);
    }
  }

  return (
    <>
      <div className="authForm-containerL">
        <form className="loginform" onSubmit={handleSubmit}>
          <label htmlFor="tid">Transaction ID</label>
          <input
            onChange={handleInputChangeTid}
            value={tid !== null ? tid : ''}
            type="number"
            placeholder="Transaction ID"
            id="tid"
            name="tid"
            required
          />
          <button className="logsubmit" type="submit" disabled={loading}>
            Send Verification Code
          </button>
        </form>
        {error && <p className="error-message">Failed to send verification code</p>}
      </div>
    </>
  );
}

export default UserCodeEntry;