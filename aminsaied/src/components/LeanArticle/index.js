import React, {useId, useState} from 'react';
import {usePrismTheme} from '@docusaurus/theme-common';
import styles from './styles.module.css';

export function TacticTable({children}) {
  // MDX inserts whitespace between its block-level children.
  const rows = React.Children.toArray(children).filter(
    (child) => typeof child !== 'string' || child.trim() !== '',
  );

  return (
    <div className={styles.tacticTableFrame}>
      <table className={styles.tacticTable} data-lean-tactics="" role="table" aria-label="Lean tactic examples">
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">Tactic</th>
            <th scope="col" role="columnheader">Purpose and example</th>
          </tr>
        </thead>
        <tbody role="rowgroup">{rows}</tbody>
      </table>
    </div>
  );
}

export function TacticRow({name, children}) {
  return (
    <tr role="row">
      <th scope="row" role="rowheader"><code>{name}</code></th>
      <td role="cell">{children}</td>
    </tr>
  );
}

const proofSteps = [
  {
    title: 'The initial goal',
    code: 'by',
    explanation: 'We begin with the whole statement still to prove.',
    goals: ['⊢ ∀ (n : ℕ), 1 < n → ∃ k, IsPrime k ∧ k ∣ n'],
  },
  {
    title: 'Introduce the hypotheses',
    code: '  intro n h1',
    explanation: 'Introduce the number n and the hypothesis h1. The remaining goal is to find a prime factor.',
    goals: ['n : ℕ\nh1 : 1 < n\n⊢ ∃ k, IsPrime k ∧ k ∣ n'],
  },
  {
    title: 'Split into cases',
    code: '  by_cases h_prime : IsPrime n',
    explanation: 'Split the proof into two cases: n is prime, or it is not. Both goals still need a proof.',
    goals: [
      'case pos\nn : ℕ\nh1 : 1 < n\nh_prime : IsPrime n\n⊢ ∃ k, IsPrime k ∧ k ∣ n',
      'case neg\nn : ℕ\nh1 : 1 < n\nh_prime : ¬IsPrime n\n⊢ ∃ k, IsPrime k ∧ k ∣ n',
    ],
  },
  {
    title: 'Close the prime case',
    code: '  · grind [Nat.dvd_refl]',
    explanation: 'If n is prime, n itself is a prime factor: every number divides itself. Only the non-prime case remains.',
    goals: ['case neg\nn : ℕ\nh1 : 1 < n\nh_prime : ¬IsPrime n\n⊢ ∃ k, IsPrime k ∧ k ∣ n'],
  },
  {
    title: 'Find a smaller divisor',
    code: '  · obtain ⟨k, hk⟩ : ∃ k, 1 < k ∧ k < n ∧ k ∣ n := by',
    explanation: 'Start a subproof: show that the non-prime number n has a divisor k strictly between 1 and n.',
    goals: ['n : ℕ\nh1 : 1 < n\nh_prime : ¬IsPrime n\n⊢ ∃ k, 1 < k ∧ k < n ∧ k ∣ n'],
  },
  {
    title: 'Establish the divisor properties',
    code: '      simp_all [IsPrime]',
    explanation: 'Unfold IsPrime to finish the subproof. Back in the outer proof, we now have k and its three properties, collected in hk.',
    goals: ['case neg\nn : ℕ\nh1 : 1 < n\nh_prime : ¬IsPrime n\nk : ℕ\nhk : 1 < k ∧ k < n ∧ k ∣ n\n⊢ ∃ k, IsPrime k ∧ k ∣ n'],
  },
  {
    title: 'Use the theorem recursively',
    code: '    obtain ⟨p, hp, hpk⟩ := exists_prime_factor k (by grind)',
    explanation: 'Apply the theorem to the smaller number k. This gives a prime p that divides k; the strict decrease k < n makes the recursion valid.',
    goals: ['case neg\nn : ℕ\nh1 : 1 < n\nh_prime : ¬IsPrime n\nk : ℕ\nhk : 1 < k ∧ k < n ∧ k ∣ n\np : ℕ\nhp : IsPrime p\nhpk : p ∣ k\n⊢ ∃ k, IsPrime k ∧ k ∣ n'],
  },
  {
    title: 'Complete the proof',
    code: '    grind [Nat.dvd_trans]',
    explanation: 'Since p divides k and k divides n, p divides n. Together with hp, this supplies the required prime factor and finishes the proof.',
    goals: [],
  },
];

export function ProofWalkthrough() {
  const [step, setStep] = useState(0);
  const id = useId();
  const theme = usePrismTheme();

  return (
    <figure className={styles.walkthrough} data-lean-figure="proof">
      <div
        className={styles.proofGrid}
        style={{
          '--proof-background': theme.plain.backgroundColor,
          '--proof-color': theme.plain.color,
        }}
      >
        <div className={styles.proofPane}>
          <p className={styles.paneTitle} id={`${id}-proof-label`}>Proof</p>
          <div role="group" aria-labelledby={`${id}-proof-label`}>
            {proofSteps.map(({code, title}, index) => (
              <button
                key={code}
                type="button"
                className={styles.proofLine}
                data-proof-step={index}
                aria-label={`${title}: ${code.trim()}`}
                aria-pressed={step === index}
                aria-controls={`${id}-goals`}
                onClick={() => setStep(index)}
              >
                <span className={styles.lineNumber} aria-hidden="true">{index + 1}</span>
                <code>{code}</code>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.goalPane}>
          <p className={styles.paneTitle} id={`${id}-goal-label`}>Goal state</p>
          <div
            id={`${id}-goals`}
            className={styles.goalStates}
            role="region"
            aria-labelledby={`${id}-goal-label`}
            aria-live="polite"
            aria-atomic="true"
          >
            {proofSteps.map(({goals}, index) => (
              <div key={index} data-goal-state={index} hidden={step !== index}>
                <p className={goals.length === 0 ? styles.proofComplete : styles.goalCount}>
                  {goals.length === 0 ? 'No goals' : `${goals.length} ${goals.length === 1 ? 'goal' : 'goals'}`}
                </p>
                {goals.length === 0 && <p className={styles.caption}>The theorem is proved.</p>}
                {goals.map((goal) => (
                  <pre key={goal} className={styles.goal} data-lean-goal="">
                    <code>{goal}</code>
                  </pre>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.stepControls} role="group" aria-label="Proof walkthrough navigation">
        <button type="button" onClick={() => setStep(step - 1)} disabled={step === 0}>
          Previous
        </button>
        <span>Step {step + 1} of {proofSteps.length}</span>
        <button type="button" onClick={() => setStep(step + 1)} disabled={step === proofSteps.length - 1}>
          Next
        </button>
      </div>
      <p className={styles.stepExplanation}>{proofSteps[step].explanation}</p>
      <figcaption className={styles.caption}>
        Select a proof line or use Previous and Next. These are fixed example states, not a live Lean editor.
      </figcaption>
      <noscript>Enable JavaScript to move beyond the initial goal.</noscript>
    </figure>
  );
}

const vertices = [[-1, 1], [1, 1], [1, -1], [-1, -1]];
const guides = [
  [[-4, -2], [4, 6]],
  [[-4, -6], [4, 2]],
  [[-4, 6], [4, -2]],
  [[-4, 2], [4, -6]],
];
const plotX = (x) => 250 + 80 * x;
const plotY = (y) => 220 - 80 * y;

export function ConstraintFigure() {
  const id = useId();

  return (
    <figure className={styles.constraintFigure} data-lean-figure="constraint">
      <svg
        className={styles.constraintSvg}
        viewBox="0 0 600 440"
        role="img"
        aria-labelledby={`${id}-title ${id}-description`}
      >
        <title id={`${id}-title`}>The AMC-12 constraint is an axis-aligned square</title>
        <desc id={`${id}-description`}>
          The constraint is the boundary of the square with vertices (-1, 1), (1, 1),
          (1, -1), and (-1, -1). Its interior is shaded green. Dashed diagonal guides
          form a surrounding diamond, but are not the constraint. The point (3, 0)
          is marked to the right.
        </desc>
        <defs>
          <clipPath id={`${id}-clip`}>
            <rect x="40" y="35" width="520" height="370" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-clip)`}>
          {guides.map(([start, end], index) => (
            <line
              key={index}
              className={`${styles.guide} ${index < 2 ? styles.risingGuide : styles.fallingGuide}`}
              x1={plotX(start[0])}
              y1={plotY(start[1])}
              x2={plotX(end[0])}
              y2={plotY(end[1])}
            />
          ))}
          <path className={styles.axis} d="M40 220H560M250 35V405" />
          <rect
            className={styles.constraintBoundary}
            data-constraint-boundary=""
            x={plotX(-1)}
            y={plotY(1)}
            width={160}
            height={160}
          />
        </g>
        <g className={styles.axisLabels}>
          <text x="575" y="226">x</text>
          <text x="250" y="23" textAnchor="middle">y</text>
        </g>
        {vertices.map(([x, y]) => (
          <g key={`${x},${y}`} className={styles.vertex} data-vertex={`${x},${y}`}>
            <circle cx={plotX(x)} cy={plotY(y)} r="4" />
            <text
              x={plotX(x) + (x < 0 ? -12 : 12)}
              y={plotY(y) + (y > 0 ? -13 : 29)}
              textAnchor={x < 0 ? 'end' : 'start'}
            >
              {`(${x}, ${y})`}
            </text>
          </g>
        ))}
        <g className={styles.referencePoint}>
          <circle cx={plotX(3)} cy={plotY(0)} r="5" />
          <text x={plotX(3)} y={plotY(0) + 29} textAnchor="middle">(3, 0)</text>
        </g>
      </svg>
      <figcaption className={styles.caption}>
        The solid green boundary is the constraint. The dashed diagonals are only guides.
      </figcaption>
    </figure>
  );
}
