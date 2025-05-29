import React from 'react';
import './App.css';
import QueueCalculator from './components/QueueCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Calculadora de Fila M/M/1</h1>
      </header>
      <main>
        <QueueCalculator />
      </main>
    </div>
  );
}

export default App;