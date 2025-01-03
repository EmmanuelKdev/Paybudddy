/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './ComponentCss.css';
import { AppContext } from '../App';
import { useContext, useState, useEffect } from 'react';
import { gql, useMutation,  useQuery } from '@apollo/client';

const GET_ALL_ACTIVITY = gql`
  query getAllActivity {
    getAllActivity {
      id
      msg
    }
  }
`;

const DELETE_ALL_ACTIVITIES = gql`
  mutation DeleteAllActivities {
    deleteAllActivity
  }
`;

const DELETE_ONE_ACTIVITY = gql`
  mutation DeleteOneActivity($tid: ID!) {
    deleteOneActivity(tid: $tid)
  }
`;

function ActivityLog() {
  const { activityTrigger, setTrigerr} = useContext(AppContext);
  const [activityData, setData] = useState<any[]>([]); // Initialize as an empty array
  const [timeDifference, setTimeDifference] = useState<{ [key: string]: string }>({}); // Use an object to store time differences for each timestamp
 

  const { loading, error, data: queryData, refetch } = useQuery(GET_ALL_ACTIVITY, {
    skip: !activityTrigger, // Skip the initial query if activityTrigger is false
  });

  useEffect(() => {
    if (activityTrigger) {
      setTimeout(() => {
        refetch()
          .then(({ data }) => {
            // sorting Data
            const sortedData = [...data.getAllActivity].sort((a, b) => parseInt(b.id) - parseInt(a.id));
            setData(sortedData);
            console.log('Activity data fetched:', sortedData);
            setTrigerr(false); // reset trigger after fetching
          })
          .catch((error) => {
            console.error("Error fetching activity data:", error);
          });
      }, 10);
    }
  }, [activityTrigger, refetch, setTrigerr]);

  const [deleteAllActivities] = useMutation(DELETE_ALL_ACTIVITIES, {
    onCompleted: () => {
      setTimeout(() => {
        setTrigerr(true);
        refetch();
      }, 300);
    },
    onError: (error) => {
      console.error("Error deleting all activities:", error);
    },
  });

  const [deleteOneActivity] = useMutation(DELETE_ONE_ACTIVITY, {
    onCompleted: () => {
      setTimeout(() => {
        setTrigerr(true);
        refetch();
      }, 1000);
    },
    onError: (error) => {
      console.error("Error deleting activity:", error);
    },
  });

  // Function that handles Delete all activities
  const handleDeleteAll = async () => {
    try {
      await deleteAllActivities();
    } catch (error) {
      console.log(`${error} : unable to delete all activity`);
    }
  };

  const handleDeleteSingle = async (tid: any) => {
    try {
      await deleteOneActivity({ variables: { tid } });
    } catch (error) {
      console.log(`${error} : unable to delete activity`);
    }
  };

  // Function to calculate time difference
  const calcOp = (time: number) => {
    const currentTime = new Date().getTime(); // Get the current time in milliseconds
    const TheDifference = currentTime - time; // Calculate the time difference

    // Convert milliseconds to a readable format
    const seconds = Math.floor(TheDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day(s) ago`;
    if (hours > 0) return `${hours} hour(s) ago`;
    if (minutes > 0) return `${minutes} minute(s) ago`;
    return `${seconds} second(s) ago`;
  };

  // Function to handle hover event and set time difference
  const calculateTime = (stamp: number) => {
    const timeDiff = calcOp(stamp); // Calculate the time difference
    setTimeDifference((prev) => ({ ...prev, [stamp]: timeDiff })); // Update the time difference for the specific timestamp
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='ActivityLogContainer' data-aos="fade-down">
      <p>Your Activity</p>
      <div className='ActivityCon'>
        {activityData.length === 0 ? (
          <p>No Activities....Loading...</p>
        ) : (
          activityData.map((item: any) => (
            <div className='activebox' key={item.id}>
              <div
                className='activeMsg'
                onMouseEnter={() => calculateTime(parseInt(item.id))}
              >
                <li>
                  <svg className='pointerIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M278.5 215.6L23 471c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l74.8-74.8c7.4 4.6 15.3 8.2 23.8 10.5C200.3 452.8 270 454.5 338 409.4c12.2-8.1 5.8-25.4-8.8-25.4l-16.1 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l97.7-29.3c3.4-1 6.4-3.1 8.4-6.1c4.4-6.4 8.6-12.9 12.6-19.6c6.2-10.3-1.5-23-13.5-23l-38.6 0c-5.1 0-9.2-4.1-9.2-9.2c0-4.1 2.7-7.6 6.5-8.8l80.9-24.3c4.6-1.4 8.4-4.8 10.2-9.3C494.5 163 507.8 86.1 511.9 36.8c.8-9.9-3-19.6-10-26.6s-16.7-10.8-26.6-10C391.5 7 228.5 40.5 137.4 131.6C57.3 211.7 56.7 302.3 71.3 356.4c2.1 7.9 12 9.6 17.8 3.8L253.6 195.8c6.2-6.2 16.4-6.2 22.6 0c5.4 5.4 6.1 13.6 2.2 19.8z"/>
                  </svg>
                  {item.msg}
                </li>
                <svg className='pointerIcon2' onClick={() => { handleDeleteSingle(item.id) }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                </svg>
              </div>
              <div className='timecalc'>
                <p>{timeDifference[parseInt(item.id)] || 'Hover to see time'}</p>
              </div>
            </div>
          ))
        )}
        <button onClick={() => { handleDeleteAll() }}>Clear Activity</button>
      </div>
    </div>
  );
}

export default ActivityLog;