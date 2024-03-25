import React, { useState, useEffect, useRef } from 'react';
import Food from './Food';
import Player from './Player';
import Monster from './Monster';
import Poison from './Poison';
import ScoreBoard from './ScoreBoard';

function PvEGame() {
  const [foods, setFoods] = useState([]);
  const [poisons, setPoisons] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 1000, y: 500 });
  const playerPositionRef = useRef(playerPosition);
  const [playerSize, setPlayerSize] = useState(10);
  const playerSizeRef = useRef(playerSize);
  const [monsterPosition, setMonsterPosition] = useState({ x: 0, y: 0 }); 
  const monsterPositionRef = useRef(monsterPosition);
  const [monsterSize, setMonsterSize] = useState(200);
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
  

  const [moving, setMoving] = useState({ left: false, right: false, up: false, down: false });

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
  
  useEffect(() => {
    const updatePlayerPosition = () => {
      let newX = Math.max(playerSize / 2, Math.min(canvasWidth - playerSize / 2, playerPosition.x + (moving.right - moving.left) * 2));
      let newY = Math.max(playerSize / 2, Math.min(canvasHeight - playerSize / 2, playerPosition.y + (moving.down - moving.up) * 2));
      
      const newPosition = { x: newX, y: newY };
      setPlayerPosition(newPosition);
      handlePlayerPosition(newPosition)
      animationFrameId.current = requestAnimationFrame(updatePlayerPosition);
    };

    animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [moving, playerPosition, moveSpeed, playerSize, canvasWidth, canvasHeight]);

  
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
      generateInitialFoods();
      startGameLoop();
      updateViewportOffset(playerPosition);
      setMonsterPosition(generateRandomPosition()); 
  
      return () => {
        clearInterval(gameLoopIntervalRef.current);
      };
    }, []);
  
    useEffect(() => {
     
      playerPositionRef.current = playerPosition;
      playerSizeRef.current = playerSize;
      monsterPositionRef.current = monsterPosition;
      monsterSizeRef.current = monsterSize;
    }, [playerPosition, playerSize, monsterPosition, monsterSize]);

  function generateRandomPosition() {
    const x = Math.floor(Math.random() * canvasWidth);
    const y = Math.floor(Math.random() * canvasHeight);
    return { x, y };
  }

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


  function startGameLoop() {
    gameLoopIntervalRef.current = setInterval(() => {
      checkCollisionWithMonster();
      updateMonsterPosition();
    }, 1000 / 60);
    
  }

  function handlePlayerPosition(newPosition) {
    // Collision handling and position updates for player
    handleFoodCollision(newPosition, 'player');
    handlePoisonCollision(newPosition, 'player');
    setPlayerPosition(newPosition);
    updateViewportOffset(newPosition);
    
  }

  function handleMonsterPosition(newPosition) {
    // Collision handling and position updates for monster
    handleFoodCollision(newPosition, 'monster');
    handlePoisonCollision(newPosition, 'monster');
    setMonsterPosition(newPosition);
    
  }

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

// Handles collision with food for both player and monster
function handleFoodCollision(newPosition, collider) {
  
  let colliderSize = collider === 'player' ? playerSize : monsterSize;
  let sizeUpdater = collider === 'player' ? setPlayerSize : setMonsterSize;
  
  

  const newFoods = foods.filter(food => {
    const dx = newPosition.x - food.x;
    const dy = newPosition.y - food.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    
    
    return distance >= colliderSize / 2 + 10; 
  });

  // If collision occurred, update state
  if (foods.length !== newFoods.length) {
    setFoods([...newFoods, generateRandomPosition()]);
    sizeUpdater(prevSize => prevSize + 1);
  }
}

// Handles collision with poison for both player and monster
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

// Checks collision between player and monster to determine the game over condition
function checkCollisionWithMonster() {
  const dx = playerPositionRef.current.x - monsterPositionRef.current.x;
  const dy = playerPositionRef.current.y - monsterPositionRef.current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance < (playerSizeRef.current / 2) + (monsterSizeRef.current / 2)) {
    clearInterval(gameLoopIntervalRef.current);
    let winner = playerSizeRef.current > monsterSizeRef.current ? "Player wins!" : "Monster wins!";
    
    setIsGameOver(true);

    if (playerSizeRef.current > monsterSizeRef.current) {
      setPlayerScore(prevScore => prevScore + 1);
    } else {
      setMonsterScore(prevScore => prevScore + 1);
    }
    

    const message = `${winner} Play again?`;
    if (window.confirm(message)) {
      resetGame();
    } else {
      window.location.reload(); 
    }
  }
}

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
  setMonsterSize(200);
  setIsGameOver(false);
  monsterPositionRef.current = generateRandomPosition();

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
      <ScoreBoard 
        player1Score={playerScore} 
        player2Score={monsterScore} 
        player1Label="Player" 
        player2Label="Monster" 
      />
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
    </div>
  );
}
  
  export default PvEGame;