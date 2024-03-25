import React from 'react';

function ScoreBoard({ player1Score, player2Score, player1Label, player2Label }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 100,
      backgroundColor: '#f0f0f0',
      padding: '5px 20px',
      width: 'fit-content',
      margin: '10px auto',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h3 style={{ margin: 0 }}>{player1Label} {player1Score} - {player2Score} {player2Label}</h3>
    </div>
  );
}

export default ScoreBoard;

