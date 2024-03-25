import React from 'react';

const Poison = ({ position, size = 10 }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'black',
        borderRadius: '50%',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Poison;


