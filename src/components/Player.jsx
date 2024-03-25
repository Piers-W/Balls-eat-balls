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

  return <div style={style}>{Math.floor(size)}</div>;
});

export default Player;


// import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

// const Player = forwardRef(({ position: initialPosition, size = 10, color, controlKeys, updatePosition, canvasWidth, canvasHeight }, ref) => {
//   const [position, setPosition] = useState(initialPosition);
//   const [moving, setMoving] = useState({ left: false, right: false, up: false, down: false });
//   const animationFrameId = useRef(null);
  
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const direction = controlKeys[event.keyCode];
//       if (direction) {
//         setMoving((m) => ({ ...m, [direction]: true }));
//       }
//     };

//     const handleKeyUp = (event) => {
//       const direction = controlKeys[event.keyCode];
//       if (direction) {
//         setMoving((m) => ({ ...m, [direction]: false }));
//       }
//     };

//     const preventWindowScroll = (event) => {
//       if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
//         event.preventDefault();
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('keyup', handleKeyUp);
//     window.addEventListener('keydown', preventWindowScroll);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('keyup', handleKeyUp);
//       window.removeEventListener('keydown', preventWindowScroll);
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }
//     };
//   }, [controlKeys]);

//   useEffect(() => {
//     const updatePlayerPosition = () => {
//       let newX = Math.max(size / 2, Math.min(canvasWidth - size / 2, position.x + (moving.right - moving.left) * 2));
//       let newY = Math.max(size / 2, Math.min(canvasHeight - size / 2, position.y + (moving.down - moving.up) * 2));
      
//       const newPosition = { x: newX, y: newY };
//       setPosition(newPosition);
//       updatePosition(newPosition);
//       animationFrameId.current = requestAnimationFrame(updatePlayerPosition);
//     };

//     animationFrameId.current = requestAnimationFrame(updatePlayerPosition);

//     return () => {
//       if (animationFrameId.current) {
//         cancelAnimationFrame(animationFrameId.current);
//       }
//     };
//   }, [position, moving, size, canvasWidth, canvasHeight, updatePosition]);

  

//   useImperativeHandle(ref, () => ({
//     resetMovement: () => {
//       setMoving({ left: false, right: false, up: false, down: false });
//     },
//     resetPosition: () => {
//       setPosition(initialPosition);
//     }
//   }));

//   useEffect(() => {
//     setPosition(initialPosition); 
//   }, [initialPosition]);


//   const style = {
//     position: 'absolute',
//     width: `${size}px`,
//     height: `${size}px`,
//     backgroundColor: color,
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

//   return (
//     <div style={style}>
//       {Math.floor(size)}
//     </div>
//   );
// });

// export default Player;
