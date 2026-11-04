import React, {useEffect, useId, useRef, useState} from 'react';
import {useColorMode} from '@docusaurus/theme-common';
import data from './coefficients.json';
import {
  FigureHeader, initialPair, liePieces, notation, paperAssemblyIndex,
  puzzleAssemblies, size, useStory, YoungDiagram,
} from './shared';
import styles from './styles.module.css';

const parts = data.partitions;
const indices = new Map(parts.map((partition, i) => [partition.join(','), i]));
const ends = Array.from({length: data.degree + 1}, (_, degree) =>
  parts.filter((partition) => size(partition) <= degree).length,
);
const maximum = Math.max(...data.matrix.map((row) => Math.max(...row)));
const format = new Intl.NumberFormat('en-US');
const axisFormat = new Intl.NumberFormat('en-US', {notation: 'compact', maximumFractionDigits: 1});
const grow = (partition, n) => [partition[0] + n, ...partition.slice(1)];

function coefficient(lambda, mu) {
  const row = indices.get(lambda.join(','));
  const column = indices.get(mu.join(','));
  if (row === undefined || column === undefined) {
    throw new Error('The requested partition is outside the coefficient dataset.');
  }
  return data.matrix[row][column];
}

function PartitionCard({label, partition, originalFirstRow}) {
  return (
    <div className={styles.partitionCard}>
      <div className={styles.partitionLabel}>{label} <span>{notation(partition)}</span></div>
      <YoungDiagram partition={partition} originalFirstRow={originalFirstRow} />
    </div>
  );
}

function matrixColor(value, presence, dark) {
  if (!value) return dark ? [37, 44, 39] : [244, 241, 234];
  const low = dark ? [63, 104, 96] : [176, 213, 202];
  const high = dark ? [177, 229, 200] : [18, 74, 66];
  const amount = presence ? 0.7 : Math.log1p(value) / Math.log1p(maximum);
  return low.map((channel, i) => Math.round(channel + (high[i] - channel) * amount));
}

function Matrix({rowStart, rowEnd, columnStart, columnEnd, selected, onSelect, presence, showDegreeGuides, descriptionId}) {
  const canvas = useRef(null);
  const [available, setAvailable] = useState(true);
  const {colorMode} = useColorMode();
  const rows = rowEnd - rowStart;
  const columns = columnEnd - columnStart;

  useEffect(() => {
    const context = canvas.current?.getContext('2d');
    if (!context) {
      setAvailable(false);
      return;
    }
    const image = context.createImageData(columns, rows);
    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const rgb = matrixColor(
          data.matrix[row + rowStart][column + columnStart],
          presence,
          colorMode === 'dark',
        );
        const offset = (row * columns + column) * 4;
        image.data.set([...rgb, 255], offset);
      }
    }
    context.putImageData(image, 0, 0);
  }, [rowStart, columnStart, rows, columns, presence, colorMode]);

  function selectAtPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const row = Math.min(rows - 1, Math.floor((event.clientY - bounds.top) / bounds.height * rows));
    const column = Math.min(columns - 1, Math.floor((event.clientX - bounds.left) / bounds.width * columns));
    onSelect([rowStart + Math.max(0, row), columnStart + Math.max(0, column)]);
    canvas.current.focus();
  }

  function navigate(event) {
    const changes = {
      ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowLeft: [0, -1],
    };
    const change = changes[event.key];
    if (!change) return;
    event.preventDefault();
    onSelect([
      Math.max(rowStart, Math.min(rowEnd - 1, selected[0] + change[0])),
      Math.max(columnStart, Math.min(columnEnd - 1, selected[1] + change[1])),
    ]);
  }

  return (
    <>
      <div className={styles.matrixFrame}>
        <canvas
          ref={canvas}
          width={columns}
          height={rows}
          tabIndex={0}
          role="img"
          aria-label={`Coefficient matrix: ${rows} target partitions by ${columns} source partitions. Use arrow keys to select a cell.`}
          aria-describedby={descriptionId}
          onClick={selectAtPointer}
          onKeyDown={navigate}
        >
          Use the partition selectors to read exact coefficients.
        </canvas>
        {showDegreeGuides && (
          <svg
            className={styles.matrixDegreeGuides}
            viewBox={`0 0 ${columns} ${rows}`}
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
            data-degree-guides="true"
          >
            {ends.map((boundary, degree) => (
              <React.Fragment key={degree}>
                {boundary > rowStart && boundary < rowEnd && (
                  <line
                    data-axis="target"
                    data-degree-start={degree + 1}
                    x1="0"
                    x2={columns}
                    y1={boundary - rowStart}
                    y2={boundary - rowStart}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
                {boundary > columnStart && boundary < columnEnd && (
                  <line
                    data-axis="source"
                    data-degree-start={degree + 1}
                    x1={boundary - columnStart}
                    x2={boundary - columnStart}
                    y1="0"
                    y2={rows}
                    vectorEffect="non-scaling-stroke"
                  />
                )}
              </React.Fragment>
            ))}
          </svg>
        )}
        <span
          className={styles.matrixSelection}
          aria-hidden="true"
          style={{
            left: `${(selected[1] - columnStart + 0.5) / columns * 100}%`,
            top: `${(selected[0] - rowStart + 0.5) / rows * 100}%`,
          }}
        />
      </div>
      {!available && <p className={styles.hint} role="status">Canvas is unavailable in this browser. The partition selectors below still expose every exact value.</p>}
    </>
  );
}

function PartitionSelect({label, value, limit, onChange}) {
  return (
    <label className={styles.selectLabel}>
      {label}
      <select value={value} onChange={(event) => onChange(Number(event.target.value))}>
        {Array.from({length: limit}, (_, i) => i + 1).map((degree) => (
          <optgroup key={degree} label={`Degree ${degree}`}>
            {parts.slice(ends[degree - 1], ends[degree]).map((partition, i) => (
              <option key={partition.join(',')} value={ends[degree - 1] + i}>
                {notation(partition)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}

export function CoefficientAtlas() {
  const {setPair} = useStory();
  const descriptionId = useId();
  const [degree, setDegree] = useState(data.degree);
  const [selected, setSelected] = useState([
    indices.get(initialPair.lambda.join(',')), indices.get(initialPair.mu.join(',')),
  ]);
  const [zoomed, setZoomed] = useState(false);
  const [presence, setPresence] = useState(false);
  const [showDegreeGuides, setShowDegreeGuides] = useState(false);
  const lambda = parts[selected[0]];
  const mu = parts[selected[1]];
  const lambdaSize = size(lambda);
  const muSize = size(mu);
  const limit = ends[degree];
  const rowStart = zoomed ? ends[lambdaSize - 1] : 0;
  const rowEnd = zoomed ? ends[lambdaSize] : limit;
  const columnStart = zoomed ? ends[muSize - 1] : 0;
  const columnEnd = zoomed ? ends[muSize] : limit;
  const ticks = degree <= 7
    ? Array.from({length: degree}, (_, i) => i + 1)
    : [5, 8, 10, 11, 12, 13, 14].filter((tick) => tick <= degree);

  function changeDegree(next) {
    setDegree(next);
    setSelected(([row, column]) => [
      Math.min(row, ends[next] - 1), Math.min(column, ends[next] - 1),
    ]);
  }

  return (
    <figure className={styles.figure} data-composition-figure="atlas">
      <FigureHeader kind="atlas">
        The entry in row &lambda; and column &mu; is the multiplicity <var>c</var><sub>&lambda;&mu;</sub>.
        Compare the truncations through degrees 5 and 14.
      </FigureHeader>
      <div className={styles.atlasControls}>
        <label className={styles.rangeLabel}>
          <span>Maximum degree <strong>{degree}</strong></span>
          <input
            aria-label="Maximum coefficient degree"
            type="range"
            min="5"
            max="14"
            value={degree}
            onChange={(event) => changeDegree(Number(event.target.value))}
          />
          <span className={styles.rangeEnds}><span>5 / original baseline</span><span>14 / paper</span></span>
        </label>
        <div className={styles.entryCount}>
          <strong>{format.format(limit ** 2)}</strong>
          <span>matrix entries</span>
        </div>
      </div>
      <div className={styles.atlasLayout}>
        <div>
          <div className={styles.matrixAxes}>
            <span className={styles.axisCorner} aria-hidden="true">&lambda; / &mu;</span>
            <div className={styles.axisTop} aria-hidden="true">
              {zoomed ? <span className={styles.blockAxis}>source size {muSize}</span> : ticks.map((tick) => (
                <span key={tick} style={{left: `${ends[tick - 1] / limit * 100}%`}}>{tick}</span>
              ))}
            </div>
            <div className={styles.axisSide} aria-hidden="true">
              {zoomed ? <span style={{top: '50%'}}>{lambdaSize}</span> : ticks.map((tick) => (
                <span key={tick} style={{top: `${ends[tick - 1] / limit * 100}%`}}>{tick}</span>
              ))}
            </div>
            <div>
              <Matrix
                rowStart={rowStart}
                rowEnd={rowEnd}
                columnStart={columnStart}
                columnEnd={columnEnd}
                selected={selected}
                onSelect={setSelected}
                presence={presence}
                showDegreeGuides={showDegreeGuides && !zoomed}
                descriptionId={descriptionId}
              />
            </div>
          </div>
          <p id={descriptionId} className={styles.hint}>
            Select a cell, use the arrow keys, or choose partitions below. Uncolored cells are zero.
          </p>
          <div className={styles.legend}>
            <span className={styles.zeroSwatch} /> zero
            <span className={presence ? styles.solidSwatch : styles.gradientSwatch} />
            {presence ? 'nonzero' : `1 to ${format.format(maximum)} / logarithmic color`}
          </div>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={showDegreeGuides}
              disabled={zoomed}
              onChange={(event) => setShowDegreeGuides(event.target.checked)}
            />
            Show degree boundaries{zoomed && ' (full matrix)'}
          </label>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={presence} onChange={(event) => setPresence(event.target.checked)} />
            Show only zero versus nonzero
          </label>
        </div>
        <div className={styles.inspector}>
          <p className={styles.eyebrow}>Selected coefficient</p>
          <output className={styles.coefficient} aria-live="polite" aria-atomic="true">
            <span><var>c</var><sub>&lambda;&mu;</sub> = </span>
            <strong>{format.format(coefficient(lambda, mu))}</strong>
            <span className={styles.srOnly}> for lambda {notation(lambda)} and mu {notation(mu)}</span>
          </output>
          <PartitionCard label={<>Target &lambda;</>} partition={lambda} />
          <PartitionCard label={<>Source &mu;</>} partition={mu} />
          <button type="button" className={styles.button} aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)}>
            {zoomed ? 'Show the full matrix' : 'Zoom into this block'}
          </button>
          <a className={styles.followLink} href="#stability-lab" onClick={() => setPair({lambda, mu})}>
            Follow this pair below <span aria-hidden="true">&darr;</span>
          </a>
        </div>
      </div>
      <div className={styles.selectors}>
        <PartitionSelect label={<>Target partition &lambda;</>} limit={degree} value={selected[0]} onChange={(row) => setSelected([row, selected[1]])} />
        <PartitionSelect label={<>Source partition &mu;</>} limit={degree} value={selected[1]} onChange={(column) => setSelected([selected[0], column])} />
      </div>
      <figcaption className={styles.caption}>
        {zoomed
          ? `This block has target size ${lambdaSize} and source size ${muSize}. `
          : 'Rows are target partitions; columns are source partitions. Axis labels mark the start of each degree. '}
        Partitions are grouped by size, then ordered reverse lexicographically. The color scale stays fixed as you explore.
      </figcaption>
    </figure>
  );
}

const stages = [
  {label: 'All pairings', count: 90, detail: 'There are 10 Lie pieces through degree 5. Choosing two distinct pieces in order gives 10 x 9 = 90 candidate pairings.'},
  {label: 'Bound the pieces', count: 6, detail: 'A Lie piece of degree 4 or higher forces the output degree to be at least 6. The degree-3 truncation contains three pieces, giving 3 x 2 = 6 ordered pairings.'},
  {label: 'Match the degree', count: 2, detail: 'The constraint 2r\u2081 + r\u2082 = 5 leaves two admissible pairings. Plethysms and tensor products are evaluated only for these instructions.'},
];
export function ShapeAnalysis() {
  const [stage, setStage] = useState(0);
  const [assembly, setAssembly] = useState(paperAssemblyIndex);
  const current = stages[stage];
  const chosen = puzzleAssemblies[assembly];
  const [firstPiece, secondPiece] = chosen.pieceIds.map((id) => liePieces[id - 1]);
  const gridTitle = useId();
  return (
    <figure className={styles.figure} data-composition-figure="puzzle">
      <FigureHeader kind="puzzle">
        Fix the decomposition of &mu; = (2, 1) into (2) and (1), with target degree 5.
        Its shape is (2, 1).
      </FigureHeader>
      <div className={styles.decomposition}>
        <YoungDiagram partition={[2, 1]} />
        <span aria-hidden="true">&rarr;</span>
        <YoungDiagram partition={[2]} />
        <span>and</span>
        <YoungDiagram partition={[1]} />
        <span className={styles.shapeLabel}>shape <strong>(2, 1)</strong></span>
      </div>
      <div className={styles.steps} role="group" aria-label="Shape analysis steps">
        {stages.map((item, i) => (
          <button key={item.label} type="button" aria-pressed={stage === i} onClick={() => setStage(i)}>
            <span className={styles.stepNumber}>0{i + 1}</span> {item.label}
          </button>
        ))}
      </div>
      <div className={styles.pruningLayout}>
        <svg className={styles.pairingGrid} viewBox="0 0 260 260" role="img" aria-labelledby={gridTitle}>
          <title id={gridTitle}>{current.count} surviving ordered pairings out of 90. Rows choose the first Lie piece and columns the second.</title>
          {liePieces.map((piece, i) => (
            <React.Fragment key={`label-${i}`}>
              <text x={36 + i * 22} y="14" textAnchor="middle">{i + 1}</text>
              <text x="12" y={40 + i * 22} textAnchor="middle">{i + 1}</text>
            </React.Fragment>
          ))}
          {liePieces.flatMap((first, i) => liePieces.map((second, j) => {
            const distinct = i !== j;
            const bounded = size(first) <= 3 && size(second) <= 3;
            const rightDegree = size(first) * 2 + size(second) === 5;
            const active = distinct && (stage < 1 || bounded) && (stage < 2 || rightDegree);
            return (
              <rect
                key={`${i}-${j}`}
                x={26 + j * 22}
                y={26 + i * 22}
                width="18"
                height="18"
                rx="2"
                className={active ? (stage === 2 ? styles.survivor : styles.candidate) : styles.pruned}
              >
                <title>{`Piece ${i + 1} ${notation(first)} and piece ${j + 1} ${notation(second)}: ${distinct ? `output size ${2 * size(first) + size(second)}` : 'cannot reuse the same piece'}`}</title>
              </rect>
            );
          }))}
        </svg>
        <div className={styles.pruningCopy} aria-live="polite" aria-atomic="true">
          <p className={styles.pruningCount}><strong>{current.count}</strong><span> / 90</span></p>
          <p className={styles.eyebrow}>candidate pairings remain</p>
          <p>{current.detail}</p>
          <p className={styles.degreeEquation}>2 &times; <var>r</var><sub>1</sub> + <var>r</var><sub>2</sub> = 5</p>
        </div>
      </div>
      <details className={styles.exactValues}>
        <summary>See the ten Lie pieces used in this example</summary>
        <div className={styles.pieceCatalogue}>
          {liePieces.map((partition, i) => (
            <div key={i}>
              <span>Piece {i + 1} / degree {size(partition)}</span>
              <YoungDiagram partition={partition} />
            </div>
          ))}
        </div>
        <p className={styles.hint}>
          Each of these occurs once through degree 5. In higher degrees, a diagram can occur
          with multiplicity; its separate occurrences are separate Lie pieces.
        </p>
      </details>
      {stage === 2 && (
        <div className={styles.assembly}>
          <div className={styles.assemblyHeading}>
            <span>Choose Lie-piece degrees (<var>r</var><sub>1</sub>, <var>r</var><sub>2</sub>)</span>
            <div className={styles.smallButtons} role="group" aria-label="Lie-piece degrees for the assembly pairing">
              {puzzleAssemblies.map((item, i) => (
                <button key={i} type="button" aria-pressed={assembly === i} onClick={() => setAssembly(i)}>
                  ({item.pieceIds.map((id) => size(liePieces[id - 1])).join(', ')})
                </button>
              ))}
            </div>
          </div>
          <div className={styles.assemblyInput}>
            <span>(</span><YoungDiagram partition={[2]} /><span>&#8857;</span>
            <YoungDiagram partition={firstPiece} /><span>) &otimes; (</span>
            <YoungDiagram partition={[1]} /><span>&#8857;</span>
            <YoungDiagram partition={secondPiece} /><span>)</span>
          </div>
          <p className={styles.hint}>Plethysm within each pair, then tensor product. The output is:</p>
          <div className={styles.assemblyOutput}>
            {chosen.result.map((partition, i) => (
              <React.Fragment key={partition.join(',')}>
                {i > 0 && <span aria-hidden="true">&oplus;</span>}
                <div className={partition.join(',') === '3,2' ? styles.highlightedTerm : styles.term}>
                  <YoungDiagram partition={partition} />
                  <span>{notation(partition)}</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className={styles.hint}>
            Each term here has multiplicity one. The highlighted target (3, 2) occurs in both assemblies.
          </p>
        </div>
      )}
      <figcaption className={styles.caption}>
        Rows and columns index the 10 Lie pieces through degree 5; diagonal cells would reuse the same piece.
        The values give the candidate counts for this example.
        Instruction counts are distinct from the weighted multiplicities.
      </figcaption>
    </figure>
  );
}

const presets = [
  {label: '2, 11, 14, ...', pair: initialPair},
  {label: '21, 26, 26, ...', pair: {lambda: [4, 2, 1], mu: [2, 1]}},
  {label: 'Already constant', pair: {lambda: [3, 2], mu: [2, 1]}},
];

export function StabilityExplorer() {
  const {pair, setPair} = useStory();
  const [requestedStep, setRequestedStep] = useState(0);
  const key = `${pair.lambda.join(',')}/${pair.mu.join(',')}`;
  useEffect(() => setRequestedStep(0), [key]);
  const length = data.degree - Math.max(size(pair.lambda), size(pair.mu)) + 1;
  const values = Array.from({length}, (_, r) => coefficient(grow(pair.lambda, r), grow(pair.mu, r)));
  const step = Math.min(requestedStep, length - 1);
  const lambda = grow(pair.lambda, step);
  const mu = grow(pair.mu, step);
  const titleId = useId();
  const ceiling = Math.max(4, Math.ceil(Math.max(...values) / 4) * 4);
  const x = (r) => 52 + r / Math.max(1, length - 1) * 536;
  const y = (value) => 216 - value / ceiling * 178;
  const points = values.map((value, r) => `${x(r)},${y(value)}`).join(' ');
  const area = `M ${x(0)} 216 L ${points.replaceAll(' ', ' L ')} L ${x(length - 1)} 216 Z`;

  return (
    <figure className={styles.figure} data-composition-figure="stability">
      <FigureHeader kind="stability">
        Simultaneous first-row augmentation of the indexing partitions.
        Added boxes are shown in rose.
      </FigureHeader>
      <div className={styles.presetButtons} role="group" aria-label="Stability examples">
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            aria-pressed={key === `${preset.pair.lambda.join(',')}/${preset.pair.mu.join(',')}`}
            onClick={() => setPair(preset.pair)}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <div className={styles.growingPair}>
        <PartitionCard label={<>Target &lambda;<sup>+{step}</sup></>} partition={lambda} originalFirstRow={pair.lambda[0]} />
        <PartitionCard label={<>Source &mu;<sup>+{step}</sup></>} partition={mu} originalFirstRow={pair.mu[0]} />
        <output className={styles.stabilityValue} aria-live="polite" aria-atomic="true">
          <span>coefficient</span><strong>{format.format(values[step])}</strong>
          <span className={styles.srOnly}>after adding {step} boxes to each first row</span>
        </output>
      </div>
      <svg className={styles.linePlot} viewBox="0 0 620 260" role="group" aria-labelledby={titleId}>
        <title id={titleId}>{`Computed coefficients as boxes are added: ${values.join(', ')}. Select a point or use the slider.`}</title>
        {[0, 1, 2, 3, 4].map((tick) => (
          <g key={tick}>
            <line x1="52" x2="588" y1={y(ceiling * tick / 4)} y2={y(ceiling * tick / 4)} className={styles.gridLine} />
            <text x="42" y={y(ceiling * tick / 4) + 4} textAnchor="end">{axisFormat.format(ceiling * tick / 4)}</text>
          </g>
        ))}
        <path d={area} className={styles.area} />
        <polyline points={points} className={styles.trace} />
        <line x1={x(step)} x2={x(step)} y1="30" y2="216" className={styles.guide} />
        {values.map((value, r) => (
          <g key={r}>
            <circle
              cx={x(r)}
              cy={y(value)}
              r={r === step ? 6 : 4}
              className={r === step ? styles.selectedPoint : styles.point}
              tabIndex={0}
              role="button"
              aria-label={`${r} boxes added: coefficient ${value}`}
              aria-pressed={r === step}
              onClick={() => setRequestedStep(r)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setRequestedStep(r);
                }
              }}
            />
            {(length < 9 || r % 2 === 0 || r === length - 1) && <text x={x(r)} y="236" textAnchor="middle">{r}</text>}
          </g>
        ))}
        <text x="320" y="257" textAnchor="middle">boxes added to each first row</text>
        <text x="52" y="18">coefficient</text>
      </svg>
      <div className={styles.growthControls}>
        <button type="button" className={styles.button} disabled={step === 0} onClick={() => setRequestedStep(step - 1)}>Remove a box</button>
        <label className={styles.rangeLabel}>
          <span>{step} {step === 1 ? 'box' : 'boxes'} added to each</span>
          <input
            type="range"
            min="0"
            max={length - 1}
            value={step}
            disabled={length === 1}
            aria-label="Boxes added to both first rows"
            onChange={(event) => setRequestedStep(Number(event.target.value))}
          />
        </label>
        <button type="button" className={styles.button} disabled={step === length - 1} onClick={() => setRequestedStep(step + 1)}>Add a box</button>
      </div>
      {length === 1 && <p className={styles.hint}>This pair is already at the degree-14 boundary. Choose a smaller pair in the atlas or one of the examples above to see a sequence.</p>}
      <details className={styles.exactValues}>
        <summary>Read the exact sequence</summary>
        <div className={styles.tableScroll}>
          <table>
            <thead><tr><th>Boxes added</th><th>Target &lambda;</th><th>Source &mu;</th><th>Coefficient</th></tr></thead>
            <tbody>{values.map((value, r) => (
              <tr key={r}><td>{r}</td><td>{notation(grow(pair.lambda, r))}</td><td>{notation(grow(pair.mu, r))}</td><td>{format.format(value)}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </details>
      <figcaption className={styles.caption}>
        Each point comes from the exact coefficient table. Lines connect discrete samples only.
        Only the computed range is shown; the stabilization theorem is a separate statement.
      </figcaption>
    </figure>
  );
}

export function DataDownload() {
  function download() {
    const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'composition-factors-through-degree-14.json';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <button type="button" className={`${styles.button} ${styles.download}`} onClick={download}>
      Download the exact coefficient table <span>JSON / exact integers</span>
    </button>
  );
}
