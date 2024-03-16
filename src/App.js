import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import backgroundImage from "./Images/bgx4.png";
import baseImage from "./Images/basex5.png";
import birdImage from "./Images/ramos/ramon1.png";
import tubeImage from "./Images/pipes/pen2.png";

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(window.innerHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const gravity = -0.25;
  const tubeWidth = 52;
  const tubeHeight = 320;
  const tubeGap = 500;
  const tubeSpeed = 5;

  const [tubes, setTubes] = useState([]);

  const animateRef = useRef(null);

  useEffect(() => {
    const animate = () => {
      setBirdVelocity((prevVelocity) => prevVelocity + gravity);
      setBirdPosition((prevPosition) => prevPosition + birdVelocity);
      setBasePosition(
        (prevPosition) => (prevPosition + 1) % (window.innerWidth + 100)
      );

      setTubes((prevTubes) => {
        const newTubes = prevTubes
          .map((tube) => ({
            ...tube,
            x: tube.x - tubeSpeed,
          }))
          .filter((tube) => tube.x > -tubeWidth);

        if (
          newTubes.length === 0 ||
          window.innerWidth - newTubes[newTubes.length - 1].x >= tubeGap
        ) {
          const minY = window.innerHeight * -0.01;
          const maxY = window.innerHeight * -0.15;

          const randomY = Math.random() * (maxY - minY) + minY;
          newTubes.push({
            x: window.innerWidth,
            yUpper: randomY,
            yLower: randomY - 10,
          });
        }

        return newTubes;
      });

      animateRef.current = requestAnimationFrame(animate);
    };

    animateRef.current = requestAnimationFrame(animate);

    const handleKeyDown = (e) => {
      if (e.keyCode === 32) {
        setBirdVelocity(7);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(animateRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [birdVelocity]);

  return (
    <div className="App">
      <img src={backgroundImage} alt="Background" className="background" />

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
              bottom: window.innerHeight - tube.yUpper - tubeHeight,
            }}
          />
          <img
            className="tube-lower"
            src={tubeImage}
            alt="Tube"
            style={{
              width: tubeWidth,
              height: tubeHeight,
              bottom: tube.yLower,
              zIndex: 0,
            }}
          />
        </div>
      ))}

      <div className="base-container">
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{ left: `${basePosition}px`, bottom: "0", zIndex: 1 }}
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
