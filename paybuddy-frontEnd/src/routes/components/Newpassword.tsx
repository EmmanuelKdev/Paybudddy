import React, { useState} from "react"
import './ComponentCss.css';
import axios from "axios";
import {  useNavigate, useParams } from "react-router-dom";


export function NewPass(){
    const [password, setPass] = useState('');
    const navigate = useNavigate()
    const { token } = useParams()

    


    const handleInputChangePass = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value)
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        console.log(token)
        
        try {
            // this should chnaged to Vm Ip address fro the backend
            const response = await axios.post(`http://localhost:3001/newpassword/${token}`, {password}); 
            if(response.status === 200){
                window.alert("password changed")
                navigate('/')
            } else {
                console.log("was not succesfull")
            }
           
            



        } catch {
            console.log('failed submission')
        }
       


    }

    return (
        <>
           <div className="authForm-containerL"> 
             
             <form className="loginform" onSubmit={handleSubmit}>
                <label htmlFor="password"> Create new password </label>
                <input onChange={handleInputChangePass} value={password} type="password" placeholder="******" id="password" name="password"/>
                <button className="logsubmit" type="submit">Create New Password</button>
             </form>
           
           </div>
        </>
    )
}