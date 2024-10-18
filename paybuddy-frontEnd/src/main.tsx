import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'







window.API_URL="/api"



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> 
    <App />
       
    </Router>

     

  
   
  </React.StrictMode>,
)
