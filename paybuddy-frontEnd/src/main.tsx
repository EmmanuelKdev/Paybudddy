import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import ApolloClientSetup from './ApolloClientSetUp'

window.API_URL="/api/graphql"



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> 
      <ApolloClientSetup>
      
        <App />

      </ApolloClientSetup>
       
    </Router>

   
  </React.StrictMode>,
)
