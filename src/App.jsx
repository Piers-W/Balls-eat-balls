import React, { useState } from 'react';
import PvEGame from './components/PveGame';
import PvPGame from './components/PvpGame';
import './App.css';

function App() {
  // 使用useState钩子初始化游戏模式状态
  const [gameMode, setGameMode] = useState(null); // 初始状态为null

  // 设置游戏模式的函数
  const selectGameMode = (mode) => {
    setGameMode(mode);
  };

  // 渲染游戏模式选择界面的函数
  const renderGameSelection = () => (
    <div className="game-selection-container">
      <h1 className="game-title">Welcome to the Balls eat balls</h1>
      <p>Game Rules:</p>
      <ul className="game-rules">
        <li>In PvE mode, you control the blue ball using WASD, avoiding monsters (red balls), eating green balls (food) to increase your size. Avoid the poison(black balls), they shrink you by 10%. Ultimately, grow bigger than the monsters to eat them or achieve victory; being eaten by a monster results in failure. After the game ends, you can choose to play again or return to the game mode selection screen.</li>
        <li>In PvP mode, the basic rules are the same as in PvE mode. Player 1 controls the red ball with WASD, and Player 2 controls the blue ball with arrow keys. Eating the opponent player leads to victory.</li>
      </ul>
      <div>
        <button className="game-button" onClick={() => selectGameMode('PvE')}>Play PvE</button>
        <button className="game-button" onClick={() => selectGameMode('PvP')}>Play PvP</button>
      </div>
    </div>
  );

  // 根据选定的游戏模式渲染相应的游戏组件
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

  // 主渲染函数
  return (
    <div className="game-container">
      {!gameMode ? renderGameSelection() : renderGame()}
    </div>
  );
}

export default App;
