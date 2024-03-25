import React, { useState, useEffect, useRef } from 'react';
import Food from './Food';
import Player from './Player';
import Poison from './Poison';
import ScoreBoard from './ScoreBoard';

function PvPGame() {
  const [foods, setFoods] = useState([]);
  const [poisons, setPoisons] = useState([]);
  const [player1Position, setPlayer1Position] = useState({ x: 100, y: 100 });
  const player1PositionRef = useRef(player1Position);
  const [player2Position, setPlayer2Position] = useState({ x: 1100, y: 600 });
  const player2PositionRef = useRef(player2Position);
  const [player1Size, setPlayer1Size] = useState(10);
  const player1SizeRef = useRef(player1Size);
  const [player2Size, setPlayer2Size] = useState(10);
  const player2SizeRef = useRef(player2Size);
  const [isGameOver, setIsGameOver] = useState(false);
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const canvasWidth = 1280;
  const canvasHeight = 720;
  const gameLoopIntervalRef = useRef();
  const animationFrameId = useRef(null);
  const moveSpeed = 2;

  const [movingPlayer1, setMovingPlayer1] = useState({ left: false, right: false, up: false, down: false });
  const [movingPlayer2, setMovingPlayer2] = useState({ left: false, right: false, up: false, down: false });

  // Handle key down events for both players
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.keyCode) {
        // Player 1 controls
        case 65: // A key
        setMovingPlayer1(m => ({ ...m, left: true }));
          break;
        case 68: // D key
        setMovingPlayer1(m => ({ ...m, right: true }));
          break;
        case 87: // W key
        setMovingPlayer1(m => ({ ...m, up: true }));
          break;
        case 83: // S key
        setMovingPlayer1(m => ({ ...m, down: true }));
          break;
        // Player 2 controls
        case 37: // Left arrow key
        setMovingPlayer2(m => ({ ...m, left: true }));
          break;
        case 39: // Right arrow key
        setMovingPlayer2(m => ({ ...m, right: true }));
          break;
        case 38: // Up arrow key
        setMovingPlayer2(m => ({ ...m, up: true }));
          break;
        case 40: // Down arrow key
        setMovingPlayer2(m => ({ ...m, down: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.keyCode) {
        // Player 1 controls
        case 65: // A key
        setMovingPlayer1(m => ({ ...m, left: false }));
          break;
        case 68: // D key
        setMovingPlayer1(m => ({ ...m, right: false }));
          break;
        case 87: // W key
        setMovingPlayer1(m => ({ ...m, up: false }));
          break;
        case 83: // S key
        setMovingPlayer1(m => ({ ...m, down: false }));
          break;
        // Player 2 controls
        case 37: // Left arrow key
        setMovingPlayer2(m => ({ ...m, left: false }));
          break;
        case 39: // Right arrow key
        setMovingPlayer2(m => ({ ...m, right: false }));
          break;
        case 38: // Up arrow key
        setMovingPlayer2(m => ({ ...m, up: false }));
          break;
        case 40: // Down arrow key
        setMovingPlayer2(m => ({ ...m, down: false }));
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
    const updatePlayerPositions = () => {
      // 确保直接使用状态来获取玩家当前位置和尺寸
      let newX1 = Math.max(player1Size / 2, Math.min(canvasWidth - player1Size / 2, player1Position.x + (movingPlayer1.right - movingPlayer1.left) * moveSpeed));
      let newY1 = Math.max(player1Size / 2, Math.min(canvasHeight - player1Size / 2, player1Position.y + (movingPlayer1.down - movingPlayer1.up) * moveSpeed));
      const newPosition1 = { x: newX1, y: newY1 };
  
      let newX2 = Math.max(player2Size / 2, Math.min(canvasWidth - player2Size / 2, player2Position.x + (movingPlayer2.right - movingPlayer2.left) * moveSpeed));
      let newY2 = Math.max(player2Size / 2, Math.min(canvasHeight - player2Size / 2, player2Position.y + (movingPlayer2.down - movingPlayer2.up) * moveSpeed));
      const newPosition2 = { x: newX2, y: newY2 };
  
      // 使用状态更新函数来设置新位置
      setPlayer1Position(newPosition1);
      setPlayer2Position(newPosition2);
  
      // 碰撞检测等
      checkFoodCollision(newPosition1, 'player1');
      checkPoisonCollision(newPosition1, 'player1');
      checkFoodCollision(newPosition2, 'player2');
      checkPoisonCollision(newPosition2, 'player2');
      checkPlayerCollision();
  
      animationFrameId.current = requestAnimationFrame(updatePlayerPositions);
    };
  
    animationFrameId.current = requestAnimationFrame(updatePlayerPositions);
  
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [player1Position, player2Position, player1Size, player2Size, movingPlayer1, movingPlayer2, moveSpeed, canvasWidth, canvasHeight]);
  

  useEffect(() => {
    generateInitialFoods();
    startGameLoop();
    
    return () => {
      clearInterval(gameLoopIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    player1PositionRef.current = player1Position;
    player1SizeRef.current = player1Size;
    player2PositionRef.current = player2Position;
    player2SizeRef.current = player2Size;
  }, [player1Position, player1Size, player2Position, player2Size]);

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
        
            checkPlayerCollision();

    }, 1000 / 60);
}


  function checkFoodCollision(position, player) {
    let sizeUpdater;
    let playerSize;
  
    if (player === 'player1') {
      sizeUpdater = setPlayer1Size;
      playerSize = player1Size;
    } else {
      sizeUpdater = setPlayer2Size;
      playerSize = player2Size;
    }
  
    const newFoods = foods.filter(food => {
      const dx = position.x - food.x;
      const dy = position.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance >= playerSize / 2 + 10; 
    });
  
    if (foods.length !== newFoods.length) {
      setFoods([...newFoods, generateRandomPosition()]);
      sizeUpdater(prevSize => prevSize + 1);
    }
  }
  
  
  function checkPoisonCollision(position, player) {
    let sizeUpdater;
    let playerSize;
  
    if (player === 'player1') {
      sizeUpdater = setPlayer1Size;
      playerSize = player1Size;
    } else {
      sizeUpdater = setPlayer2Size;
      playerSize = player2Size;
    }
  
    const newPoisons = poisons.filter(poison => {
      const dx = position.x - poison.x;
      const dy = position.y - poison.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance >= playerSize / 2 + 5; 
    });
  
    if (poisons.length !== newPoisons.length) {
      setPoisons(newPoisons);
      sizeUpdater(prevSize => Math.max(10, prevSize * 0.9)); 
    }
  }
  
  function checkPlayerCollision() {
    const dx = player1PositionRef.current.x - player2PositionRef.current.x;
    const dy = player1PositionRef.current.y - player2PositionRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
  
    if (distance < (player1SizeRef.current / 2 + player2SizeRef.current / 2)) {   
      clearInterval(gameLoopIntervalRef.current);
      let winner = player1SizeRef.current> player2SizeRef.current ? "Player1 wins!" : "Player2 wins!";
      setIsGameOver(true);
     
      if (player1SizeRef.current > player2SizeRef.current) {      
        setPlayer1Score(prevScore => prevScore + 1);
      } else {     
        setPlayer2Score(prevScore => prevScore + 1);
      }
      
      const message = `${winner} Play again?`;
    if (window.confirm(message)) {
      resetGame();
    } else {
      window.location.reload(); // This will reload the page, effectively resetting the state
    }
 
    }
  }

  function resetGame() {
    clearInterval(gameLoopIntervalRef.current);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
  }
    setFoods([]);
    setPoisons([]);
    setPlayer1Position({ x: 100, y: 100 });
    setPlayer2Position({ x: 1100, y: 600 });
    setPlayer1Size(10);
    setPlayer2Size(10);
    setIsGameOver(false);
    setMovingPlayer1({ left: false, right: false, up: false, down: false });
    setMovingPlayer2({ left: false, right: false, up: false, down: false });
    //player1PositionRef.current = { x: 100, y: 100 };
    //player2PositionRef.current = { x: 1100, y: 600 };
    startGameLoop();
    generateInitialFoods();
  }

  const gameCanvasStyle = {
    position: 'relative',
      width: '1280px',
      height: '720px',
      border: '1px solid black',
      margin: 'auto',
      backgroundColor: '#b8d9b8', 
      backgroundSize: '50px 50px', 
      backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
      backgroundPosition: 'center center',
  };

  return (
    <div id="gameContainer"  style={{ position: 'relative', width: `${canvasWidth}px`, height: `${canvasHeight}px`, border: '1px solid black' }}>
      <ScoreBoard 
        player1Score={player1Score} 
        player2Score={player2Score} 
        player1Label="Player 1" 
        player2Label="Player 2" />
      <div id="gameCanvas" style={gameCanvasStyle}>
        
        {foods.map((food, index) => (
          <Food key={index} position={food} />
        ))}
        {poisons.map((poison, index) => (
          <Poison key={index} position={poison} size={10} />
        ))}
       
        <Player
          position={player1Position}
          size={player1Size}
          color="red"
        />
        <Player
          position={player2Position}
          size={player2Size}
          color="blue"
        />
      </div>
    </div>
  );
}

export default PvPGame;