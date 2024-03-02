import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import backgroundImage from './Images/bgx4.png';
import baseImage from './Images/basex5.png';
import birdImage from './Images/ramos/ramon1.png'; // Agrega la ruta de la imagen del pájaro

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(250); // Posición inicial del pájaro
  const [birdVelocity, setBirdVelocity] = useState(0); // Velocidad inicial del pájaro
  const [lastFrameTime, setLastFrameTime] = useState(0);
  const birdRef = useRef(null);
  const gravity = 0.0029; // Fuerza de gravedad hacia abajo (ajustado)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.keyCode === 32) {
        // KeyCode 32 para la barra espaciadora
        setBirdVelocity(-0.3); // Salto hacia arriba (ajustado)
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const animate = (timestamp) => {
      const deltaTime = timestamp - lastFrameTime;
      setLastFrameTime(timestamp);
      
      setBirdVelocity((prevVelocity) => prevVelocity + gravity * deltaTime); // Aumenta la velocidad del pájaro debido a la gravedad
      setBirdPosition((prevPosition) => prevPosition + birdVelocity * deltaTime); // Actualiza la posición del pájaro con la velocidad
      if (birdRef.current) {
        birdRef.current.style.transform = `translateY(${birdPosition}px)`;
      }
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const baseInterval = setInterval(() => {
      setBasePosition((prevPosition) => (prevPosition + 1) % (window.innerWidth + 100));
    }, 10);

    return () => {
      clearInterval(baseInterval);
    };
  }, [birdPosition, birdVelocity, lastFrameTime]);

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
        ref={birdRef}
        src={birdImage}
        alt="Bird"
        className="bird"
        style={{ left: '100px', bottom: '0', position: 'absolute' }}
      />
    </div>
  );
}

export default App;
