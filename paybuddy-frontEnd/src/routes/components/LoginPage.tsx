import React, { useContext, useState} from "react";
import './ComponentCss.css'

import axios from "axios";
import { Link} from "react-router-dom";
import { AppContext } from "../App";

 








export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const {setLogInState,setTrigerr} = useContext(AppContext)
    
    
  
    

    // Images 
   


    const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }
    const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value)
    }

    axios.defaults.withCredentials = true;
    async function handleSubmit(e: any) {
        e.preventDefault();
        
        console.log("button clicked")
        console.log(email)
        try {
            const response = await axios.post(`/api/auth/login`, {email, password});
            if (response.status === 200){
                setLogInState(true)
                setTrigerr(true)
                
                
                console.log("Login succesfull")
            }
            else {
                console.log("failed post request - Log in unsuccesfull")
            }



        } catch {
            console.log('failed log in')
        }
       


    }
    

    return (
       
        <div className="authForm-containerL"> 
         
            
                <form className="loginform" onSubmit={handleSubmit}  >
                    <div className="heading">
                    <p>Welcome to the App On Rails</p>
                    </div>
                    <label htmlFor="email">Email</label>
                    <input onChange={handleInputChangeEmail} value={email} type="email" placeholder="youremail@example.com" id="email" name="email"/>
                    <label htmlFor="password">Password</label>
                    <input onChange={handleInputChangePassword} value={password} type="password" placeholder="******" id="password" name="password"/>
                    <br></br>
                    <button className="logsubmit" type="submit">-Log In-</button>
                    <Link to='forgotpass'><p>Forgotten Password?</p></Link>
                    <Link to='register'><button className="regBtn" >Don't have an account? Register here</button></Link>
                    
                </form>
        </div> 
           
       
    )
} 