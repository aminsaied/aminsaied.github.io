import assert from 'node:assert/strict';
import {existsSync, readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';
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

for (const file of filesIn(build).filter((file) => /\.(html|xml)$/.test(file))) {
  const content = readFileSync(file, 'utf8');
  assert.doesNotMatch(content, /class="katex-error"/, `Math rendering failed: ${file}`);
  if (mode === 'production') {
    assert.ok(!content.includes(sampleRoute), `Preview content leaked into ${file}`);
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
}

console.log(
  `Passed ${mode} checks: navigation, role order, 7 publications, 6 archived posts and PDFs, public Lean article and diagrams, local math fonts, and sample isolation.`,
);
