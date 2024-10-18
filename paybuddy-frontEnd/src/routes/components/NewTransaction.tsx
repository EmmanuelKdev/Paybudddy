import './ComponentCss.css'
import React, { useState} from "react"
import axios from "axios";
import { useNavigate} from "react-router-dom";
import { useContext } from 'react';
import { AppContext } from '../App';
import { Link } from 'react-router-dom';






const NewTransaction = () => {
    const [email, setEmail] = useState('');
   
    const [title, setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [amountToBePaid, setAmount] = useState('')
    
    const [payerName,setPayer] = useState('');
    const [error,setError] = useState('')
    const {setActivity,setTrigerr} = useContext(AppContext)

    const handleInputChangeDescribtion = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    
    }
    const handleInputChangePayer = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPayer(event.target.value)
    
    }
    const handleInputChangeAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(event.target.value)
    }

    const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }
    
    const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(event.target.value)
    }
    const navigate = useNavigate()

    const Tdata = {title,email,description,payerName,amountToBePaid}
    

    

    async function handleSubmit(e: any) {
        e.preventDefault();
        try{
            axios.defaults.withCredentials = true;
            const response = await axios.post(window.API_URL+`/saveTransaction`, {Tdata});
            if(response.status === 200){
                setActivity('You created a transaction! ')
                console.log("successfully saved Transaction --- ");
                setTimeout(() => {
                    setTrigerr(true);
                    console.log('trigger set off now')
                  },1000 )
              //toast('Succefully saved Transaction');
              navigate('pendingT')
            }
      

        } catch{
            console.log('failed to post request')
        }
        
       
        
        
            
           

        
       


    }

   


    return (
       <div className="authForm-container">
        
            <form className="NewTransActionForm" onSubmit={handleSubmit}>
                <label htmlFor="title"> Title </label>
                <input onChange={handleInputChangeName} value={title} name="title" id="title"  type="text"/>
                <label htmlFor="description">Description</label>
                <input onChange={handleInputChangeDescribtion} value={description} name="description" id="description"  type="text"/>
                <label htmlFor="payerName">Payer's Name</label>
                <input onChange={handleInputChangePayer} value={payerName} name="payerName" id="payerName"  type="text"/>
                <label htmlFor="email">Payer's Email</label>
                <input onChange={handleInputChangeEmail} value={email} type="email"  id="email" name="email"/>
                <label htmlFor="amountToBePaid">Amount To Be Paid</label>
                <input onChange={handleInputChangeAmount} value={amountToBePaid} type="text"  id="amount" name="amount"/>
                <p className="passerror">{error}</p>
                <button className="createTrans" type="submit">Create</button>
                <Link to='activityLog'><button className="createTransC" >Cancel</button></Link>
            </form>
           
       </div>
    )
}
export default NewTransaction