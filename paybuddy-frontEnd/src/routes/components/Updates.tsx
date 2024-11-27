/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {  useState, useEffect } from 'react';
import './ComponentCss.css';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';


import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles
import { useSelector } from 'react-redux';

ChartJS.register(ArcElement, Tooltip, Legend);

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



function Updates() {
 
  const [completCount, setComCount] = useState<number>(0);
  const [pendingCount, setPenCount] = useState<number>(0);
  const [chartData, setData] = useState<TransItem[]>([]);
  const data = useSelector((state: any) => state.data.data);

 useEffect( ()=> {
  if(!data){
    console.log("Something wrong with chart data from redux")
  }
  setData(data)

 },[data])

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const pendingC = chartData.filter((item) => item.status === 'Pending').length;
      setPenCount(pendingC);
    }
  }, [chartData]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const comCount = chartData.filter((item) => item.status === 'Complete').length;
      setComCount(comCount);
    }
  }, [chartData]);

  // Prepare the data for the chart
  const dataForChart = {
    labels: ['Complete', 'Pending'],
    datasets: [
      {
        label: 'Your Transactions',
        data: [completCount, pendingCount], // Ensure no undefined values
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        hoverOffset: 4,
      },
    ],
  };

  // Check if the chart has data
  const hasData = chartData.length > 0 && completCount !== undefined && pendingCount !== undefined;

  return (
    <div className='UpdatesContainer2' data-aos="fade-left">
      <div className='analytics'>
        <h4>Analytics</h4>
        <div className='chartbox'>
          {hasData ? (
            <Doughnut data={dataForChart} />
          ) : (
            <div className='fallback-message'>
              <p>No data available for display.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Updates;