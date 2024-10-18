import React, { useState} from "react";
import './ComponentCss.css';
import axios from "axios";
import { Link } from "react-router-dom";



export function Forgottpass(){
    const [email, setEmail] = useState('');
    


    const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }

    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            const response = await axios.post(window.API_URL+`/forgotpass`, {email});
            if (response.status === 200){
                
                window.alert("Please Check your email for reset password link")
                
            }
            else {
                console.log("failed post request")
            }



        } catch {
            console.log('failed log in')
        }
       


    }

    return (
        <>
           <div className="authForm-containerL"> 
             
             <form className="loginform" onSubmit={handleSubmit}>
               
                <label htmlFor="email">Email</label>
                <input onChange={handleInputChangeEmail} value={email} type="email" placeholder="youremail@example.com" id="email" name="email"/>
                <button className="logsubmit" type="submit">Reset</button>
                <br></br>
                <Link to="/"><button className="regBtn">Cancel</button></Link>
             </form>
           
           </div>
        </>
    )
}