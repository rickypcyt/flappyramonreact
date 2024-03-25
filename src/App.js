import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import backgroundImage from "./Images/bgdia.png";
import baseImage from "./Images/basex5.jpg";
import birdImage from "./Images/ramos/ramon1.png";
import tubeImage from "./Images/pipes/pen2.png";
import song from "./MALDITA_RAMONA_-_CHLY_feat._Montana_Recordzzz.mp3";
import "./fonts.css";

const gravity = -0.4;
const tubeWidth = 52;
const tubeHeight = 320;
const tubeGap = 500;
const tubeSpeed = 5;

const generateRandomTubePosition = () => {
  const minY = window.innerHeight * -0.01;
  const maxY = window.innerHeight * -0.15;
  const randomY = Math.random() * (maxY - minY) + minY;
  return { x: window.innerWidth, yUpper: randomY, yLower: randomY - 10 };
};

const Tube = ({ tube }) => (
  <div
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
);

function App() {
  const [basePosition, setBasePosition] = useState(0);
  const [birdPosition, setBirdPosition] = useState(window.innerHeight / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(() => {
    const savedHighestScore = localStorage.getItem("highestScore");
    return savedHighestScore ? parseInt(savedHighestScore) : 0;
  });
  const [tubes, setTubes] = useState([]);
  const baseRef = useRef(null);
  const animateRef = useRef(null);
  const audioRef = useRef(null);

  const handleKeyDown = useCallback(
    (e) => {
      if (!gameStarted && e.keyCode === 32) {
        setGameStarted(true);
        if (audioRef.current) {
          audioRef.current.play();
        }
      } else if (gameStarted && !gamePaused && e.keyCode === 32) {
        setBirdVelocity(7);
      } else if (
        (e.keyCode === 80 || e.keyCode === 27 || e.keyCode === 32) &&
        gameStarted &&
        !gameOver
      ) {
        setGamePaused((prevPaused) => !prevPaused);
      }
    },
    [gameStarted, gamePaused, gameOver]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.keyCode === 32 && gameOver) {
        restartGame();
      }
    },
    [gameOver]
  );

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
    if (score > highestScore) {
      setHighestScore(score);
      localStorage.setItem("highestScore", score);
    }
  }, [score, highestScore]);

  useEffect(() => {
    const animate = () => {
      setBirdVelocity((prevVelocity) => prevVelocity + gravity);
      setBirdPosition((prevPosition) => prevPosition + birdVelocity);
      setBasePosition(
        (prevPosition) => (prevPosition + 1) % (window.innerWidth + 100)
      );
      setTubes((prevTubes) => {
        let incrementScore = false;
        const newTubes = prevTubes
          .map((tube) => {
            const newX = tube.x - tubeSpeed;
            if (newX < 100 && tube.x >= 100) {
              incrementScore = true;
            }
            return { ...tube, x: newX };
          })
          .filter((tube) => tube.x > -tubeWidth);

        if (incrementScore) {
          setScore((prevScore) => prevScore + 1);
        }

        if (
          newTubes.length === 0 ||
          window.innerWidth - newTubes[newTubes.length - 1].x >= tubeGap
        ) {
          newTubes.push(generateRandomTubePosition());
        }

        return newTubes;
      });

      detectBaseCollision();

      const birdRect = document.querySelector(".bird").getBoundingClientRect();
      const birdHeight = 50;
      const tubeGapHeight = tubeGap - tubeHeight * 2;
      tubes.forEach((tube) => {
        const upperTubeRect = document
          .querySelector(".tube-upper")
          .getBoundingClientRect();
        const lowerTubeRect = document
          .querySelector(".tube-lower")
          .getBoundingClientRect();
        if (
          birdRect.right > tube.x &&
          birdRect.left < tube.x + tubeWidth &&
          (birdRect.top < upperTubeRect.bottom ||
            birdRect.bottom > lowerTubeRect.top)
        ) {
          setGameOver(true);
          cancelAnimationFrame(animateRef.current);
        }
      });

      const baseHeight = 50;
      const birdBottomPosition = birdPosition + birdHeight - 1;
      if (birdBottomPosition >= window.innerHeight - baseHeight) {
        setGameOver(true);
        cancelAnimationFrame(animateRef.current);
      }

      animateRef.current = requestAnimationFrame(animate);
    };

    if (gameStarted && !gamePaused && !gameOver) {
      animateRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animateRef.current);
    };
  }, [gameStarted, gamePaused, birdVelocity, tubes, gameOver]);

  const restartGame = () => {
    setBasePosition(0);
    setBirdPosition(window.innerHeight / 2);
    setBirdVelocity(0);
    setGameStarted(false);
    setGamePaused(false);
    setGameOver(false);
    setScore(0); // Reiniciar el contador de puntuación
    setTubes([]);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = song;
      audioRef.current.load();
    }
  }, []);

  return (
    <div className="App">
      <div
        className={`overlay ${gamePaused || gameOver ? "overlay-dark" : ""}`}
        style={{ display: gamePaused ? "block" : "none" }}
      />
      {gamePaused || gameOver ? (
        <div
          className="overlay"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 9,
          }}
        />
      ) : null}
      <div
        className="overlay"
        style={{ display: gamePaused ? "block" : "none" }}
      />
      <img src={backgroundImage} alt="Background" className="background" />
      {tubes.map((tube, index) => (
        <Tube key={index} tube={tube} />
      ))}
      <div className="score-display">
        <h1>SCORE: {score}</h1>
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
          <h1>HIGHEST SCORE: {highestScore}</h1>
          <h1>PRESS SPACE TO RESTART</h1>
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
      <audio ref={audioRef} />
    </div>
  );
}
export default App;
