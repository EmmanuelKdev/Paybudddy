import './ComponentCss.css'


function Display(props: any) {

  return (props.trigger)? (
    <div className='DissplayContainer'>
    
      
      {props.children}
    
      
        
       
    </div>
  ) : "";
}

export default Display