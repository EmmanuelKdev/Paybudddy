// src/Loading.tsx
import React from 'react';
import './ComponentCss.css';


const Loading: React.FC = () => {
  return (
    <div className="spinner">
      <div className="double-bounce1"></div>
      <div className="double-bounce2"></div>
    </div>
  );
};

export default Loading;
