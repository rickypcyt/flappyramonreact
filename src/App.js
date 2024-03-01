import React, { useState, useEffect } from 'react';
import './App.css';

import backgroundImage from './Images/bgx4.png';
import baseImage from './Images/basex5.png';
import birdImage from './Images/ramos/ramon1.png'; // Agrega la ruta de la imagen del pájaro

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(250); // Posición inicial del pájaro
  const [birdVelocity, setBirdVelocity] = useState(0); // Velocidad inicial del pájaro

  const handleJump = () => {
    setBirdVelocity(-8); // Cambia la velocidad hacia arriba cuando el pájaro salta
  };

  useEffect(() => {
    const birdInterval = setInterval(() => {
      setBirdPosition((prevPosition) => prevPosition + birdVelocity); // Actualiza la posición del pájaro con la velocidad
      setBirdVelocity((prevVelocity) => prevVelocity + 0.5); // Aumenta la velocidad para simular la gravedad hacia abajo
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
  }, [birdVelocity]);

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
