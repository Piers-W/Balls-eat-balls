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

  return <div style={monsterStyle}>{Math.floor(size)}</div>;
};

export default Monster;



// import React, { useState, useEffect, useRef } from 'react';

// const Monster = ({ position: initialPosition, size: initialSize, playerPosition, onPositionChange }) => {
//   const [position, setPosition] = useState(initialPosition);
//   const [size, setSize] = useState(initialSize);
//   const speed = 10; 
//   const chaseIntervalRef = useRef();

//   useEffect(() => {
//     const chasePlayer = () => {
//       const dx = playerPosition.x - position.x;
//       const dy = playerPosition.y - position.y;
//       const angle = Math.atan2(dy, dx);

//       const newX = position.x + Math.cos(angle) * speed;
//       const newY = position.y + Math.sin(angle) * speed;

//       setPosition({ x: newX, y: newY });
//       onPositionChange({ x: newX, y: newY });
//     };

//     chaseIntervalRef.current = setInterval(chasePlayer, 100);

//     return () => clearInterval(chaseIntervalRef.current);
//   }, [position, playerPosition, onPositionChange]);

//   useEffect(() => {
//     // 监听位置和大小的props变化，并更新状态
//     setPosition(initialPosition);
//     setSize(initialSize);
//   }, [initialPosition, initialSize]);

//   const monsterStyle = {
//     position: 'absolute',
//     width: `${size}px`,
//     height: `${size}px`,
//     backgroundColor: 'red',
//     borderRadius: '50%',
//     left: `${position.x - size / 2}px`,
//     top: `${position.y - size / 2}px`,
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     color: 'white',
//     fontSize: `${Math.max(12, size / 4)}px`,
//     userSelect: 'none',
//   };

//   return <div style={monsterStyle}>{Math.floor(size)}</div>;
// };

// export default Monster;
