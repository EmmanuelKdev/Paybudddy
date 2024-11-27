/* eslint-disable @typescript-eslint/no-explicit-any */
import './ComponentCss.css';
import profilepic from '/src/assets/profilepic.png';
import { useState, useEffect, useRef } from 'react';
import { gql, useQuery } from '@apollo/client';
import Dropdown from './Dropdown';

const GET_USER_BY_SESSION_TOKEN = gql`
  query GetUserBySessionToken {
    getUserBySessionToken {
      _id
      name
      email
    }
  }
`;

function Profile() {
  const [profileData, setProfileData] = useState<any>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const isMounted = useRef(true);

  const { loading: queryLoading, data, error } = useQuery(GET_USER_BY_SESSION_TOKEN);

  useEffect(() => {
    if (data && data.getUserBySessionToken && isMounted.current) {
      setProfileData(data.getUserBySessionToken);
      console.log('User data:', data.getUserBySessionToken);
    }
  }, [data]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  if (queryLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching user data: {error.message}</p>;

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  return (
    <div className='profileContainer' id='profileContainer'>
      <p>Profile</p>
      <div className='profilePic'>
        <img className='pic' src={profilepic} alt='profile' />
      </div>
      <p className='Name'>{profileData?.name}</p>
      <ul className='dataprofile'>
        <li onClick={() => toggleDropdown('details')}>
          <svg className='icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
          </svg>
          Details
          <Dropdown
            title="Details"
            isOpen={activeDropdown === 'details'}
            onClose={() => toggleDropdown('details')}
          >
            <li>Name: {profileData?.name}</li>
            <li>Email: {profileData?.email}</li>
          </Dropdown>
        </li>
        <li onClick={() => toggleDropdown('drafts')}>
          <svg className='icon2' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
            <path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z" />
          </svg>
          Drafts
          <Dropdown
            title="Drafts"
            isOpen={activeDropdown === 'drafts'}
            onClose={() => toggleDropdown('drafts')}
          >
            <li>Draft 1</li>
            <li>Draft 2</li>
            <li>Draft 3</li>
          </Dropdown>
        </li>
        <li>
          <svg className='icon3' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
          </svg>
          Delete Profile
        </li>
      </ul>
    </div>
  );
}

export default Profile;