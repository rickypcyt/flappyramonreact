import React, { useState, useEffect } from 'react';
import './App.css';

// Importa tus imágenes aquí
import backgroundImage from './Images/bgx4.png'; // Reemplaza 'background.jpg' con la ruta de tu imagen de fondo
import baseImage from './Images/basex5.png'; // Reemplaza 'base.png' con la ruta de tu imagen base

function App() {
  // Estado para controlar la posición de la base
  const [basePosition, setBasePosition] = useState(0);

  // Función para actualizar la posición de la base en el eje x
  const updateBasePosition = () => {
    // Aumentamos la posición de la base en el eje x
    setBasePosition((prevPosition) => (prevPosition + 1) % (window.innerWidth + 100)); // Sumamos 100 para solapar las imágenes y evitar espacios en blanco
  };

  // Usamos useEffect para actualizar la posición de la base en el eje x cada cierto intervalo de tiempo
  useEffect(() => {
    const interval = setInterval(updateBasePosition, 10); // Puedes ajustar el intervalo según tus necesidades
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {/* Imagen de fondo */}
      <img src={backgroundImage} alt="Background" className="background" />

      {/* Imágenes de base */}
      <div className="base-container">
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{ left: `${basePosition}px`, bottom: '0' }} // Ajusta la posición de la base según el estado basePosition
        />
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{ left: `${basePosition - window.innerWidth - 100}px`, bottom: '0' }} // La segunda imagen se superpone a la primera para crear un efecto de bucle
        />
      </div>
    </div>
  );
}

export default App;
