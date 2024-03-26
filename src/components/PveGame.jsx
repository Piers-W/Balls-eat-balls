import React, { useState, useEffect, useRef } from 'react';
import Food from './Food.jsx';
import Player from './Player.jsx';
import Monster from './Monster.jsx';
import Poison from './Poison.jsx';
import ScoreBoard from './ScoreBoard.jsx';
import { myFirebase } from "../models/MyFirebase.js";


function PvEGame() {
  const [foods, setFoods] = useState([]);
  const [poisons, setPoisons] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 1000, y: 500 });
  const playerPositionRef = useRef(playerPosition);
  const [playerSize, setPlayerSize] = useState(10);
  const playerSizeRef = useRef(playerSize);
  const [monsterPosition, setMonsterPosition] = useState({ x: 0, y: 0 });
  const monsterPositionRef = useRef(monsterPosition);
  const [monsterSize, setMonsterSize] = useState(100);
  const monsterSizeRef = useRef(monsterSize);
  const [isGameOver, setIsGameOver] = useState(false);
  const [viewportOffset, setViewportOffset] = useState({ x: 0, y: 0 });
  const [playerScore, setPlayerScore] = useState(0);
  const [monsterScore, setMonsterScore] = useState(0);
  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const gameLoopIntervalRef = useRef();
  const player1Ref = useRef();
  const moveSpeed = 2;
  const animationFrameId = useRef(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [moving, setMoving] = useState({ left: false, right: false, up: false, down: false });

  // Function to handle difficulty selection
  function handleDifficultySelection(selectedDifficulty) {
    switch (selectedDifficulty) {
      case 'easy':
        setMonsterSize(100);
        break;
      case 'medium':
        setMonsterSize(150);
        break;
      case 'hard':
        setMonsterSize(200);
        break;
      default:
        break;
    }
    setDifficulty(selectedDifficulty);
    setIsGameStarted(true);
  }

  // Effect to fetch scores from Firebase
  useEffect(() => {
    if (isGameStarted && difficulty) {
      console.log("Get score");
      myFirebase.getPvEScore(difficulty).then(scores => {
        setPlayerScore(scores.playerScore);
        setMonsterScore(scores.monsterScore);
      });
    }
  }, [isGameStarted, difficulty]);

  //Effect to update scores on Firebase
  useEffect(() => {
    if (difficulty){
      myFirebase.updatePvEScore(difficulty, { playerScore, monsterScore });
    }
  }, [playerScore, monsterScore]);

  // Function to reset scores
  const resetScores = async () => {
    const difficulties = ['easy', 'medium', 'hard'];
    for (let difficulty of difficulties) {
      await myFirebase.updatePvEScore(difficulty, { playerScore: 0, monsterScore: 0 });
    }
    alert('All scores have been reset!');
  };

  // Effect to handle keyboard events for player movement
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.keyCode) {
        case 65: // A key
          setMoving(m => ({ ...m, left: true }));
          break;
        case 68: // D key
          setMoving(m => ({ ...m, right: true }));
          break;
        case 87: // W key
          setMoving(m => ({ ...m, up: true }));
          break;
        case 83: // S key
          setMoving(m => ({ ...m, down: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.keyCode) {
        case 65: // A key
          setMoving(m => ({ ...m, left: false }));
          break;
        case 68: // D key
          setMoving(m => ({ ...m, right: false }));
          break;
        case 87: // W key
          setMoving(m => ({ ...m, up: false }));
          break;
        case 83: // S key
          setMoving(m => ({ ...m, down: false }));
          break;
        default:
          break;
      }
    };

    const preventWindowScroll = (event) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', preventWindowScroll);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', preventWindowScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Effect to handle player movement
  useEffect(() => {
    const updatePlayerPosition = () => {
      let newX = Math.max(playerSize / 2, Math.min(canvasWidth - playerSize / 2, playerPosition.x + (moving.right - moving.left) * 2));
      let newY = Math.max(playerSize / 2, Math.min(canvasHeight - playerSize / 2, playerPosition.y + (moving.down - moving.up) * 2));

      const newPosition = { x: newX, y: newY };
      setPlayerPosition(newPosition);
      handlePlayerPosition(newPosition);
      animationFrameId.current = requestAnimationFrame(updatePlayerPosition);
    };

    animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [moving, playerPosition, moveSpeed, playerSize, canvasWidth, canvasHeight]);

  // Function to update monster position
  const updateMonsterPosition = () => {
    const speed = 1;
    const dx = playerPositionRef.current.x - monsterPositionRef.current.x;
    const dy = playerPositionRef.current.y - monsterPositionRef.current.y;
    const angle = Math.atan2(dy, dx);

    const newX = monsterPositionRef.current.x + Math.cos(angle) * speed;
    const newY = monsterPositionRef.current.y + Math.sin(angle) * speed;

    const newPosition = { x: newX, y: newY };
    setMonsterPosition(newPosition);
    handleMonsterPosition(newPosition);
  };

  useEffect(() => {
    updateMonsterPosition();
  }, [playerPosition]);

  useEffect(() => {
    if (!isGameStarted) return;
    generateInitialFoods();
    startGameLoop();
    updateViewportOffset(playerPosition);
    setMonsterPosition(generateRandomPosition());
    //updateMonsterPosition();

    return () => {
      clearInterval(gameLoopIntervalRef.current);
    };
  }, [isGameStarted]);

  useEffect(() => {

    playerPositionRef.current = playerPosition;
    playerSizeRef.current = playerSize;
    monsterPositionRef.current = monsterPosition;
    monsterSizeRef.current = monsterSize;
  }, [playerPosition, playerSize, monsterPosition, monsterSize]);

  // Function to generate a random position
  function generateRandomPosition() {
    const x = Math.floor(Math.random() * canvasWidth);
    const y = Math.floor(Math.random() * canvasHeight);
    return { x, y };
  }

  // Function to generate initial foods and poisons
  function generateInitialFoods() {
    const newFoods = [];
    const newPoisons = [];
    for (let i = 0; i < 300; i++) {
      newFoods.push(generateRandomPosition());
      if (i % 30 === 0) {
        newPoisons.push(generateRandomPosition());
      }
    }
    setFoods(newFoods);
    setPoisons(newPoisons);
  }

  // Function to start the game loop
  function startGameLoop() {
    gameLoopIntervalRef.current = setInterval(() => {
      checkCollisionWithMonster();
      updateMonsterPosition();
    }, 1000 / 60);

  }

  // Function to handle player position
  function handlePlayerPosition(newPosition) {
    handleFoodCollision(newPosition, 'player');
    handlePoisonCollision(newPosition, 'player');
    setPlayerPosition(newPosition);
    updateViewportOffset(newPosition);

  }

  // Function to handle monster position
  function handleMonsterPosition(newPosition) {
    // Collision handling and position updates for monster
    handleFoodCollision(newPosition, 'monster');
    handlePoisonCollision(newPosition, 'monster');
    setMonsterPosition(newPosition);

  }

  // Function to update viewport offset
  function updateViewportOffset(playerPosition) {
    const viewportWidth = 1280;
    const viewportHeight = 720;
    let offsetX = -playerPosition.x + viewportWidth / 2;
    let offsetY = -playerPosition.y + viewportHeight / 2;

    offsetX = Math.min(0, offsetX);
    offsetY = Math.min(0, offsetY);
    offsetX = Math.max(viewportWidth - canvasWidth, offsetX);
    offsetY = Math.max(viewportHeight - canvasHeight, offsetY);

    setViewportOffset({ x: offsetX, y: offsetY });
  }

  // Function to handle collision with food for both player and monster
  function handleFoodCollision(newPosition, collider) {
    let colliderSize = collider === 'player' ? playerSize : monsterSize;
    let sizeUpdater = collider === 'player' ? setPlayerSize : setMonsterSize;

    const newFoods = foods.filter(food => {
      const dx = newPosition.x - food.x;
      const dy = newPosition.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance >= colliderSize / 2 + 10;
    });
    if (foods.length !== newFoods.length) {
      setFoods([...newFoods, generateRandomPosition()]);
      sizeUpdater(prevSize => prevSize + 1);
    }
  }

  // Function to handle collision with poison for both player and monster
  function handlePoisonCollision(newPosition, collider) {
    let colliderSize = collider === 'player' ? playerSize : monsterSize;
    let sizeUpdater = collider === 'player' ? setPlayerSize : setMonsterSize;

    const newPoisons = poisons.filter(poison => {
      const dx = newPosition.x - poison.x;
      const dy = newPosition.y - poison.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance >= colliderSize / 2 + 10; // Only keep the poisons that did not collide
    });

    // If collision occurred, update state
    if (poisons.length !== newPoisons.length) {
      sizeUpdater(prevSize => prevSize * 0.9); // Reduce size by 10%
      setPoisons(newPoisons);
    }
  }

  // Function to check collision between player and monster to determine the game over condition
  function checkCollisionWithMonster() {
    const dx = playerPositionRef.current.x - monsterPositionRef.current.x;
    const dy = playerPositionRef.current.y - monsterPositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (playerSizeRef.current / 2) + (monsterSizeRef.current / 2)) {
      clearInterval(gameLoopIntervalRef.current);
      let winner = playerSizeRef.current > monsterSizeRef.current ? "Player wins!" : "Monster wins!";

      setIsGameOver(true);

      const message = `${winner} Play again?`;
      const playAgain = window.confirm(message);
      if (playAgain) {
          if (playerSizeRef.current > monsterSizeRef.current) {
            setPlayerScore(prevScore => prevScore + 1);
          } else {
            setMonsterScore(prevScore => prevScore + 1);
          }
          resetGame();
      } else {
        clearInterval(gameLoopIntervalRef.current);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
          window.location.reload(); 
      }
    }
  }

  // Function to reset the game
  const resetGame = () => {
    clearInterval(gameLoopIntervalRef.current);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    setFoods([]);
    setPoisons([]);
    setPlayerPosition({ x: 1000, y: 500 });
    setPlayerSize(10);
    setMonsterPosition(generateRandomPosition());
    setIsGameOver(false);
    monsterPositionRef.current = generateRandomPosition();
    const currentDifficulty = difficulty || 'hard';
    handleDifficultySelection(currentDifficulty);
    setMoving({ left: false, right: false, up: false, down: false });
    startGameLoop();
    generateInitialFoods();
  };


  const gameCanvasStyle = {
    width: `${canvasWidth}px`,
    height: `${canvasHeight}px`,
    position: 'absolute',
    transform: `translate(${viewportOffset.x}px, ${viewportOffset.y}px)`,
    backgroundColor: '#b8d9b8',
    backgroundSize: '50px 50px',
    backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)'
  };


  return (
    <div id="gameContainer" style={{ width: '1280px', height: '720px', overflow: 'hidden', position: 'relative' }}>
      {!isGameStarted ? (
        <div style={{ textAlign: 'center', marginTop: '20%' }}>
          <h1>Select Difficulty</h1>
        <p className="description-text">Choose a difficulty level for the game. Easy mode has monster size 100, Medium is 150, and Hard is 200. The "Reset Scores" button will set scores to zero for all modes.</p>
        <div>
          <button className="game-button" onClick={() => handleDifficultySelection('easy')}>Easy</button>
          <button className="game-button" onClick={() => handleDifficultySelection('medium')}>Medium</button>
          <button className="game-button" onClick={() => handleDifficultySelection('hard')}>Hard</button>
        </div>
        <button className="reset-scores-button game-button" onClick={resetScores} style={{marginTop: "20px"}}>Reset Scores</button>
      </div>
      ) : (
        <>
          <ScoreBoard
            player1Score={playerScore}
            player2Score={monsterScore}
            player1Label="Player"
            player2Label="Monster"
            >
            </ScoreBoard>
            <div id="gameCanvas" style={gameCanvasStyle}>
              {foods.map((food, index) => (
                <Food key={index} position={food} size={10} />
              ))}
              {poisons.map((poison, index) => (
                <Poison key={index} position={poison} size={10} />
              ))}
              <Player
                position={playerPosition}
                size={playerSize}
                color="blue"
              />
              <Monster
                position={monsterPosition}
                size={monsterSize}
              />
            </div>
          </>
        )}
      </div>
    );
  }
  
  export default PvEGame;
  





