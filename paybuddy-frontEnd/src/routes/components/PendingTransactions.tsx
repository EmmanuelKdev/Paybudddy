import './ComponentCss.css'
import { AppContext } from '../App'
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';


function PendingTransactions() {
  
  const { logInState, setTransdata, gofetch, setGofetch , setActivity } = useContext(AppContext);
  const [pendingTrans, setPendingTrans] = useState<any>([]);
  const [UserData, setUserData] = useState<any>([]);
  const [SavedItems, setSavedItems] = useState<any>([]);
  const [SavedItemsPenFilter, setPendFilter] = useState<any>([]);
  const [bodyData, setBodyData] = useState<any[]>([]);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null); // To manage which dropdown is active
  const [activeDropdownCom, setActiveDropdownCom] = useState<string | null>(null); // To manage which Complete Transaction section is active
  const [verificationCode, setCode] = useState('');
  const [statuss, setStatus] = useState('Complete');

  const showMenue = (
    <svg className='dropdownIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z" />
    </svg>
  );
  
  const hideMenue = (
    <svg className='dropdownIcon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
      <path d="M201.4 137.4c12.5-12.5 32.8-12.5 45.3 0l160 160c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L224 205.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160z" />
    </svg>
  );

  const handleInputChangeCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  useEffect(() => {
    if (gofetch === 'getting Pending' || logInState) {
      console.log(gofetch);
      getData();
    }
    
  }, [gofetch]);

  const toggleDisplay = (id: string) => {
    setActiveDropdown(prevId => (prevId === id ? null : id)); // Toggle dropdown visibility
  };

  const toggleDisplayCom = (id: string) => {
    setActiveDropdownCom(prevId => (prevId === id ? null : id)); // Toggle Complete Transaction visibility
  };

  const getData = async () => {
    
    const data = await axios.get(`${window.API_URL}/getTempData2`);
    console.log(data);

    const userData = data.data;
    const savedItems = data.data.userItems.savedItems;
    const bodyData2 = data.data.userItems.savedItems;

    setTransdata(data);
    setUserData(userData);
    setSavedItems(savedItems);
    setBodyData(bodyData2);
    setGofetch('');
  };

  useEffect(() => {
    if (bodyData.length > 0) {
      const pendingItems = bodyData.filter(item => item.status === 'Pending');
      setPendingTrans(pendingItems);
    }
  }, [bodyData]);

  const handlesubmit = async (Newstatus: any, Tid: any) => {
    try {
      const response = await axios.post(`${window.API_URL}/updatestatus`, { Newstatus, Tid });
      if (response.status === 200) {
        setActivity(`Transaction : ${Tid} is now Complete!`)
        console.log('Update successful');
        //toast('Transaction Complete')
        setGofetch('getting Pending');
      }
    } catch (error) {
      console.log('Failed to submit request');
    }
  };
  const handleDelete = async (Tid: any) => {
    try{
      const response = await axios.post(`${window.API_URL}/deletFav`, { Tid });
      if(response.status === 200){
        setActivity(`You Deleted transaction ${Tid}`)
        setGofetch('getting Pending');
        //toast('Transaction Deleted!');

      }


    } catch (error) {
      console.log('Failed to submit request');
    }
  }

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
                      <input onChange={handleInputChangeCode} className='CodeInputbox' type='number' placeholder='type transaction code here' />
                      <button onClick={() => handlesubmit(statuss, verificationCode)} className='confirmbtn'>Confirm</button>
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