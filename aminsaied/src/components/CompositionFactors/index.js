import React, {lazy, Suspense, useEffect, useRef, useState} from 'react';
import ErrorBoundary from '@docusaurus/ErrorBoundary';
import baseline from './degree-five.json';
import {
  FigureHeader, liePieces, notation, paperAssemblyIndex, puzzleAssemblies, size, YoungDiagram,
} from './shared';
import styles from './styles.module.css';

export {CompositionProvider} from './shared';

export function DegreeFiveMatrix() {
  const count = baseline.partitions.length;
  const cell = 24;
  const margin = 32;
  const extent = count * cell;
  const degrees = baseline.partitions.map((partition) => partition.reduce((sum, part) => sum + part, 0));
  const groups = Array.from({length: 5}, (_, i) => ({
    degree: i + 1,
    start: degrees.indexOf(i + 1),
    end: degrees.lastIndexOf(i + 1) + 1,
  }));

  return (
    <figure className={styles.figure} data-composition-figure="baseline">
      <FigureHeader kind="baseline">
        18 partitions on each axis, grouped by degree.
      </FigureHeader>
      <svg
        className={styles.baselineMatrix}
        viewBox={`0 0 ${extent + margin + 4} ${extent + margin + 4}`}
        role="img"
        aria-label="Coefficient matrix through degree 5. Diagonal entries are 1; entries above the diagonal are 0. Nonzero entries below the diagonal range from 1 to 4."
      >
        <text x="15" y="15">&lambda;/&mu;</text>
        {groups.map(({degree, start, end}) => (
          <g key={degree}>
            <text x={margin + (start + end) * cell / 2} y="15">{degree}</text>
            <text x="15" y={margin + (start + end) * cell / 2}>{degree}</text>
          </g>
        ))}
        <rect x={margin} y={margin} width={extent} height={extent} className={styles.baselineBackground} />
        <path
          className={styles.baselineGrid}
          d={Array.from({length: count + 1}, (_, i) => {
            const offset = margin + i * cell;
            return `M${margin},${offset}h${extent}M${offset},${margin}v${extent}`;
          }).join(' ')}
        />
        {baseline.matrix.flatMap((row, rowIndex) => row.map((value, columnIndex) => value ? (
          <g
            key={`${rowIndex}-${columnIndex}`}
            className={rowIndex === columnIndex ? styles.baselineDiagonal : styles.baselineCell}
            data-coefficient={`${rowIndex},${columnIndex},${value}`}
          >
            <rect
              x={margin + columnIndex * cell + 1}
              y={margin + rowIndex * cell + 1}
              width={cell - 2}
              height={cell - 2}
            />
            <text x={margin + (columnIndex + 0.5) * cell} y={margin + (rowIndex + 0.5) * cell}>
              {value}
            </text>
          </g>
        ) : null))}
      </svg>
      <figcaption className={styles.caption}>
        Rose marks the diagonal; green marks nonzero entries below it. Blank cells are zero.
        Within each degree, partitions are ordered reverse lexicographically.
      </figcaption>
    </figure>
  );
}

function PuzzlePartition({partition, className = '', label = notation(partition)}) {
  return (
    <div className={`${styles.puzzlePartition} ${className}`}>
      <YoungDiagram partition={partition} />
      <span>{label}</span>
    </div>
  );
}

function PuzzleDegreeCalculation({decomposition, pieceIds, target, label}) {
  const total = decomposition.reduce(
    (sum, part, i) => sum + size(part) * size(liePieces[pieceIds[i] - 1]), 0,
  );
  return (
    <div
      className={styles.puzzleDegreeCheck}
      data-degree-total={total}
      data-degree-compatible={total === target}
    >
      <p className={styles.puzzleNote}>{label}</p>
      <p className={styles.puzzleDegreeEquation}>
        {pieceIds.map((id, i) => (
          <React.Fragment key={id}>
            {i > 0 && <span>+</span>}
            <span className={styles.puzzleDegreeTerm} data-lie-piece={id}>
              <span>{size(decomposition[i])}</span>
              <span>&times;</span>
              <strong>{size(liePieces[id - 1])}</strong>
            </span>
          </React.Fragment>
        ))}
        <span>=</span>
        <strong className={styles.puzzleDegreeTotal}>{total}</strong>
      </p>
      <p className={styles.puzzleDegreeStatus}>
        {total === target ? 'Degree-compatible' : `Reject for degree ${target}`}
      </p>
    </div>
  );
}

export function DecompositionPuzzleCartoon({children}) {
  const decomposition = [[2], [1]];
  const {pieceIds, result} = puzzleAssemblies[paperAssemblyIndex];
  const target = [3, 2];
  return (
    <figure
      id="decomposition-puzzle-cartoon"
      className={`${styles.figure} ${styles.puzzleCartoon}`}
      data-composition-figure="cartoon"
      aria-label="An example decomposition puzzle"
    >
      <div className={styles.puzzleBankHeader}>
        <h3>Lie pieces</h3>
        <span>The building blocks through degree 5</span>
      </div>
      <div className={styles.puzzleBankGrid} role="list" aria-label="Lie pieces through degree 5">
        {liePieces.map((piece, i) => (
          <div
            key={piece.join(',')}
            role="listitem"
            className={`${styles.puzzleBankPiece} ${styles.puzzleLie}`}
            data-lie-catalogue-piece={piece.join(',')}
            data-lie-piece={i + 1}
            data-selected={pieceIds.includes(i + 1) ? 'true' : undefined}
          >
            <span><var>&#8467;</var><sub>{i + 1}</sub></span>
            <YoungDiagram partition={piece} />
            <span>degree {size(piece)}</span>
          </div>
        ))}
      </div>
      <div className={styles.puzzleStrip}>
        <div className={styles.puzzleStep} data-puzzle-step="decompose">
          <h3>Decompose</h3>
          <PuzzlePartition
            partition={[2, 1]}
            className={styles.puzzleSource}
            label={<>&mu; = (2, 1)</>}
          />
          <span className={styles.puzzleSplitArrow} aria-hidden="true">&darr;</span>
          <div className={styles.puzzleParts}>
            <PuzzlePartition partition={decomposition[0]} />
            <PuzzlePartition partition={decomposition[1]} />
          </div>
        </div>
        <span className={styles.puzzleArrow} aria-hidden="true">&rarr;</span>
        <div className={styles.puzzleStep} data-puzzle-step="pair">
          <h3>Pair</h3>
          <div className={styles.puzzlePairLabels}><span>Part</span><span>Lie piece</span></div>
          {pieceIds.map((id, i) => (
            <React.Fragment key={id}>
              {i > 0 && <span className={styles.puzzleTensor} aria-hidden="true">&#8855;</span>}
              <div
                className={styles.puzzlePair}
                data-puzzle-pair={`${decomposition[i].join(',')}|${liePieces[id - 1].join(',')}`}
                data-lie-piece={id}
                role="group"
                aria-label={`Part ${notation(decomposition[i])} paired with Lie piece ${id}, ${notation(liePieces[id - 1])}`}
              >
                <PuzzlePartition partition={decomposition[i]} />
                <span className={styles.puzzleLink} aria-hidden="true"><span>&#8857;</span></span>
                <PuzzlePartition
                  partition={liePieces[id - 1]}
                  className={styles.puzzleLie}
                  label={<><var>&#8467;</var><sub>{id}</sub></>}
                />
              </div>
            </React.Fragment>
          ))}
          <p className={styles.puzzleNote}>&#8857; plethysm; &#8855; tensor product</p>
        </div>
        <span className={`${styles.puzzleArrow} ${styles.puzzleDegreeArrow}`} aria-hidden="true">&rarr;</span>
        <div className={styles.puzzleStep} data-puzzle-step="degree">
          <h3>Check the degree</h3>
          <PuzzleDegreeCalculation
            decomposition={decomposition}
            pieceIds={pieceIds}
            target={size(target)}
            label="Selected pairing"
          />
          <PuzzleDegreeCalculation
            decomposition={decomposition}
            pieceIds={[...pieceIds].reverse()}
            target={size(target)}
            label="Swap the Lie pieces"
          />
        </div>
      </div>
      <div className={styles.puzzleAssembly} data-puzzle-step="assemble">
        <div className={styles.puzzleStep}>
          <h3>Assemble</h3>
          <p className={styles.puzzleNote}>
            Evaluate the plethysms and tensor product for the surviving pairing.
            Each shape appears once.
          </p>
        </div>
        <div className={styles.puzzleOutputs}>
          {result.map((partition) => {
            const isTarget = partition.join(',') === target.join(',');
            return (
              <div
                key={partition.join(',')}
                className={styles.puzzleOutcome}
                data-puzzle-output={partition.join(',')}
                data-puzzle-target={isTarget ? 'true' : undefined}
              >
                <PuzzlePartition partition={partition} />
                {isTarget && <span className={styles.puzzleTargetLabel}>target</span>}
              </div>
            );
          })}
        </div>
      </div>
      <figcaption className={`${styles.caption} ${styles.puzzleCaption}`}>{children}</figcaption>
    </figure>
  );
}

const loadFigures = () => import(/* webpackChunkName: "composition-figures" */ './Figures');
const components = {
  atlas: lazy(() => loadFigures().then((module) => ({default: module.CoefficientAtlas}))),
  puzzle: lazy(() => loadFigures().then((module) => ({default: module.ShapeAnalysis}))),
  stability: lazy(() => loadFigures().then((module) => ({default: module.StabilityExplorer}))),
  download: lazy(() => loadFigures().then((module) => ({default: module.DataDownload}))),
};

function LoadingContent({kind}) {
  const noScript = <noscript>Enable JavaScript to use this interactive content.</noscript>;
  if (kind === 'download') {
    return (
      <div aria-busy="true">
        <button type="button" className={`${styles.button} ${styles.download}`} disabled>
          Download the exact coefficient table <span>Loading / JSON</span>
        </button>
        {noScript}
      </div>
    );
  }
  return (
    <figure
      className={`${styles.figure} ${styles.pendingFigure}`}
      data-composition-figure={kind}
      aria-busy="true"
    >
      <FigureHeader kind={kind}>
        This interactive figure loads as it approaches the screen.
      </FigureHeader>
      <p className={styles.loadingMessage} role="status">Preparing interactive figure...</p>
      {noScript}
    </figure>
  );
}

function LoadingError() {
  return (
    <div className={styles.loadingError} role="alert">
      <p>This interactive content could not be loaded. Reload the page to try again.</p>
      <button type="button" className={styles.button} onClick={() => window.location.reload()}>
        Reload page
      </button>
    </div>
  );
}

function DeferredContent({kind, id}) {
  const container = useRef(null);
  const [visible, setVisible] = useState(false);
  const Content = components[kind];
  const fallback = <LoadingContent kind={kind} />;

  useEffect(() => {
    if (typeof IntersectionObserver !== 'function') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setVisible(true);
        observer.disconnect();
      }
    }, {rootMargin: '600px 0px'});
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={container} id={id} className={styles.deferred} data-composition-loader={kind}>
      <ErrorBoundary fallback={() => <LoadingError />}>
        <Suspense fallback={fallback}>
          {visible ? <Content /> : fallback}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export function CoefficientAtlas() {
  return <DeferredContent kind="atlas" />;
}

export function ShapeAnalysis() {
  return <DeferredContent kind="puzzle" />;
}

export function StabilityExplorer() {
  return <DeferredContent kind="stability" id="stability-lab" />;
}

export function DataDownload() {
  return <DeferredContent kind="download" />;
}
