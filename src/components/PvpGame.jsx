import React, { Component } from 'react';
import Food from './Food';
import Player from './Player';
import Poison from './Poison';
import ScoreBoard from './ScoreBoard';

class PvPGame extends Component {
  constructor(props) {
    super(props);
    // Initial state setup including positions, sizes, scores, and canvas dimensions
    this.state = {
      foods: [],
      poisons: [],
      player1Position: { x: 100, y: 100 },
      player2Position: { x: 1100, y: 600 },
      player1Size: 10,
      player2Size: 10,
      isGameOver: false,
      canvasWidth: 1280, 
      canvasHeight: 720, 
      player1Score: 0, 
      player2Score: 0, 
    };
  }

  // Generate initial foods and poisons, and start the game loop upon component mount
  componentDidMount() {
    this.generateInitialFoods();
    this.startGameLoop();
  }

  // Clear the game loop interval upon component unmount
  componentWillUnmount() {
    clearInterval(this.gameLoopInterval);
  }

  // Generate initial positions for foods and poisons
  generateInitialFoods() {
    const foods = [];
    const poisons = []; 
    for (let i = 0; i < 200; i++) {
      foods.push(this.generateRandomPosition());
      if (i % 10 === 0) { 
        poisons.push(this.generateRandomPosition());
      }
    }
    this.setState({ foods, poisons });
  }

  // Generate a random position within the canvas
  generateRandomPosition() {
    const x = Math.floor(Math.random() * 1280);
    const y = Math.floor(Math.random() * 720);
    return { x, y };
  }

  // Start the game loop to continuously check for player collisions
  startGameLoop() {
    this.gameLoopInterval = setInterval(() => {
      this.setState(prevState => ({  
      }), () => {
        this.checkPlayerCollision(); 
      });
    }, 1000 / 60);
  }

  // Update the position of a player and handle collisions with food and poison
  updatePlayerPosition = (player, newPosition) => {
    const { canvasWidth, canvasHeight, player1Size, player2Size } = this.state;
    let size = player === 'player1' ? player1Size : player2Size;

    // Adjust the position to ensure it remains within canvas boundaries
    const newX = Math.max(size / 2, Math.min(canvasWidth - size / 2, newPosition.x));
    const newY = Math.max(size / 2, Math.min(canvasHeight - size / 2, newPosition.y));

    const updatedPosition = { x: newX, y: newY };

    this.handleFoodCollision(updatedPosition, player);
    this.handlePoisonCollision(updatedPosition, player);

     // Update state with the new position
    if (player === 'player1') {
      this.setState({ player1Position: updatedPosition });
    } else {
      this.setState({ player2Position: updatedPosition });
    }
  };

  // Handle collision between a player and food items
  handleFoodCollision = (newPlayerPosition, player) => {
    const { foods } = this.state;
    let collided = false;
    let playerSizeKey = player === 'player1' ? 'player1Size' : 'player2Size';
    let playerSize = this.state[playerSizeKey];

    const newFoods = foods.filter(food => {
      const dx = newPlayerPosition.x - food.x;
      const dy = newPlayerPosition.y - food.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
  
      if (distance < playerSize / 2 + 10) { 
        collided = true;
        return false;
      }
      return true;
    });
  
    if (collided) {
      this.setState(prevState => ({
        foods: [...newFoods, this.generateRandomPosition()],
        [playerSizeKey]: prevState[playerSizeKey] + 1,
      }));
    }
  };

  // Handle collision between a player and poison items
  handlePoisonCollision = (newPlayerPosition, player) => {
    let playerSizeKey = player === 'player1' ? 'player1Size' : 'player2Size';
    const poisons = this.state.poisons.filter(poison => {
      const dx = newPlayerPosition.x - poison.x;
      const dy = newPlayerPosition.y - poison.y;
      if (Math.sqrt(dx * dx + dy * dy) < this.state[playerSizeKey] / 2 + 5) { 
        return false; 
      }
      return true;
    });
  
    if (poisons.length < this.state.poisons.length) { 
      this.setState(prevState => ({
        [playerSizeKey]: prevState[playerSizeKey] * 0.9, // Reduce player size by 10% upon collision
        poisons: poisons,
      }));
    }
  };

  // Check for collision between the two players to determine the winner
  checkPlayerCollision = () => {
    const { player1Position, player2Position, player1Size, player2Size } = this.state;
    const dx = player1Position.x - player2Position.x;
    const dy = player1Position.y - player2Position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < (player1Size / 2 + player2Size / 2)) {
      clearInterval(this.gameLoopInterval);
      let winner;
      if (player1Size > player2Size) {
        winner = "Player 1 wins!";
        this.setState(prevState => ({ player1Score: prevState.player1Score + 1 }));
      } else {
        winner = "Player 2 wins!";
        this.setState(prevState => ({ player2Score: prevState.player2Score + 1 }));
      }
      this.setState({ isGameOver: true });

      const restart = window.confirm(`${winner} Play again?`);
      if (restart) {
        this.resetGame();
      } else {
        this.setState({ player1Score: 0, player2Score: 0 }); // Check for collision between the two players to determine the winner
        window.location.reload(); 
      }
    }
  };

  // Reset game state to initial values and start a new game loop
  resetGame = () => {
    clearInterval(this.gameLoopInterval);

    this.setState(
      {
        foods: [],
        player1Position: { x: 100, y: 100 },
        player2Position: { x: 1100, y: 600 },
        player1Size: 10,
        player2Size: 10,
        isGameOver: false,
      },
      () => {
        this.generateInitialFoods(); 
        this.startGameLoop(); 
        this.player1Ref.current.resetMovement();
        this.player1Ref.current.resetPosition();
        this.player2Ref.current.resetMovement();
        this.player2Ref.current.resetPosition();
      }
    );
  };
  
  player1Ref = React.createRef();
  player2Ref = React.createRef();

  render() {
    const { foods, poisons, player1Position, player2Position, player1Size, player2Size, player1Score, player2Score } = this.state;
    const gameCanvasStyle = {
      position: 'relative',
      width: '1280px',
      height: '720px',
      border: '1px solid black',
      margin: 'auto',
      backgroundColor: '#b8d9b8', 
      backgroundSize: '50px 50px', 
      backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)', // 创建白色网格线
      backgroundPosition: 'center center', 
    };

    return (
      <div style={{ position: 'relative', width: '1280px', height: '720px', border: '1px solid black' }}>
        <ScoreBoard 
          player1Score={player1Score} 
          player2Score={player2Score} 
          player1Label="Player1" 
          player2Label="Player2" />
        <div id="gameCanvas" style={gameCanvasStyle}>
        {foods.map((food, index) => (
          <Food key={index} position={food} />))}
        {poisons.map((poison, index) => (
          <Poison key={index} position={poison} size={10} /> ))}
        <Player 
         ref={this.player1Ref}
         position={this.state.player1Position}
         size={this.state.player1Size}
         color="red"
         controlKeys={{ 65: 'left', 68: 'right', 87: 'up', 83: 'down' }}
         updatePosition={(newPos) => this.updatePlayerPosition('player1', newPos)}
         canvasWidth={this.state.canvasWidth} // Pass canvas dimensions to Player
         canvasHeight={this.state.canvasHeight}
        />
        <Player 
         ref={this.player2Ref}
         position={this.state.player2Position}
         size={this.state.player2Size}
         color="blue"
         controlKeys={{ 37: 'left', 39: 'right', 38: 'up', 40: 'down' }}
         updatePosition={(newPos) => this.updatePlayerPosition('player2', newPos)}
         canvasWidth={this.state.canvasWidth} // Pass canvas dimensions to Player
         canvasHeight={this.state.canvasHeight}
        />
      </div>
    </div>
    );
  }
}

export default PvPGame;