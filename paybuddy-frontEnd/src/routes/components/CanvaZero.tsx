import './ComponentCss.css';

import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import carousel styles
import banner from '/src/assets/low-poly-grid-haikei2.svg'

function CanvaZero(props: any) {
  return (props.trigger)? (
    <div className='mainFormContainer' data-aos="fade-up">
         <div className="carasel">
          <img src={banner} className='intro' alt='intro'/>
          <section>
            <div className='TitleContent'>
              <h2 data-aos="fade-right">APP ON RAILS</h2>
              <div className='para' data-aos="fade-left">
                <p> Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores earum velit debitis quo quam odio laudantium pariatur quas
                   ratione repellat nesciunt fuga autem accusantium nisi accusamus ducimus, aspernatur facere reiciendis.</p>
              </div>
            </div>
          </section>
           
         
            
            
        </div>
        <div className='innerContainer' data-aos="fade-up">
         {props.children}

        </div>
        

    </div>
  ) : "";
}

export default CanvaZero