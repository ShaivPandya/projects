import React, { useCallback, useRef, useState } from "react";
import produce from "immer";

const numRows = 20;
const numCols = 20;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [-1, -1],
  [1, 1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    // Generate an array with all zeroes
    // Zero represents a dead cell and 1 represents a live cell
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const App: React.FC = () => {
  // The values will be changing constantly so the grid state will be stored in a useState hook
  // Function only runs once whenever it initializes the state
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGrid((currentGrid) => {
      return produce(currentGrid, (gridCopy) => {
        // Go through every cell in the current grid
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            // Compute the number of neighbors
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              // Make sure that it doesn't go out of bounds (for edge squares)
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += currentGrid[newI][newK];
              }
            });

            // Check conditions
            // mutating gridCopy, the produce functions is going to generate a new grid and update the setGrid value
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (currentGrid[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });
    setTimeout(runSimulation, 500);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}>
        {running ? "stop" : "start"}
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}>
        Clear
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}>
        Random
      </button>
      <button
        onClick={() => {
          // Create a blinker oscillating pattern
          const newGrid = produce(grid, (gridCopy) => {
            gridCopy[9][9] = 1;
            gridCopy[9][10] = 1;
            gridCopy[9][11] = 1;
          });
          setGrid(newGrid);
        }}>
        Blinker
      </button>
      <button
        onClick={() => {
          // Create a beacon oscillating pattern
          const newGrid = produce(grid, (gridCopy) => {
            gridCopy[8][10] = 1;
            gridCopy[8][11] = 1;
            gridCopy[8][12] = 1;
            gridCopy[9][9] = 1;
            gridCopy[9][10] = 1;
            gridCopy[9][11] = 1;
          });
          setGrid(newGrid);
        }}>
        Beacon
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              // Use index as key since the divs are never going to be shifted
              key={`${i}-${k}`}
              onClick={() => {
                // Instead of mutating the state, use produce from immer
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1; // Allows you to toggle between alive and dead
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? "black" : undefined, // Filled in black if alive, empty otherwise
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
};

export default App;
