import React, { useEffect, useState } from 'react';
import './App.css';
import logo from './logo.svg';

function App() {
  const [backendData, setBackendData] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(res => res.json())
      .then(data => setBackendData(data.message))
      .catch(err => {
        console.error('Error fetching:', err);
        setBackendData('Failed to fetch data');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>{backendData}</p>
      </header>
    </div>
  );
}

export default App;
