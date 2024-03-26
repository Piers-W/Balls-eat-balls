import React, { useState, useEffect } from 'react';
import PvEGame from './components/PveGame.jsx';
import PvPGame from './components/PvpGame.jsx';
import './App.css';
import { myFirebase } from "./models/MyFirebase.js"

function App() {
  const [gameMode, setGameMode] = useState(null);
  const [scoreboard, setScoreboard] = useState([]);

  // Fetch the PvP scoreboard on component mount
  useEffect(() => {
    myFirebase.getPvPScoreboard().then(scores => {
      setScoreboard(scores);
    });
  }, []);

  // Function to select the game mode
  const selectGameMode = (mode) => {
    setGameMode(mode);
  };

  // Function to delete the scoreboard content
  const handleDeleteScoreboard = async () => {
    await myFirebase.deletePvPScoreboard();
    setScoreboard([]); // Clear local state
    alert('Scoreboard has been cleared!');
  };

// Function to render the game mode selection UI
const renderGameSelection = () => (
  <div className="game-selection-container">
    <h1 className="game-title">Welcome to Balls Eat Balls</h1>
    <p>Game Rules:</p>
    <ul className="game-rules">
      <li>In PvE mode, you control the blue ball using WASD, avoiding monsters (red balls), eating green balls (food) to increase your size. Avoid the poison (black balls), they shrink you by 10%. Ultimately, grow bigger than the monsters to eat them or achieve victory; being eaten by a monster results in failure. After the game ends, you can choose to play again or return to the game mode selection screen.</li>
      <li>In PvP mode, the basic rules are the same as in PvE mode. Player 1 controls the red ball with WASD, and Player 2 controls the blue ball with arrow keys. Eating the opponent player leads to victory.</li>
    </ul>
    <div>
      <button className="game-button" onClick={() => selectGameMode('PvE')}>Play PvE</button>
      <button className="game-button" onClick={() => selectGameMode('PvP')}>Play PvP</button>
    </div>
    <div className="scoreboard-container">
      <h2>Scoreboard</h2>
      <ul>
        {scoreboard.map((score, index) => (
          <li key={index}>{score.player1Name} vs {score.player2Name} - {score.player1Score}:{score.player2Score}</li>
        ))}
      </ul>
      <button onClick={handleDeleteScoreboard}>Clear Scoreboard</button>
    </div>
  </div>
);

  // Function to render the selected game mode
  const renderGame = () => {
    switch (gameMode) {
      case 'PvE':
        return <PvEGame />;
      case 'PvP':
        return <PvPGame />;
      default:
        return null;
    }
  };

  return (
    <div className="game-container">
      {!gameMode ? renderGameSelection() : renderGame()}
    </div>
  );
}

export default App;