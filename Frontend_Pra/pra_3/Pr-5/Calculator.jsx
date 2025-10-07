import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleClick = (value) => {
    if (value === '=') {
      try {
        const evalResult = eval(input);
        setResult(evalResult);
      } catch {
        setResult('Error');
      }
    } else if (value === 'DEL') {
      setInput(input.slice(0, -1));
    } else {
      setInput(input + value);
    }
  };

  const rows = [
    ['/', '*', '+', '-', 'DEL'],
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['0', '.', '='],
  ];

  return (
    <div className="calculator">
      <div className="display">
        <div className="result">({result || 0})</div>
        <div className="input">{input || 0}</div>
      </div>
      <div className="buttons">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={`button-row ${row.length === 5 ? 'row-5' : 'row-3'}`}>
            {row.map((btn, idx) => (
              <button key={idx} onClick={() => handleClick(btn)}>{btn}</button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calculator;
