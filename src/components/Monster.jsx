import React from 'react';

const Monster = ({ position, size }) => {
  const monsterStyle = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: 'red',
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

  return <div style={monsterStyle} className="monster">{Math.floor(size)}</div>;
};

export default Monster;
