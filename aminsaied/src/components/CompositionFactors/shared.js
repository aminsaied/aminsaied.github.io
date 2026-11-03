import React, {createContext, useContext, useState} from 'react';
import styles from './styles.module.css';

export const initialPair = {lambda: [2, 2, 1], mu: [1, 1]};
export const size = (partition) => partition.reduce((total, part) => total + part, 0);
export const notation = (partition) => `(${partition.join(', ')})`;
export const liePieces = [
  [1], [1, 1], [2, 1], [3, 1], [2, 1, 1],
  [4, 1], [3, 2], [3, 1, 1], [2, 2, 1], [2, 1, 1, 1],
];
export const paperAssemblyIndex = 1;
export const puzzleAssemblies = [
  {pieceIds: [1, 3], result: [[4, 1], [3, 2], [3, 1, 1], [2, 2, 1]]},
  {pieceIds: [2, 1], result: [[3, 2], [2, 2, 1], [2, 1, 1, 1], [1, 1, 1, 1, 1]]},
];
const StoryContext = createContext(null);

export function YoungDiagram({partition, originalFirstRow = partition[0]}) {
  return (
    <svg
      className={styles.young}
      width={partition[0] * 18}
      height={partition.length * 18}
      viewBox={`0 0 ${partition[0] * 18} ${partition.length * 18}`}
      role="img"
      aria-label={`Young diagram ${notation(partition)}, ${size(partition)} boxes`}
    >
      {partition.flatMap((length, row) =>
        Array.from({length}, (_, column) => (
          <rect
            key={`${row}-${column}`}
            x={column * 18 + 1}
            y={row * 18 + 1}
            width="15"
            height="15"
            rx="1"
            className={row === 0 && column >= originalFirstRow ? styles.addedBox : styles.box}
          />
        )),
      )}
    </svg>
  );
}

export function CompositionProvider({children}) {
  const [pair, setPair] = useState(initialPair);
  return <StoryContext.Provider value={{pair, setPair}}>{children}</StoryContext.Provider>;
}

export function useStory() {
  const story = useContext(StoryContext);
  if (!story) {
    throw new Error('Composition figures must be inside CompositionProvider.');
  }
  return story;
}

const headings = {
  baseline: {number: '01', title: 'Through degree 5'},
  atlas: {number: '02', title: 'The expanded coefficient matrix'},
  puzzle: {number: '03', title: 'Shape analysis'},
  stability: {number: '04', title: 'Diagonal stabilization'},
};

export function FigureHeader({kind, children}) {
  const {number, title} = headings[kind];
  return (
    <header className={styles.figureHeader}>
      <p className={styles.eyebrow}>Figure {number} / coefficient computation</p>
      <h3>{title}</h3>
      <p>{children}</p>
    </header>
  );
}
