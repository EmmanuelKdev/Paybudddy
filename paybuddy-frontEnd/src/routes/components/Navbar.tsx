import './ComponentCss.css'
import { AppContext } from '../App'
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';



function Navbar() {
  const {setTrigerr, setLogInState,setGofetch} = useContext(AppContext);
  const navigate = useNavigate();

  let info = null

  axios.defaults.withCredentials = true;

  const handlePendingFetch = () => {
    setGofetch('getting Pending');
  }
  const handleCompleteFetch = () => {
    setGofetch('getting Complete');
  }
  const getActivelist = ()=> {

    setTimeout(() => {
      setTrigerr(true);
      console.log('trigger set off now')
    },1000 )
    
  }
  

  const handleButtonClick = async (type: 'pending' | 'complete'| 'home'| 'profile'| 'logOut') => {
     if (type === 'logOut'){
      try{
        const response = await axios.get(window.API_URL+`/logout`);
        if (response.status === 200) {
          setLogInState(false);
          navigate('/')
          
          console.log("Log out complete");
        } else {
          console.log("Problem with log out request:", response.statusText);
        }

      } catch{
        info = 'Failed to Log Out'
      }

    } 
  };


  return (
    <div className='Navbar' data-aos="fade-up">
     <Link to='activityLog'><p className='homelabel' onClick={()=>{getActivelist()}} ><svg className='icon4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>Home</p></Link>
     <div className='navbarcontent'>
        <Link to='Newtransaction'><div className='btnB'>
          <svg className='icon4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
          <p className='profiletext'>Add New</p>
        </div></Link>
        <Link to='pendingT'><div className='btnB' onClick={()=>{handlePendingFetch()}} >
          <svg className='icon6' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64V75c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437v11c-17.7 0-32 14.3-32 32s14.3 32 32 32H64 320h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V437c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1V64c17.7 0 32-14.3 32-32s-14.3-32-32-32H320 64 32zM96 75V64H288V75c0 19-5.6 37.4-16 53H112c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9H112z"/></svg>
          <p className='profiletext'>Pending Transactions</p>
        </div></Link>
        <Link to='CompletedT' ><div className='btnB' onClick={()=>{handleCompleteFetch()}}>
          <svg className='icon5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
          <p className='profiletext'>Completed Transactions</p></div>
        </Link>
        <Link to='profile' ><li className='btnB' ><svg className='icon7' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg><p className='profiletext'>Profile</p></li></Link>
        <li className='btnB' onClick={() => handleButtonClick('logOut')}><svg className='icon3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg><p className='profiletext'>Log Out</p></li>
     </div>
</div>
  )
}

export default Navbar