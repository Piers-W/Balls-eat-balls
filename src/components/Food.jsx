import React from 'react';

// 使用箭头函数定义函数组件
const Food = ({ position }) => {
  return (
    <div
      style={{
        position: 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: 'green',
        borderRadius: '50%',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
};

export default Food;
