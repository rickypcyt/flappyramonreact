import React, { useState, useEffect } from "react";
import "./App.css";
import backgroundImage from "./Images/bgx4.png";
import baseImage from "./Images/basex5.png";
import birdImage from "./Images/ramos/ramon1.png";
import tubeImage from "./Images/pipes/pen2.png";

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(window.innerHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const gravity = -0.6;
  //const tubeWidth = 52;
  //const tubeHeight = 320;
  const tubeGap = 150;
  const tubeSpeed = 5;

  const [tubes, setTubes] = useState([]);

  useEffect(() => {
    const birdInterval = setInterval(() => {
      setBirdVelocity((prevVelocity) => prevVelocity + gravity);
      setBirdPosition((prevPosition) => prevPosition + birdVelocity);
    }, 30);

    const baseInterval = setInterval(() => {
      setBasePosition(
        (prevPosition) => (prevPosition + 1) % (window.innerWidth + 100)
      );
    }, 10);

    const tubeInterval = setInterval(() => {
      setTubes((prevTubes) => {
        const newTubes = prevTubes
          .map((tube) => ({
            ...tube,
            x: tube.x - tubeSpeed,
          }))
          .filter((tube) => tube.x > -tubeWidth); //Adjust filtering based on tube 

        if (
          newTubes.length === 0 ||
          window.innerWidth - newTubes[newTubes.length - 1].x >= tubeGap * 2
        ) {
          const minY = 50; // Ajusta esta posición según tu preferencia
          const maxY = window.innerHeight - tubeGap;
          const randomHeight = Math.floor(Math.random() * (maxY - minY)) + minY;
          const randomGap = Math.floor(Math.random() * 100) - 50; // Adjust gap variation
          //const randomY = Math.random() * (maxY - minY) + minY;
          newTubes.push({
            x: window.innerWidth,
            y: randomHeight + randomGap, // Adjust y position based on gap variation
            width: Math.floor(Math.random() * 50) + 30, // Adjust min/max width as needed
            height: Math.floor(Math.random() * 200) + 150, // Adjust min/max height as needed
          });
       }

        return newTubes;
      });
    }, 3000);

    const handleKeyDown = (e) => {
      if (e.keyCode === 32) {
        setBirdVelocity(10);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(birdInterval);
      clearInterval(baseInterval);
      clearInterval(tubeInterval);
      window.removeEventListener("keydown", handleKeyDown);
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
          style={{ left: `${basePosition}px`, bottom: "0" }}
        />
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{
            left: `${basePosition - window.innerWidth - 100}px`,
            bottom: "0",
          }}
        />
      </div>

      {tubes.map((tube, index) => (
        <div
          key={index}
          className="tube"
          style={{ position: "absolute", left: tube.x, bottom: 0 }}
        >
          <img
            className="tube-upper"
            src={tubeImage}
            alt="Tube"
            style={{
              width: tubeWidth,
              height: tubeHeight,
              bottom: window.innerHeight - tube.y - tubeHeight,
            }}
          />
          <img
            className="tube-lower"
            src={tubeImage}
            alt="Tube"
            style={{ width: tubeWidth, height: tubeHeight, bottom: tube.y }}
          />
        </div>
      ))}

      <img
        src={birdImage}
        alt="Bird"
        className="bird"
        style={{ left: "100px", bottom: `${birdPosition}px` }}
      />
    </div>
  );
}
export default App;
