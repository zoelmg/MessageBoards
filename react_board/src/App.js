import React from 'react';
import Messages from './home/Messages';
import './App.css'; 

//our overall-message board 
function App() {
  return (
    <div className="app-container">
      <div className="title-container">
      <img src={process.env.PUBLIC_URL + '/icon.png'} alt="Icon" className="app-icon" />
        <h1 className="app-title">Community Message Board</h1>
        <img src={process.env.PUBLIC_URL + '/icon.png'} alt="Icon" className="app-icon" />
      </div>
      <small>welcome! see messages left by others!</small>
      <small> a message cannot be empty or longer than 128 characters :P</small>
      <Messages />
    </div>
  );
}

export default App;