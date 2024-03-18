import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import backgroundImage from "./Images/bgx4.png";
import baseImage from "./Images/basex5.png";
import birdImage from "./Images/ramos/ramon1.png";
import tubeImage from "./Images/pipes/pen2.png";
import "./fonts.css";

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(window.innerHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false); 
  const gravity = -0.25;
  const tubeWidth = 52;
  const tubeHeight = 320;
  const tubeGap = 500;
  const tubeSpeed = 5;

  const [tubes, setTubes] = useState([]);

  const animateRef = useRef(null);

  // Precarga de imágenes
  useEffect(() => {
    const preloadImages = async () => {
      const images = [backgroundImage, baseImage, birdImage, tubeImage];
      await Promise.all(images.map(image => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = image;
      })));
      // Todas las imágenes están cargadas
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameStarted && e.keyCode === 32) {
        setGameStarted(true);
      } else if (gameStarted && !gamePaused && e.keyCode === 32) {
        setBirdVelocity(7);
      } else if ((e.keyCode === 80 || e.keyCode === 27 || e.keyCode === 32) && gameStarted) {
        setGamePaused((prevPaused) => !prevPaused);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameStarted, gamePaused]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.keyCode === 32 && gameOver) {
        restartGame();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [gameOver]);

  useEffect(() => {
    if (gameStarted && !gamePaused && !gameOver) {
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

        const birdRect = document.querySelector(".bird").getBoundingClientRect();
        tubes.forEach((tube) => {
          const upperTubeRect = document.querySelector(".tube-upper").getBoundingClientRect();
          const lowerTubeRect = document.querySelector(".tube-lower").getBoundingClientRect();

          if (
            birdRect.right > tube.x &&
            birdRect.left < tube.x + tubeWidth &&
            (birdRect.top < upperTubeRect.bottom || birdRect.bottom > lowerTubeRect.top)
          ) {
            setGameOver(true);
            cancelAnimationFrame(animateRef.current);
          }
        });

        animateRef.current = requestAnimationFrame(animate);
      };

      animateRef.current = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animateRef.current);
      };
    }
  }, [gameStarted, gamePaused, birdVelocity, tubes, gameOver]);

  const restartGame = () => {
    setBasePosition(0);
    setBirdPosition(window.innerHeight / 2);
    setBirdVelocity(0);
    setGameStarted(false);
    setGamePaused(false);
    setGameOver(false);
    setTubes([]);
  };

  return (
    <div className="App">
      <div className="overlay" style={{ display: gamePaused ? 'block' : 'none' }} />
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
      {gamePaused && (
        <div className="pause-message">
          <h1>PAUSED</h1>
          <h2>PRESS ESC OR SPACE TO CONTINUE</h2>
        </div>
      )}
      {gameStarted && !gameOver && (
        <img
          src={birdImage}
          alt="Bird"
          className="bird"
          style={{ left: "100px", bottom: `${birdPosition}px` }}
        />
      )}
      {gameOver && (
        <div className="pause-message">
          <h1>GAME OVER</h1>
          <h1>Press SPACE to restart</h1>
        </div>
      )}
      {!gameStarted && !gameOver && (
        <div className="start-message">
          <h1>FLAPPY RAMON</h1>
          <div className="bird-container">
            <img src={birdImage} alt="Bird" className="start-bird" />
          </div>
          <h1>PRESS SPACE TO START</h1>
        </div>
      )}
    </div>
  );
}

export default App;
