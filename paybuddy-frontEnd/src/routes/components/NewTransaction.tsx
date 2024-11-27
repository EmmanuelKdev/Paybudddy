/* eslint-disable @typescript-eslint/no-unused-vars */
import './ComponentCss.css';
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';

const INSERT_NEW_TRANSACTION_MUTATION = gql`
  mutation InsertNewTransaction($tdata: TransactionInput!) {
    insertNewTransaction(tdata: $tdata)
  }
`;

const NewTransaction = () => {
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amountToBePaid, setAmount] = useState('');
  const [payerName, setPayer] = useState('');
  const [error, setError] = useState('');
  const { setActivity, setTrigerr } = useContext(AppContext);
  const navigate = useNavigate();

  const handleInputChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };
  const handleInputChangePayer = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPayer(event.target.value);
  };
  const handleInputChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value);
  };
  const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const [insertNewTransaction, { loading, error: mutationError }] = useMutation(INSERT_NEW_TRANSACTION_MUTATION, {
    onCompleted: () => {
      setActivity('You created a transaction!');
      setTimeout(() => {
        setTrigerr(true);
        console.log('trigger set off now');
      }, 1000);
      navigate('pendingT');
    },
    onError: (error) => {
      console.error("Failed to create transaction:", error);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await insertNewTransaction({
        variables: {
          tdata: {
            title,
            payerName,
            email,
            amountToBePaid: parseFloat(amountToBePaid),
            description,
          },
        },
      });
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  }

  return (
    <div className="authForm-container">
      <form className="NewTransActionForm" onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label>
        <input onChange={handleInputChangeName} value={title} name="title" id="title" type="text" />
        <label htmlFor="description">Description</label>
        <input onChange={handleInputChangeDescription} value={description} name="description" id="description" type="text" />
        <label htmlFor="payerName">Payer's Name</label>
        <input onChange={handleInputChangePayer} value={payerName} name="payerName" id="payerName" type="text" />
        <label htmlFor="email">Payer's Email</label>
        <input onChange={handleInputChangeEmail} value={email} type="email" id="email" name="email" />
        <label htmlFor="amountToBePaid">Amount To Be Paid</label>
        <input onChange={handleInputChangeAmount} value={amountToBePaid} type="text" id="amount" name="amount" />
        <p className="passerror">{error}</p>
        <button className="createTrans" type="submit" disabled={loading}>Create</button>
        <Link to='activityLog'><button className="createTransC">Cancel</button></Link>
      </form>
      {mutationError && <p className="error-message">Failed to create transaction</p>}
    </div>
  );
};

export default NewTransaction;