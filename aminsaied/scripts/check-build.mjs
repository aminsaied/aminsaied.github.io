import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {basename, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const mode = process.argv[2];
assert.ok(['production', 'preview'].includes(mode), 'Pass production or preview');
const build = fileURLToPath(new URL('../build/', import.meta.url));

function readPage(route) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}.html`;
  return readFileSync(join(build, file), 'utf8');
}

function filesIn(directory) {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const file = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(file) : [file];
  });
}

const home = readPage('/');
const blog = readPage('/blog');
const publications = readPage('/publications');
const sampleRoute = '/blog/preview/verifiable-rewards';
const compositionRoute = '/blog/preview/composition-factors';
const leanRoute = '/blog/lean-formal-proofs';
const legacyPosts = [
  '/blog/2020/12/18/intro-to-huggingface',
  '/blog/2021/01/15/gpt1-gpt2',
  '/blog/2021/02/12/parallelism',
  '/blog/2021/05/07/pytorch-lightning',
  '/blog/2021/08/19/gnns',
  '/blog/2021/09/24/roberta-electra',
];
assert.ok(home.includes('Member of Technical Staff'), 'The current role is missing');
assert.ok(home.includes('Science Lead'), 'The previous role is missing');
assert.ok(
  home.indexOf('MAI Post-training') < home.indexOf('Science Lead'),
  'Work highlights must be reverse chronological',
);

for (const html of [home, blog, publications]) {
  assert.match(html, /href="\/blog"/, 'Blog navigation is missing');
  assert.match(html, /href="\/publications"/, 'Publications navigation is missing');
  assert.doesNotMatch(html, /href="\/docs\//, 'Retired documentation is still linked');
}

for (const html of [home, publications]) {
  assert.ok(
    html.includes('href="https://scholar.google.com/citations?user=XuR_6iUAAAAJ"'),
    'The Google Scholar profile link is missing',
  );
}

assert.equal((publications.match(/class="publication"/g) ?? []).length, 7);
assert.equal((publications.match(/class="publication-summary"/g) ?? []).length, 7);
assert.match(publications, /href="https:\/\/arxiv\.org\/abs\/2404\.14219"/);
assert.match(publications, /href="https:\/\/aclanthology\.org\/2024\.findings-naacl\.149\/"/);
assert.match(publications, /href="https:\/\/arxiv\.org\/abs\/1912\.00913"/);
assert.ok(publications.includes('/articles/metric-computation-for-multiple-backends/'));
assert.ok(!publications.includes('>Metric Computation for Multiple Backends<'));
assert.equal((publications.match(/class="katex"/g) ?? []).length, 2);
assert.ok(!existsSync(join(build, 'docs')), 'Retired DS Ref routes were published');
assert.ok(!existsSync(join(build, 'markdown-page.html')), 'The starter page was published');

for (const route of legacyPosts) {
  const html = readPage(route);
  assert.ok(blog.includes(`href="${route}"`), `The blog index lost ${route}`);
  const pdfLinks = [...html.matchAll(/href="(\/[^"]+\.pdf)"/g)];
  assert.ok(pdfLinks.length > 0, `The slides link is missing on ${route}`);
  for (const [, href] of pdfLinks) {
    assert.ok(href.startsWith('/assets/'), `Unexpected PDF location: ${href}`);
    const pdf = readFileSync(join(build, decodeURIComponent(href.slice(1))));
    assert.equal(pdf.subarray(0, 5).toString(), '%PDF-', `Missing LFS content: ${href}`);
  }
}

const leanPost = readPage(leanRoute);
assert.ok(blog.includes(`href="${leanRoute}"`), 'The Lean article is absent from the blog');
assert.deepEqual(
  [...leanPost.matchAll(/<h2\b[^>]*\bid="([^"]+)"/g)].map(([, id]) => id),
  [
    'what-is-lean',
    'proofs-in-lean',
    'whats-the-difference-between-formal-and-informal-reasoning-and-why-should-you-care',
  ],
  'The Lean article must contain only the three public sections, without a roadmap or later sections',
);
assert.equal((leanPost.match(/<details\b/g) ?? []).length, 3, 'Expandable proofs are missing');
const tactics = leanPost.match(/<h3\b[^>]*\bid="tactics"[\s\S]*?(?=<h3\b)/)?.[0];
assert.ok(tactics, 'The tactics section is missing');
assert.doesNotMatch(tactics, /<\/?details\b/, 'Tactic examples must not be collapsible');
assert.doesNotMatch(tactics, /<(?:ul|ol)\b/, 'Tactic examples must not be a bulleted or numbered list');
assert.match(tactics, /<table\b[^>]*data-lean-tactics=/, 'The tactic examples need a table');
assert.equal((tactics.match(/scope="col"/g) ?? []).length, 2, 'The tactics table needs two column headers');
assert.equal((tactics.match(/scope="row"/g) ?? []).length, 7, 'Each tactic needs a row header');
assert.doesNotMatch(tactics, /<h4\b/, 'Tactics should use table labels instead of subsection headings');
assert.equal((tactics.match(/<pre\b/g) ?? []).length, 7, 'Tactic examples are missing');
assert.ok((leanPost.match(/class="katex"/g) ?? []).length >= 20, 'Lean article math is missing');
assert.ok(leanPost.includes('formally verifiable solutions provide a remedy.'));
assert.doesNotMatch(
  leanPost,
  /src="[^"]*(?:lean-goal-state|amc12-constraint)[^"]*\.png"/,
  'The Lean article must use readable figures instead of the original screenshots',
);
const walkthrough = leanPost.match(/<figure\b[^>]*data-lean-figure="proof"[\s\S]*?<\/figure>/)?.[0];
assert.ok(walkthrough, 'The proof walkthrough must render on the server');
assert.deepEqual(
  [...walkthrough.matchAll(/data-proof-step="(\d)"/g)].map(([, step]) => Number(step)),
  [0, 1, 2, 3, 4, 5, 6, 7],
  'The proof walkthrough needs all eight selectable proof lines',
);
assert.equal((walkthrough.match(/aria-pressed="true"/g) ?? []).length, 1);
assert.match(walkthrough, /<button\b(?=[^>]*data-proof-step="0")(?=[^>]*aria-pressed="true")/);
assert.doesNotMatch(walkthrough, /<div\b(?=[^>]*data-goal-state="0")(?=[^>]*\bhidden)/);
for (const step of [1, 2, 3, 4, 5, 6, 7]) {
  assert.match(walkthrough, new RegExp(`<div\\b(?=[^>]*data-goal-state="${step}")(?=[^>]*\\bhidden)`));
}
const proofGoalStates = [...walkthrough.matchAll(
  /<div\b[^>]*data-goal-state="(\d)"[^>]*>[\s\S]*?<\/div>/g,
)];
assert.deepEqual(
  proofGoalStates.map(([, step]) => Number(step)),
  [0, 1, 2, 3, 4, 5, 6, 7],
);
assert.deepEqual(
  proofGoalStates.map(([html]) => (html.match(/data-lean-goal=/g) ?? []).length),
  [1, 1, 2, 1, 1, 1, 1, 0],
  'Proof states must include both cases, the divisor subproof, and no remaining goals at the end',
);
assert.match(walkthrough, /h_prime : IsPrime n/);
assert.match(walkthrough, /h_prime : ¬IsPrime n/);
assert.match(proofGoalStates[6][0], /hp : IsPrime p/);
assert.match(proofGoalStates[6][0], /hpk : p ∣ k/);
assert.match(proofGoalStates[7][0], /No goals/);
assert.match(proofGoalStates[7][0], /The theorem is proved/);
assert.match(walkthrough, /aria-live="polite"/);
assert.match(walkthrough, /not a live Lean editor/);
const constraint = leanPost.match(/<figure\b[^>]*data-lean-figure="constraint"[\s\S]*?<\/figure>/)?.[0];
assert.ok(constraint, 'The constraint figure must render on the server');
assert.match(constraint, /<svg\b(?=[^>]*role="img")(?=[^>]*aria-labelledby=)/);
assert.match(constraint, /viewBox="0 0 600 440"/);
assert.match(constraint, /<rect\b(?=[^>]*data-constraint-boundary)(?=[^>]*width="160")(?=[^>]*height="160")/);
assert.deepEqual(
  [...constraint.matchAll(/data-vertex="([^"]+)"/g)].map(([, vertex]) => vertex),
  ['-1,1', '1,1', '1,-1', '-1,-1'],
);
assert.match(constraint, /<circle\b(?=[^>]*cx="490")(?=[^>]*cy="220")/);

const fonts = readdirSync(join(build, 'assets/fonts'));
assert.ok(fonts.some((font) => font.startsWith('KaTeX_') && font.endsWith('.woff2')));

const sampleExists = existsSync(join(build, `${sampleRoute.slice(1)}.html`));
assert.equal(sampleExists, mode === 'preview', 'Sample article isolation failed');
assert.equal(
  existsSync(join(build, `${compositionRoute.slice(1)}.html`)),
  mode === 'preview',
  'Composition-factors editorial draft isolation failed',
);

const coefficients = JSON.parse(readFileSync(
  new URL('../src/components/CompositionFactors/coefficients.json', import.meta.url),
  'utf8',
));
assert.equal(coefficients.degree, 14);
assert.equal(coefficients.rows, 'lambda');
assert.equal(coefficients.columns, 'mu');
assert.equal(coefficients.partitions.length, 507);
assert.equal(coefficients.matrix.length, 507);
assert.ok(coefficients.matrix.every(
  (row) => row.length === 507 && row.every((value) => Number.isSafeInteger(value) && value >= 0),
), 'The coefficient matrix must contain 257,049 exact nonnegative integers');
assert.equal(
  createHash('sha256').update(JSON.stringify(coefficients.matrix)).digest('hex'),
  coefficients.matrixSha256,
  'The coefficient data changed without updating its provenance checksum',
);

const baseline = JSON.parse(readFileSync(
  new URL('../src/components/CompositionFactors/degree-five.json', import.meta.url),
  'utf8',
));
const baselinePartitions = coefficients.partitions.filter(
  (partition) => partition.reduce((sum, part) => sum + part, 0) <= 5,
);
assert.equal(baselinePartitions.length, 18);
assert.deepEqual(baseline, {
  partitions: baselinePartitions,
  matrix: coefficients.matrix.slice(0, 18).map((row) => row.slice(0, 18)),
}, 'The static degree-five data must be an exact subset of the full table');

const coefficientBundles = filesIn(join(build, 'assets/js')).filter((file) =>
  file.endsWith('.js') && readFileSync(file, 'utf8').includes(coefficients.matrixSha256),
);
assert.equal(
  coefficientBundles.length,
  mode === 'preview' ? 1 : 0,
  'The coefficient data must occur once in preview assets and never in production assets',
);
if (mode === 'preview') {
  assert.match(
    basename(coefficientBundles[0]),
    /^composition-figures\.[^.]+\.js$/,
    'The dataset must live in the on-demand figure bundle, not an article or excerpt bundle',
  );
}

for (const file of filesIn(build).filter((file) => /\.(html|xml)$/.test(file))) {
  const content = readFileSync(file, 'utf8');
  assert.doesNotMatch(content, /class="katex-error"/, `Math rendering failed: ${file}`);
  assert.doesNotMatch(
    content,
    /(?:src|href)="[^"]*\/composition-figures\.[^"]+\.js"/,
    `The figure bundle must not be eagerly loaded or prefetched by ${file}`,
  );
  if (mode === 'production') {
    assert.ok(!content.includes(sampleRoute), `Preview content leaked into ${file}`);
    assert.ok(!content.includes(compositionRoute), `Editorial draft leaked into ${file}`);
  }
  if (file.endsWith('.html')) {
    const noIndex = /<meta\b(?=[^>]*name="robots")(?=[^>]*content="[^"]*noindex)[^>]*>/;
    if (mode === 'preview') {
      assert.match(content, noIndex, `Preview is indexable: ${file}`);
    }
  }
}

if (mode === 'preview') {
  const sample = readPage(sampleRoute);
  assert.ok(blog.includes(`href="${sampleRoute}"`), 'The sample is absent from the blog');
  assert.match(sample, /Design preview, not a published article/);
  assert.ok((sample.match(/class="katex"/g) ?? []).length >= 10);
  assert.ok((sample.match(/class="katex-display"/g) ?? []).length >= 3);
  assert.match(sample, /application\/x-tex/, 'Accessible math output is missing');

  const composition = readPage(compositionRoute);
  assert.ok(blog.includes(`href="${compositionRoute}"`), 'The editorial draft is absent from the preview blog');
  assert.match(blog, /Editorial draft/);
  assert.match(composition, /Member of Technical Staff, Microsoft AI/);
  assert.doesNotMatch(composition, /ML Engineer, Microsoft|Editorial draft for review/);
  assert.equal(
    composition.match(/<h2\b[^>]*\bid="([^"]+)"/)?.[1],
    'plethysms-afoot',
    'The first section must introduce plethysm after the narrative opening',
  );
  assert.match(composition, /In 2017, my advisor asked me/);
  assert.match(composition, /id="roll-up-your-sleeves"/);
  assert.match(composition, /Unpacking that structure turned out to be at the heart of my thesis/);
  assert.match(composition, /data-footnote-ref/, 'The opening must link to the thesis footnote');
  assert.match(composition, /1711\.04326#page=6/, 'The major-index rule needs its reference');
  assert.doesNotMatch(composition, /\\(?:boxed|fbox|fcolorbox)\b/, 'Article equations must not be boxed');
  const footnotesIndex = composition.indexOf('data-footnotes');
  assert.ok(footnotesIndex >= 0, 'The article footnotes are missing');
  const articleBody = composition.slice(0, footnotesIndex);
  const footnotes = composition.slice(footnotesIndex);
  assert.ok(
    (footnotes.match(/class="katex-display"/g) ?? []).length >= 2,
    'The Lie-character and degree-bound footnote equations must render as math',
  );
  for (const detail of [
    /characteristic zero/,
    /universal Schur-functor multiplicities/,
    /The major index is/,
  ]) {
    assert.doesNotMatch(articleBody, detail, 'Supporting conventions must not interrupt the main exposition');
    assert.match(footnotes, detail, 'The technical detail must remain available in a footnote');
  }
  const motivationIndex = composition.indexOf('Johnson homomorphism');
  assert.ok(
    motivationIndex >= 0 && motivationIndex < composition.indexOf('id="plethysms-afoot"'),
    'The narrative introduction must precede the coefficient definition',
  );
  assert.deepEqual(
    [...composition.matchAll(/data-composition-figure="([^"]+)"/g)].map(([, name]) => name),
    ['baseline', 'cartoon', 'atlas', 'puzzle', 'stability'],
    'The static figures and three interactive placeholders must render in narrative order',
  );
  const baselineFigure = composition.match(
    /<figure\b[^>]*data-composition-figure="baseline"[\s\S]*?<\/figure>/,
  )?.[0];
  assert.ok(baselineFigure, 'The degree-five figure must render on the server');
  assert.doesNotMatch(baselineFigure, /<(?:canvas|button|input|select)\b/, 'The baseline must be static');
  assert.deepEqual(
    [...baselineFigure.matchAll(/<text\b[^>]*data-baseline-label="([^"]+)"[^>]*>([\s\S]*?)<\/text>/g)]
      .map(([, label, content]) => [label, content.replace(/<[^>]+>/g, '')]),
    [['coefficient', 'c\u03bb\u03bc'], ['source', '\u03bc'], ['target', '\u03bb']],
    'The matrix must show its coefficient symbol and label the source and target axes',
  );
  assert.equal(
    [...baselineFigure.matchAll(/<text\b/g)].length,
    3 + baseline.matrix.flat().filter(Boolean).length,
    'Only the coefficient symbol, axis names, and matrix entries should have text labels',
  );
  const baselineTicks = [...baselineFigure.matchAll(
    /<g\b[^>]*data-baseline-axis="([^"]+)" data-partition="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g,
  )];
  for (const axis of ['source', 'target']) {
    assert.deepEqual(
      baselineTicks.filter(([, name]) => name === axis).map(([, , partition]) => partition),
      baseline.partitions.map((partition) => partition.join(',')),
      `The ${axis} axis must label every partition in matrix order`,
    );
  }
  for (const [, axis, partition, tick] of baselineTicks) {
    assert.equal(
      [...tick.matchAll(/<rect\b/g)].length,
      partition.split(',').reduce((sum, part) => sum + Number(part), 0),
      `The ${axis} tick for ${partition} must render its Young diagram`,
    );
  }
  assert.deepEqual(
    [...baselineFigure.matchAll(/data-coefficient="(\d+),(\d+),(\d+)"/g)]
      .map((match) => match.slice(1).map(Number)),
    baseline.matrix.flatMap((row, i) => row.flatMap((value, j) => value ? [[i, j, value]] : [])),
    'The static matrix must render every nonzero value at the correct row and column',
  );
  const efficiencyIndex = composition.indexOf('The key insight to improve');
  const cartoonIndex = composition.indexOf('data-composition-figure="cartoon"');
  const cartoon = composition.match(
    /<figure\b[^>]*data-composition-figure="cartoon"[\s\S]*?<\/figure>/,
  )?.[0];
  assert.ok(cartoon, 'The decomposition cartoon must render on the server');
  assert.doesNotMatch(cartoon, /<(?:canvas|button|input|select)\b|Figure 0/, 'The cartoon must be static and unnumbered');
  assert.doesNotMatch(cartoon, /&amp;ell;/, 'Lie-piece labels must render the script ell symbol');
  assert.deepEqual(
    [...cartoon.matchAll(/data-puzzle-step="([^"]+)"/g)].map(([, step]) => step),
    ['decompose', 'pair', 'degree', 'assemble'],
  );
  const lieCatalogue = baseline.partitions.flatMap((partition, i) =>
    Array.from({length: baseline.matrix[i][0]}, () => partition.join(',')),
  );
  assert.equal(lieCatalogue.length, 10);
  assert.deepEqual(
    [...cartoon.matchAll(/data-lie-catalogue-piece="([^"]+)"/g)].map(([, partition]) => partition),
    lieCatalogue,
    'The catalogue must show every Lie piece through degree five in paper order',
  );
  assert.equal((cartoon.match(/data-selected="true"/g) ?? []).length, 2);
  assert.deepEqual(
    [...cartoon.matchAll(/data-lie-piece="(\d+)" data-selected="true"/g)].map(([, id]) => Number(id)),
    [1, 2],
    'The paper example must select the first two Lie pieces from the catalogue',
  );
  assert.deepEqual(
    [...cartoon.matchAll(/data-puzzle-pair="([^"]+)"/g)].map(([, pair]) => pair),
    ['2|1,1', '1|1'],
  );
  assert.match(cartoon, /data-degree-total="5" data-degree-compatible="true"/);
  assert.match(cartoon, /data-degree-total="4" data-degree-compatible="false"/);
  assert.match(cartoon, /Reject for degree 5/);
  assert.deepEqual(
    [...cartoon.matchAll(/data-puzzle-output="([^"]+)"/g)].map(([, partition]) => partition),
    ['3,2', '2,2,1', '2,1,1,1', '1,1,1,1,1'],
  );
  assert.equal((cartoon.match(/data-puzzle-target="true"/g) ?? []).length, 1);
  assert.match(cartoon, /data-puzzle-output="3,2" data-puzzle-target="true"/);
  assert.match(cartoon, /contributes 1 to/);
  assert.match(cartoon, /1711\.04326#page=10/);
  assert.match(composition, /1711\.04326#page=13/);
  assert.ok(
    efficiencyIndex < cartoonIndex && cartoonIndex < composition.indexOf('At the level of'),
    'The cartoon must immediately follow the paragraph introducing decomposition puzzles',
  );
  assert.ok(
    composition.indexOf('data-composition-figure="baseline"') < efficiencyIndex &&
      efficiencyIndex < composition.indexOf('data-composition-loader="atlas"'),
    'The efficiency discussion must separate the static and interactive matrices',
  );
  assert.match(composition, /strictly below the diagonal/);
  assert.match(
    composition,
    /compared with the original 324\.<\/p>\s*<p>Visualizing these expanded coefficients/,
    'The block-stability paragraph must immediately follow the expanded computation',
  );
  const patternIndex = composition.indexOf('Visualizing these expanded coefficients');
  const guidesIndex = composition.indexOf('<strong>Show degree boundaries</strong>');
  assert.ok(
    patternIndex < guidesIndex && guidesIndex < composition.indexOf('data-composition-loader="atlas"'),
    'The pattern and degree-boundary guidance must introduce the interactive matrix',
  );
  assert.match(footnotes, /https:\/\/arxiv\.org\/abs\/1204\.4533/, 'The FI-modules connection needs its citation');
  assert.doesNotMatch(composition, /including\s+zeros/i);
  assert.deepEqual(
    [...composition.matchAll(/data-composition-loader="([^"]+)"/g)].map(([, name]) => name),
    ['atlas', 'puzzle', 'stability', 'download'],
    'Interactive content must load on demand',
  );
  assert.match(composition, /257,049/);
  assert.match(composition, /freshly reconstructed/);
  assert.match(composition, /Download the exact coefficient table/);
  assert.match(composition, /id="stability-lab"/, 'The stability anchor must exist before its figure loads');
  assert.match(
    composition,
    /<noscript>Enable JavaScript to use this interactive content\.<\/noscript>/,
    'Deferred figures need a no-JavaScript explanation',
  );
  const figureBundle = readFileSync(coefficientBundles[0], 'utf8');
  assert.doesNotMatch(figureBundle, /including\s+zeros/i);
  assert.match(figureBundle, /Every point is computed, not extrapolated/);
  assert.match(figureBundle, /Maximum coefficient degree/);
  assert.match(figureBundle, /Show degree boundaries/);
  assert.match(figureBundle, /data-degree-start/, 'Degree boundaries must retain their degree labels');
  assert.match(figureBundle, /Boxes added to both first rows/);
  assert.ok((composition.match(/class="katex"/g) ?? []).length >= 25);
}

console.log(
  `Passed ${mode} checks: navigation, role order, 7 publications, 6 archived posts and PDFs, public Lean article and diagrams, local math fonts, exact coefficient data, and preview isolation.`,
);
