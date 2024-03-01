import React, { useState, useEffect } from 'react';
import './App.css';

import backgroundImage from './Images/bgx4.png';
import baseImage from './Images/basex5.png';
import birdImage from './Images/ramos/ramon1.png'; // Agrega la ruta de la imagen del pájaro

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(250); // Posición inicial del pájaro
  const [gravity, setGravity] = useState(0); // Gravedad inicial

  const handleJump = () => {
    setGravity(-5); // Cambia la velocidad hacia arriba cuando el pájaro salta
  };

  useEffect(() => {
    const birdInterval = setInterval(() => {
      setBirdPosition((prevPosition) => prevPosition + gravity); // Actualiza la posición del pájaro con la gravedad
      setGravity((prevGravity) => prevGravity + 0.2); // Aumenta la gravedad para simular la caída
    }, 30);

    const baseInterval = setInterval(() => {
      setBasePosition((prevPosition) => (prevPosition + 1) % (window.innerWidth + 100));
    }, 10);

    const handleKeyDown = (e) => {
      if (e.keyCode === 32) {
        // KeyCode 32 para la barra espaciadora
        handleJump();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(birdInterval);
      clearInterval(baseInterval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gravity]);

  return (
    <div className="App">
      <img src={backgroundImage} alt="Background" className="background" />

      <div className="base-container">
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{ left: `${basePosition}px`, bottom: '0' }}
        />
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{ left: `${basePosition - window.innerWidth - 100}px`, bottom: '0' }}
        />
      </div>

      <img
        src={birdImage}
        alt="Bird"
        className="bird"
        style={{ left: '100px', bottom: `${birdPosition}px` }}
      />
    </div>
  );
}

export default App;
