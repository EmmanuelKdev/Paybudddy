import { Fragment, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { Suspense, lazy } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import './App.css';

import Navbar from './components/Navbar';
import ActivityLog from './components/ActivityLog';
import PendingTransactions from './components/PendingTransactions';
import CompletedTransactions from './components/CompletedTransactions';
import NewTransaction from './components/NewTransaction';

import Profile from './components/Profile';
import Updates from './components/Updates';
import CanvaZero from './components/CanvaZero';
import { Login } from './components/LoginPage';
import { Register } from './components/RegisterPage';
import { NewPass } from './components/Newpassword';
import { Forgottpass } from './components/ForgotPass';
import Loading from './components/Loading';
import AOS from 'aos';
import 'aos/dist/aos.css';



const Dashboard = lazy(() => import('./components/Canvas'));

export const AppContext = React.createContext<any>(null);

function App() {
  const [logInState, setLogInState] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [popUp, setPopUp] = useState(false);
  const [popUpTwo, setPopUptwo] = useState(true);
  const [clickedpending, setPending] = useState(false);
  const [clickedComplete, setComplete] = useState(false);
  const [profile, setProfile] = useState(false);
  const [addTransaction, setTrans] = useState(false);
  const [msg, setMsg] = React.useState<string>('');
  const [gofetch,setGofetch] = useState('')
  const [transactionData, setTransdata] = useState<any>([]);
  const [activityWatcher,setActivity] = useState('')
  const [activityTrigger,setTrigerr] = useState(false);
  const navigate = useNavigate();

  useEffect( () => {

    const logger = async () => {
      // This function posts activity data to the database together with a timestamp
      const currentTimestamp: number = Date.now()
      const response = await axios.post(`/api/logActivty`, {activityWatcher, currentTimestamp});

      if(response.status === 200){
        
        toast('Activity succefully logged')
        
      } else{
        console.log('Post  request unsuccefull')
      }

    }

    if(activityWatcher !== ''){
      toast(`${activityWatcher}`);
      setActivity('')
      logger()
      
    }

  },[activityWatcher,activityTrigger])

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

  
 
  useEffect(() => {
    const check = async () => {
      try {
        axios.defaults.withCredentials = true;
        const token = Cookies.get('PayBuddy-Auth');
        
        const response = await axios.post(`/api/verify`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setLogInState(true);
          
          setTrigerr(true)
          console.log('User Confirmed');
        } else {
          setLogInState(false);
        }
      } catch (error) {
        setLogInState(false);
        console.error('Verification failed:', error);
      } finally {
        setLoading(false);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (logInState === true) {
        console.log('Navigating to activityLog because logInState is true');
        setPopUp(true);
        setPopUptwo(false);
        
      } else if (logInState === false) {
        console.log('Navigating to login because logInState is false');
        setPopUp(false);
        setPopUptwo(true);
        
      }
    }
  }, [logInState, loading, navigate]);

  if (loading) {
    return <Loading />;
  }
  
  return (
    <Fragment>
      <AppContext.Provider value={{ activityTrigger, setTrigerr,activityWatcher, setActivity, transactionData,setTransdata,gofetch,setGofetch,clickedpending, logInState,msg, setMsg, setLogInState, setPending, clickedComplete, setComplete, addTransaction, setTrans, profile, setProfile, popUp, setPopUp, popUpTwo, setPopUptwo }}>
      <Suspense fallback={<Loading />}>
  {logInState === false ? (
    <CanvaZero trigger={popUpTwo}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/newpass" element={<NewPass />} />
        <Route path="/forgotpass" element={<Forgottpass />} />
        {/* Optionally add a fallback route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </CanvaZero>
  ) : (
    <Dashboard trigger={popUp}>
      <Navbar />
      <ToastContainer />
      <div className="componentArr">
        <div className="contentdisplay">
          <Routes>
            <Route path="/activityLog" element={<ActivityLog />} />
            <Route path="/pendingT" element={<PendingTransactions />} />
            <Route path="/completedT" element={<CompletedTransactions />} />
            <Route path="/newTransaction" element={<NewTransaction />} />
            <Route path="/profile" element={<Profile />} />
            {/* Optionally add a fallback route */}
            <Route path="*" element={<ActivityLog />} />
          </Routes>
        </div>
        <div className="updatescontainer">
          <Updates />
        </div>
      </div>
    </Dashboard>
  )}
</Suspense>
      </AppContext.Provider>
    </Fragment>
  );
}

export default App;
