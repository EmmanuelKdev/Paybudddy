import { useContext, useState, useEffect } from 'react';
import './ComponentCss.css';
import { AppContext } from '../App';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import Carousel styles

ChartJS.register(ArcElement, Tooltip, Legend);

function Updates() {
  const { logInState, gofetch } = useContext(AppContext);
  const [completCont, setComCount] = useState<number>();
  const [pendingCount, setPenCount] = useState<number>();
  const [chartData, setData] = useState<any[]>([]); // Changed to any[] to ensure proper array handling
  const [NewsData, setNewsData] = useState<any[]>([]);

  // Fetch API news data
  useEffect(() => {
    const fetchApiNewsData = async () => {
      try {
        const response: any = await axios.get(`${window.API_URL}/newsApi`);
        const filteredData = response.data[0].apiData.items;
        setNewsData(filteredData);
      } catch (error) {
        console.log('Failed to get news API data');
      }
    };

    fetchApiNewsData();
  }, []);

  // Fetch chart data
  const getData = async () => {
    const data = await axios.get(`${window.API_URL}/getTempData2`);
    const bodyData2 = data.data.userItems.savedItems;
    setData(bodyData2);
  };

  useEffect(() => {
    if (gofetch === 'getting Pending' || logInState) {
      setTimeout(() => {
        getData();
      }, 2000); // Run after 2 seconds
    }
  }, [gofetch, logInState]);

  useEffect(() => {
    if (chartData.length > 0) {
      const pendingC = chartData.filter((item: any) => item.status === 'Pending').length;
      setPenCount(pendingC);
    }
  }, [chartData]);

  useEffect(() => {
    if (chartData.length > 0) {
      const comCount = chartData.filter((item: any) => item.status === 'Complete').length;
      setComCount(comCount);
    }
  }, [chartData]);

  // Prepare the data for the chart
  const data = {
    labels: ['Complete', 'Pending'],
    datasets: [
      {
        label: 'Your Transactions',
        data: [completCont ?? 0, pendingCount ?? 0], // Ensure no undefined values
        backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        hoverOffset: 4,
      },
    ],
  };

  // Check if the chart has data
  const hasData = chartData && chartData.length > 0 && completCont !== undefined && pendingCount !== undefined;

  return (
    <div className='UpdatesContainer2' data-aos="fade-left">
      <div className='analytics'>
        <h4>Analytics</h4>
        <div className='chartbox'>
          {hasData ? (
            <Doughnut data={data} />
          ) : (
            <div className='fallback-message'>
              <p>No data available for display.</p>
            </div>
          )}
        </div>
      </div>
      <div className="NewsUpdate">
        <h4>News Update</h4>
        <Carousel
          showArrows={true}
          autoPlay={true}
          infiniteLoop={true}
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          interval={5000}
        >
          {NewsData.map((item) => (
            <div className='Newsbox' key={item.timestamp}>
              <img className='NewsImage' src={item.images?.thumbnailProxied} alt={item.title} />
              <div className="legend">
                <h3>{item.title}</h3>
                <p>{item.snippet}</p>
                <a href={item.newsUrl} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                  Read more
                </a>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

export default Updates;
