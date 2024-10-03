// src/App.tsx
import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* Cabeçalho */}
      <header className="App-header">
        <h1>FaceClass</h1>
      </header>

      {/* Botão central */}
      <div className="content">
        <button className="register-button">REGISTRAR PRESENÇA</button>
      </div>
    </div>
  );
}

export default App;