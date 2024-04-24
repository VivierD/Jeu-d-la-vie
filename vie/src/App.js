import "./App.css";
import React, { useState, useEffect, useCallback, useRef } from "react";
import useInterval from "./useInterval";

const HEIGHT = 35;
const WIDTH = 94;
const positions = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const randomTiles = () => {
  const rows = [];
  for (let i = 0; i < HEIGHT; i++) {
    rows.push(Array.from(Array(WIDTH), () => (Math.random() > 0.7 ? 1 : 0)));
  }
  return rows;
};

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < HEIGHT; i++) {
    rows.push(Array.from(Array(WIDTH), () => 0));
  }
  return rows;
};

const App = () => {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback((grid) => {
    if (!runningRef.current) {
      return;
    }

    let gridCopy = JSON.parse(JSON.stringify(grid));
    for (let i = 0; i < HEIGHT; i++) {
      for (let j = 0; j < WIDTH; j++) {
        let neighbors = 0;

        positions.forEach(([x, y]) => {
          const newI = i + x;
          const newJ = j + y;

          if (newI >= 0 && newI < HEIGHT && newJ >= 0 && newJ < WIDTH) {
            neighbors += grid[newI][newJ];
          }
        });

        if (neighbors < 2 || neighbors > 3) {
          gridCopy[i][j] = 0;
        } else if (grid[i][j] === 0 && neighbors === 3) {
          gridCopy[i][j] = 1;
        }
      }
    }

    setGrid(gridCopy);
    setStep(step + 1);
  }, []);

  useInterval(() => {
    runSimulation(grid);
  }, 500);

  return (
    <div className="container">
    <h1 className="title" >
      JEU DE LA VIE
    </h1>
{/*     <p>
      Itération : {step}
    </p> */}
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${WIDTH}, 20px)`,
        width: "fit-content",
        margin: "0 auto",
        backgroundColor:"#4d4d4d"
      }}
    >
      {grid.map((rows, i) =>
        rows.map((col, k) => (
          <div
            key={`${i}-${k}`}
            onClick={() => {
              let newGrid = JSON.parse(JSON.stringify(grid));
              newGrid[i][k] = grid[i][k] ? 0 : 1;
              setGrid(newGrid);
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: grid[i][k] ? "#965050e1" : undefined,
              border: "1px solid #595959",
            }}
          ></div>
        ))
      )}
    </div>
    <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
          }
        }}
        className="button-27"
      >
        {running ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
          setRunning(false);
        }}
        className="button-27"
      >
        Reset
      </button>
      <button
        onClick={() => {
          setGrid(randomTiles());
          setRunning(false);
        }}
        className="button-27"
      >
        Aléatoire
      </button>
    </div>
  );
};

export default App;
