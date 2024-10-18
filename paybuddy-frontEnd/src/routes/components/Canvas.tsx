import './ComponentCss.css'


function Canvas(props: any) {

  return (props.trigger)? (
    <div className='appContainer'>
    
      
      {props.children}
    
      
        
       
    </div>
  ) : "";
}

export default Canvas