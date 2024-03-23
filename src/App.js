import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";

import backgroundImage from "./Images/bgnebula.png";
import baseImage from "./Images/basex5.jpg";
import birdImage from "./Images/ramos/ramon1.png";
import tubeImage from "./Images/pipes/pen2.png";
import song from '/workspaces/flappyramonreact/src/MALDITA_RAMONA_-_CHLY_feat._Montana_Recordzzz.mp3'
import "./fonts.css";

const gravity = -0.4; //Increased gravity 
const jumpStrength = 10; //Adjust jump strength for balance
const tubeWidth = 52;
const tubeHeight = 320;
const tubeGap = 500;
const tubeSpeed = 5;

const generateRandomTubePosition = () => {
  const minY = window.innerHeight * -0.01;
  const maxY = window.innerHeight * -0.15;
  const randomY = Math.random() * (maxY - minY) + minY;
  const id = Date.now(); 
  return { x: window.innerWidth, yUpper: randomY, yLower: randomY - 10 };
};

const Tube = ({ tube }) => (
  <div className="tube" style={{ position: "absolute", left: tube.x, bottom: 0 }}>
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
);

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(window.innerHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [tubes, setTubes] = useState([]);
  const baseRef = useRef(null); 
  const animateRef = useRef(null);
  const [score, setScore] = useState(0); 

  const handleKeyDown = useCallback((e) => {
    if (!gameStarted && e.keyCode === 32) {
      setGameStarted(true);
      if(audioRef.current){
        audioRef.current.play(); 
      }
    } else if (gameStarted && !gamePaused && e.keyCode === 32) {
      setBirdVelocity(7);
    } else if ((e.keyCode === 80 || e.keyCode === 27 || e.keyCode === 32) && gameStarted) {
      setGamePaused((prevPaused) => !prevPaused);
    }
  }, [gameStarted, gamePaused]);

  const handleKeyPress = useCallback((e) => {
    if (e.keyCode === 32 && gameOver) {
      restartGame();
    }
  }, [gameOver]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleKeyPress]);

  const detectBaseCollision = useCallback(() => {
    const birdRect = document.querySelector(".bird").getBoundingClientRect();
    const baseRect = baseRef.current.getBoundingClientRect();

    if (birdRect.bottom >= baseRect.top) {
      setGameOver(true);
      cancelAnimationFrame(animateRef.current);
    }
  }, []);

  useEffect(() => {
    const animate = () => {
      // Update bird's velocity and position
      setBirdVelocity((prevVelocity) => prevVelocity + gravity);
      setBirdPosition((prevPosition) => prevPosition + birdVelocity);
      // Update base position for a moving effect
      setBasePosition((prevPosition) => (prevPosition + 1) % (window.innerWidth + 100));
  
      // Update tubes: move them, check for passed tubes, and add new ones if needed
      setTubes((prevTubes) => {
        let incrementScore = false; // Flag to determine if we should increment the score
        const newTubes = prevTubes.map((tube) => {
          const newX = tube.x - tubeSpeed; // Calculate new X position for the tube
          

          // Check if the tube has just passed the bird's fixed X position to increment the score
          if (newX < 100 && tube.x >= 100 && !tube.passed) {
            incrementScore = true; // Set the flag to increment the score
            return { ...tube, x: newX, passed: true }; // Mark the tube as passed
          }
  
          return { ...tube, x: newX }; // Update tube position without changing the passed status
        });
  
        // If a tube was just passed, increment the score
        if (incrementScore) {
          setScore((prevScore) => prevScore + 1);
        }
  
        // Check and add a new tube if the last tube has moved far enough
        if (newTubes.length === 0 || window.innerWidth - newTubes[newTubes.length - 1].x >= tubeGap) {
          newTubes.push({ ...generateRandomTubePosition(), passed: false });
        }
  
        return newTubes.filter((tube) => tube.x > -tubeWidth); // Keep tubes that are still within view
      });
  
      // Request the next animation frame if the game is not paused and not over
      if (!gamePaused && !gameOver) {
        animateRef.current = requestAnimationFrame(animate);
      }
    };
  
    // Start the animation loop if the game is started and not paused or over
    if (gameStarted && !gamePaused && !gameOver) {
      animateRef.current = requestAnimationFrame(animate);
    }
  
    // Cleanup function to cancel the animation frame when the component unmounts or dependencies change
    return () => {
      cancelAnimationFrame(animateRef.current);
    };
  }, [gameStarted, gamePaused, gameOver, birdVelocity, gravity, tubeSpeed, setScore, tubeGap]);

  const restartGame = () => {
    setBasePosition(0);
    setBirdPosition(window.innerHeight / 2);
    setBirdVelocity(0);
    setGameStarted(false);
    setGamePaused(false);
    setGameOver(false);
    setTubes([]);
    setScore(0); 
  };

  const audioRef = useRef(null); 

  useEffect(() => {
    if(audioRef.current){
      audioRef.current.src = song; 
      audioRef.current.load(); 
    }
  }, []);

  return (
    <div className="App">
      <div className="overlay" style={{ display: gamePaused ? 'block' : 'none' }} />
      <img src={backgroundImage} alt="Background" className="background" />
      {tubes.map((tube, index) => <Tube key={index} tube={tube} />)}

      <div className="score-display" style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', fontSize: '30px', color: 'white', zIndex: 10 }}>
      Score: {score}
    </div>

      <div className="base-container">
        <img
          src={baseImage}
          alt="Base"
          className="base"
          style={{ left: `${basePosition}px`, bottom: "0", zIndex: 1 }}
          ref={baseRef}
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
      <audio ref = {audioRef} />
    </div>
  );
}

export default App;
