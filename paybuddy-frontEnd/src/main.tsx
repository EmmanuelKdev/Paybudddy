import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './routes/App'
import './index.css'
import { BrowserRouter as Router } from 'react-router-dom'
import client from './ApolloClientSetUp';
import { ApolloProvider } from '@apollo/client';
import  { ReduxProvider }  from './routes/redux/reduxStore'

window.API_URL="/api/graphql"



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router> 
      <ApolloProvider  client={client}>

        <ReduxProvider>

          <App />

        </ReduxProvider>
      
        

      </ApolloProvider >
       
    </Router>

   
  </React.StrictMode>,
)
