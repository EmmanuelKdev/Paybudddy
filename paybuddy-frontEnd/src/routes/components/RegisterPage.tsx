import React, { useState} from "react"
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import './ComponentCss.css'





export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [name, setName] = useState('');
    const [error,setError] = useState('')

    const handleInputChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    }
    const handleInputChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPass(event.target.value)
    }
    const handleInputChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
    const navigate = useNavigate()
    

    

    async function handleSubmit(e: any) {
        e.preventDefault();
        if(password.length >= 8){
            try {

                await axios.post(`/api/auth/register`, {name, email, password})
                .then(response => console.log(response.data)
                
                ).catch(err=> console.log(err))
                navigate('/')
   
           } catch {
               console.log('failed registration')
           }


            

        } 
        setError('Password must be at least 8 characters long.');
       
        
        
            
           

        
       


    }

   


    return (
       <div className="authForm-containerL">
        
            <form className="loginform" onSubmit={handleSubmit}>
                <label htmlFor=""> Full Name </label>
                <input onChange={handleInputChangeName} value={name} name="name" id="name" placeholder="full name" type="text"/>
                <label htmlFor="email">Email</label>
                <input onChange={handleInputChangeEmail} value={email} type="email" placeholder="youremail@example.com" id="email" name="email"/>
                <label htmlFor="password">Password</label>
                <input onChange={handleInputChangePassword} value={password} type="password" placeholder="******" id="password" name="password"/>
                <p className="passerror">{error}</p>
                <button className="logsubmit" type="submit">Sign Up</button>
                <br></br>
                <Link to="/"><button className="regBtn" >Already have an account? Login here</button></Link>
            </form>
           
       </div>
    )
}