/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import './ComponentCss.css';
import { AppContext } from '../App';
import { useContext, useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../redux/actions'; // Import the async thunk
import { AppDispatch, RootState } from '../redux/reduxStore'; // Import the types

const SEND_VERIFICATION_CODE = gql`
  mutation SendVerificationCode($tid: String!) {
    sendverificationCode(tid: $tid)
  }
`;

const DELETE_FAV_STATION = gql`
  mutation DeleteFavStation($tid: String!) {
    deleteTransactation(tid: $tid)
  }
`;
// Define the GraphQL query
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

function PendingTransactions() {
  const { gofetch, setGofetch, setActivity } = useContext(AppContext);
  const [pendingTrans, setPendingTrans] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // To manage which dropdown is active
  const [activeDropdownCom, setActiveDropdownCom] = useState<string | null>(null); // To manage which Complete Transaction section is active
  
  // Transaction data transported from redux
  const data = useSelector((state: RootState) => state.data.data);
  const dispatch = useDispatch<AppDispatch>();
  console.log('Data from Redux', data);

  const { loading, error, data: fetchedData, refetch } = useQuery(GET_TEMP_DATA_TWO);

  useEffect(() => {
    if (fetchedData) {
      dispatch(fetchData());
    }
  }, [fetchedData, dispatch]);

  const [sendVerificationCode] = useMutation(SEND_VERIFICATION_CODE, {
    onCompleted: () => {
      setActivity("Verification code sent successfully.");
    },
    onError: (error) => {
      console.error("Failed to send verification code:", error);
    },
  });

  const [deleteFavStation] = useMutation(DELETE_FAV_STATION, {
    onCompleted: () => {
      setActivity('Transaction deleted successfully.');
      refetch(); // Refetch data after deletion
    },
    onError: (error) => {
      console.error("Error deleting transaction:", error);
    },
  });

  const handleSubmit = async (tid: any) => {
    if (tid !== null) {
      try {
        await sendVerificationCode({ variables: { tid } });
      } catch (error) {
        console.error('Failed to send verification code:', error);
      }
    }
  };

  const handleDelete = async (Tid: string) => {
    try {
      await deleteFavStation({ variables: { tid: Tid } });
      setTimeout(() => {
        setGofetch('fetch');
      }, 1000); // Delay of 1000 milliseconds (1 second)
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  useEffect(() => {
    if (data) {
      const pendingItems = data.filter((item: { status: string }) => item.status === 'Pending');
      setPendingTrans(pendingItems);
    }
  }, [data]);

  const showMenue = 'Show Menu';
  const hideMenue = 'Hide Menu';

  const toggleDisplay = (id: string) => {
    setActiveDropdown(prevId => (prevId === id ? null : id)); // Toggle dropdown visibility
  };

  const toggleDisplayCom = (id: string) => {
    setActiveDropdownCom(prevId => (prevId === id ? null : id)); // Toggle Complete Transaction visibility
  };

  return (
    <div className='pendingContainer'>
      <div className='PendingTittle'>
        <p>Pending Transactions</p>
      </div>
      <div className='Itemscontainer'>
        <div className='ItemBox'>
          {pendingTrans.map((item: any) => (
            <div className='itemCoverbox' key={item.Timedate}>
              <div className='ItemDisplay'>
                <p className='itemName'><svg className='pointerIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128L0 384c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-256c0-35.3-28.7-64-64-64L64 64zm48 160l160 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-160 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zM96 336c0-8.8 7.2-16 16-16l352 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-352 0c-8.8 0-16-7.2-16-16zM376 160l80 0c13.3 0 24 10.7 24 24l0 48c0 13.3-10.7 24-24 24l-80 0c-13.3 0-24-10.7-24-24l0-48c0-13.3 10.7-24 24-24z"/></svg>{item.Tname}</p>
                <p className='status'>{item.status}</p>
              </div>
              <div className='CodeID'>
                <div>
                  <p className='codenum'>{item.Timedate}</p>
                  <svg className='pointerIcon' onClick={() => handleDelete(item.T_id)} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/>
                  </svg>
                </div>
                <li className='dropdowbbtn' onClick={() => toggleDisplay(item.Timedate)}>
                  {activeDropdown === item.Timedate ? hideMenue : showMenue}
                </li>
              </div>
              {activeDropdown === item.Timedate && (
                <div className='moreInfo'>
                  <p>Name: {item.Tpayername}</p>
                  <p>Payers Email: {item.Temail}</p>
                  <div>
                    <p>Description</p>
                    <p>{item.Tdescription}</p>
                  </div>
                  <div className='amount'>
                    <p>{item.Tamount} euros</p>
                  </div>
                  <div className='completeTransbtnCon'>
                    <button onClick={() => toggleDisplayCom(item.Timedate)} className='completeTransbtn'>
                      {activeDropdownCom === item.Timedate ? 'Cancel' : 'Complete Transaction'}
                    </button>
                  </div>
                  {activeDropdownCom === item.Timedate && (
                    <div className='codeInput'>
                     
                      <button onClick={() => handleSubmit(item.T_id)} className='confirmbtn'>Send Code</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PendingTransactions;