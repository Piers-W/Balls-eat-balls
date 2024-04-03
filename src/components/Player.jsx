import React from 'react';

const Player = React.forwardRef(({ position, size = 10, color }, ref) => {
  const style = {
    position: 'absolute',
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      borderRadius: '50%',
      left: `${position.x - size / 2}px`,
      top: `${position.y - size / 2}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white', 
      fontSize: `${Math.max(12, size / 4)}px`, 
      userSelect: 'none', 
  };

  return <div style={style} className="player">{Math.floor(size)}</div>;
});

export default Player;

