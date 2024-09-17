import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import videoSrc from '../../assets/3-d car.mp4'; // Import the video if using a bundler

const Home = () => {

  const navigate = useNavigate();

  return (
    <>
    <video className="background-video" autoPlay muted loop playsInline>
        <source src={videoSrc} type='video/mp4' /> {/* Use path from import */}
        Your browser does not support the video tag.
      </video>
    <div className='header'>
      <div className="header-contents">
        <h2>Talk to VehixBot</h2>
        <p>Get your custom car exactly how you want it.</p>
        <button onClick={()=>navigate('/chat')}>Chat</button>
      </div>
    </div>
    </>
  );  
}

export default Home;
