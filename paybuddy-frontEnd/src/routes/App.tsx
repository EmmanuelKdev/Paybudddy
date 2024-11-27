/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import React, { Suspense, lazy } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useDispatch } from 'react-redux';
import { setData } from './redux/slice';

import './App.css';

import Navbar from './components/Navbar';
import ActivityLog from './components/ActivityLog';
import PendingTransactions from './components/PendingTransactions';
import CompletedTransactions from './components/CompletedTransactions';
import NewTransaction from './components/NewTransaction';
import UserCodeEntry from './components/UserCodeEntry';

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

// AppContextType

export const AppContext = React.createContext<any>(null);

// Interface for the data returned from the GraphQL query
interface TransItem {
  T_id: string;
  Tname: string;
  Tpayername: string;
  Temail: string;
  Tamount: number;
  Tdescription: string;
  status: string;
  Timedate: string;
}

const GET_USER_BY_SESSION_TOKEN = gql`
  query GetUserBySessionToken {
    getUserBySessionToken {
      _id
      name
      email
      
    }
  }
`;
// Fetch transaction datquery
const GET_TEMP_DATA_TWO = gql`
  query GetTempDataTwo {
    getTempDataTwo {
      items {
        T_id
        Tname
        Tpayername
        Temail
        Tamount
        Tdescription
        status
        Timedate
      }
    }
  }
`;


const LOG_ACTIVITY = gql`
  mutation LogActivity($activityWatcher: String!, $currentTimestamp: ID!) {
    addActivity(activityWatcher: $activityWatcher, currentTimestamp: $currentTimestamp)
  }
`;

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
  const [gofetch, setGofetch] = useState('');
  const [transactionData, setTransdata] = useState<TransItem[]>([]);
  const [activityWatcher, setActivity] = useState('');
  const [activityTrigger, setTrigerr] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading: queryLoading } = useQuery(GET_USER_BY_SESSION_TOKEN, {
    onCompleted: (data) => {
      if (data.getUserBySessionToken) {
        setLogInState(true);
        setTrigerr(true);
        console.log('User Confirmed');
      } else {
        setLogInState(false);
      }
      setLoading(false);
    },
    onError: (error) => {
      setLogInState(false);
      console.error('Verification failed:', error);
      setLoading(false);
    },
  });
  //console.log('Data:', data, 'Error:', error);

   // transaction data fetch
   const {  refetch } = useQuery(GET_TEMP_DATA_TWO, {
    // Skip the query if both logInState and gofetch are false
    onCompleted: (data) => {
      const savedItems = data.getTempDataTwo.items;
      console.log('Pending Transactions:', savedItems);
      dispatch(setData(savedItems));
      setGofetch('');
    },
    onError: (error) => {
      console.error("Error fetching data:", error);
    },
  });

  useEffect(() => {
    if (logInState || gofetch === 'fetch') {
      setTimeout(()=> {
        console.log("attempting to fetch transaction data ")
        refetch();

      }, 1000)
      
    }
  }, [logInState, gofetch, refetch]);
  

  const [logActivity] = useMutation(LOG_ACTIVITY);
// saves user activity to database
  useEffect(() => {
    const logger = async () => {
      const currentTimestamp: number = Date.now();
      try {
        const response = await logActivity({
          variables: { activityWatcher, currentTimestamp },
        });
        if (response.data.addActivity) {
          toast('Activity successfully logged');
          setGofetch('fetch')
        } else {
          console.log('Post request unsuccessful');
        }
      } catch (error) {
        console.error('Failed to log activity:', error);
      }
    };

    if (activityWatcher !== '') {
      toast(`${activityWatcher}`);
      setActivity('');
      logger();
    }
  }, [activityWatcher, activityTrigger, logActivity]);

  useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in milliseconds
      once: true, // Whether animation should happen only once - while scrolling down
    });
  }, []);

// Switches between login and home page
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
 
 




  if (loading || queryLoading) {
    return <Loading />;
  }

  return (
    <Fragment>
      <AppContext.Provider
        value={{
          activityTrigger,
          setTrigerr,
          activityWatcher,
          setActivity,
          transactionData,
          setTransdata,
          gofetch,
          setGofetch,
          clickedpending,
          logInState,
          msg,
          setMsg,
          setLogInState,
          setPending,
          clickedComplete,
          setComplete,
          addTransaction,
          setTrans,
          profile,
          setProfile,
          popUp,
          setPopUp,
          popUpTwo,
          setPopUptwo,
        }}
      >
        <Suspense fallback={<Loading />}>
          {logInState === false ? (
            <CanvaZero trigger={popUpTwo}>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/newpass/:token" element={<NewPass />} />
                <Route path="/forgotpass" element={<Forgottpass />} />
                <Route path="/usercodeentry/:token" element={<UserCodeEntry />} />
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