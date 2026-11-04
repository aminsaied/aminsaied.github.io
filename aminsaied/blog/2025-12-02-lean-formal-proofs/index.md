---
title: "Lean, formal proofs, and verifiable reasoning"
description: "Notes from an introductory talk I gave to the Microsoft AI team on Lean and its applications to mathematics and reinforcement learning with verifiable rewards."
slug: lean-formal-proofs
authors:
  - aminsaied
tags:
  - lean
  - reinforcement-learning
---

import {ConstraintFigure, ProofWalkthrough, TacticRow, TacticTable} from '@site/src/components/LeanArticle';

Lean is a programming language in which mathematical proofs can be checked by a computer. This post gives an introduction to Lean, from its origins and recent history to its applications to model reasoning and verifiable reinforcement learning.

<!-- truncate -->

## What is Lean?

[Lean][lean-docs] is a modern interactive _theorem prover_ and functional programming language. It takes this dual nature seriously, and can be used meaningfully for both tasks.

**Functional programming language.** As a language, Lean is a strict, pure functional language with a dependent type theory. The latter property here is the most important to understand: it means that types in Lean can contain programs, and that programs can compute types. It is this powerful type system that enables Lean to "do mathematics".

```text
# regular types - notice these only depend on other types
List Int
Prod String Bool

# dependent types
Vector Int 5        -- a list of length 5
Fin n               -- natural numbers less than n
Matrix m n ℝ        -- matrices indexed by m and n, with values in ℝ
```

**Interactive theorem prover.** Lean is expressive enough to do mathematics in a way that feels natural and idiomatic. For example, consider this definition and statement related to prime numbers:

```lean
/-- A prime is a number larger than 1 with no nontrivial divisors -/
def IsPrime (n : Nat) := 1 < n ∧ ∀ k, 1 < k → k < n → ¬ k ∣ n

/-- Every number larger than 1 has a prime factor -/
theorem exists_prime_factor :
    ∀ n, 1 < n → ∃ k, IsPrime k ∧ k ∣ n
```

A proof of the theorem `exists_prime_factor` is a term of that type. If one is able to produce such a term as validated by Lean's kernel, then one has proved the theorem!

<details>
<summary>Continuing this example</summary>

```lean
/-- A prime is a number larger than 1 with no nontrivial divisors -/
def IsPrime (n : Nat) := 1 < n ∧ ∀ k, 1 < k → k < n → ¬ k ∣ n

/-- Every number larger than 1 has a prime factor -/
theorem exists_prime_factor :
    ∀ n, 1 < n → ∃ k, IsPrime k ∧ k ∣ n := by
  intro n h1
  -- Either `n` is prime...
  by_cases h_prime : IsPrime n
  · grind [Nat.dvd_refl]
  -- ... or it has a non-trivial divisor with a prime factor
  · obtain ⟨k, hk⟩ : ∃ k, 1 < k ∧ k < n ∧ k ∣ n := by
      simp_all [IsPrime]
    obtain ⟨p, hp, hpk⟩ := exists_prime_factor k (by grind)
    grind [Nat.dvd_trans]

/-- The factorial, defined recursively, with custom notation -/
def factorial : Nat → Nat
  | 0 => 1
  | n+1 => (n + 1) * factorial n
notation:10000 n "!" => factorial n

/-- The factorial is always positive -/
theorem factorial_pos : ∀ n, 0 < n ! := by
  intro n; induction n <;>
    grind [factorial, Nat.mul_pos_iff_of_pos_left]

/-- ... and divisible by its constituent factors -/
theorem dvd_factorial : ∀ n, ∀ k ≤ n, 0 < k → k ∣ n ! := by
  intro n; induction n <;>
    grind [Nat.dvd_mul_right, Nat.dvd_mul_left_of_dvd, factorial]

/--
We show that we find arbitrarily large (and thus infinitely
many) prime numbers, by picking an arbitrary number `n`
and showing that `n! + 1` has a prime factor larger than `n`.
-/
theorem InfinitudeOfPrimes : ∀ n, ∃ p > n, IsPrime p := by
  intro n
  have : 1 < n ! + 1 := by grind [factorial_pos]
  obtain ⟨p, hp, _⟩ := exists_prime_factor (n ! + 1) this
  suffices ¬p ≤ n by grind
  intro (_ : p ≤ n)
  have : 1 < p := hp.1
  have : p ∣ n ! := dvd_factorial n p ‹p ≤ n› (by grind)
  have := Nat.dvd_sub ‹p ∣ n ! + 1› ‹p ∣ n !›
  grind [Nat.add_sub_cancel_left, Nat.dvd_one]
```

</details>

**Dual nature of Lean.** The way to connect these concepts is as follows. Theorems in Lean (or mathematical statements in general) are thought of as types, and a proof of a theorem corresponds to an instance of that type.

```text
# as a programming language
n : Int := 73

# as a theorem prover
theorem exists_prime_factor : ∀ n, 1 < n → ∃ k, IsPrime k ∧ k ∣ n := by intro n h1 ...
```

This simple example already speaks to the potential of Lean as a way to verify statements of mathematics (and by extension, of reasoning) through a compiler. Before going any deeper however, let's start with a bit of historical context.

### A brief history

**Origins of Lean at Microsoft Research.**

Lean was created by Leonardo de Moura at Microsoft Research (MSR) in 2013 with the goal of building a next-generation theorem prover. By 2017, Lean 3 was released, which became the first mature and widely adopted version.

**Lean enters pure mathematics - AKA the Buzzard effect.**

In 2019, Kevin Buzzard gives a talk at Microsoft on [the Future of Mathematics][future-of-mathematics] arguing that Lean will become an essential tool for working mathematicians. This catalyzes a cultural shift in the mathematics community, exemplified by figures like Peter Scholze and Terry Tao (both winners of the Fields Medal) adopting Lean.

There are two important questions answered in this period:

1. Is Lean **_broad_** enough to cover the full spectrum of mathematics - from algebra to number theory, from statistics to theoretical physics?
2. Is Lean powerful enough to express the **deepest** areas of mathematics - including the latest research? One might fear that as you approach the frontiers of mathematics research, the objects themselves become prohibitively expensive to formalize.

There is strong evidence supporting positive answers to both questions, which we now go over.

**On the question of breadth.**

- Formalizing the undergraduate curriculum at Imperial College London: In 2021, Kevin Buzzard started to systematically formalize the pure mathematics curriculum at Imperial College. This program covers topics from algebra, number theory, measure theory, topology, graph theory, Galois theory and commutative algebra ([repo][imperial-math-repo], [blog post][xena-intro]).
- [`Mathlib`][mathlib] is the unified mathematics library for Lean. Created in 2017, by November 2025 it contained roughly 1.9 million lines of code, over 240k theorems, and over 100k definitions, covering an incredibly broad range of subjects. You can see its [growth statistics here][mathlib-stats]. Check out these papers from [2019][mathlib-white-paper] and [2025][mathlib-growth-paper] for more details.

**Lean demonstrates research-level capability.**

In 2020 Peter Scholze (Fields Medalist) announces the [Liquid Tensor Experiment][liquid-tensor] with the goal to formalize a difficult foundational theorem from his work on analytic geometry. Here is the technical statement they aimed to formalize:

> **Theorem [Clausen-Scholze].** Let $0 < p_0 < p \le 1$ be real numbers, let $S$ be a profinite set, and let $V$ be a $p$-Banach space. Let $M_{p_0}(S)$ be the space of $p_0$-measures on $S$. Then
>
> $$
> \operatorname{Ext}^i_{\operatorname{Cond}(\mathbf{Ab})}
>    \bigl( M_{p_0}(S),\, V \bigr) = 0
> $$
>
> for all $i \ge 1$.

This is an important example because both the objects being discussed and the theorem itself are highly complex (it requires years of training to even understand the basic definitions). To quote Kevin Buzzard:

> Hales and Gonthier have already demonstrated beyond all doubt that it is possible to prove highly complex theorems about relatively low-level objects (spheres, finite groups, planar graphs) in a theorem prover. This is the next step - **can we prove a complex theorem about a complex object?**

Around six months later, the key result in the challenge was formalized, and a year later the entire challenge was completed. Here's a quote from Peter Scholze's [blog post][liquid-6mo] announcing the result:

> I am excited to announce that the Experiment has verified the entire part of the argument that I was unsure about. I find it absolutely insane that interactive proof assistants are now at the level that within a very reasonable time span they can formally verify difficult original research. Congratulations to everyone involved in the formalization!!

There's a lot more one can say about this experiment! For the curious:

- Scholze's [challenge in full][liquid-pdf].
- Buzzard's [Beyond Liquid Tensor Experiment][liquid-beyond] blog post.
- An [interactive visualization][liquid-deps] of the completed proof.

**TL;DR:** Lean can formalize deep mathematics.

**Mathematics community.**

Lean has become a prominent tool within the mathematics community. Figures like Terry Tao are writing about formalization and discussing [Lean in talks][tao-talk]. Ambitious projects like the [**Fermat's Last Theorem formalization project**][flt-docs] (Buzzard et al., estimated to take more than ten years to complete) are receiving grants.

**DeepMind reaches silver-medal standard at the IMO (2024).**

The machine learning community has taken notice of Lean too, with so-called _neural theorem provers_ gaining popularity. In 2024, [DeepMind achieved silver-medal-level performance on IMO problems][deepmind]. Here's an example problem that AlphaProof was able to solve.

> **IMO 2024 (Problem 2).** Determine all pairs $(a, b)$ of positive integers for which there exist positive integers $g$ and $N$ such that
>
> $$
> \gcd(a^n + b, b^n + a) = g
> $$
>
> holds for all integers $n \geq N$.

This can be formalized in Lean as follows.

```lean
theorem imo_2024_p2 :
    {(a, b) |  0 < a ∧ 0 < b ∧
      ∃ g N, 0 < g ∧ 0 < N ∧
        ∀ n ≥ N, Nat.gcd (a ^ n + b) (b ^ n + a) = g} = {(1, 1)} :=
```

**Remark.** Notice that the original question is to _find all_ pairs. Here, that task is expressed as a statement that the set of solutions is exactly $\{(1, 1)\}$. Finding the candidate solution and proving that it is complete are separate parts of the task.

Here is the [original proof produced by AlphaProof][alpha-proof-imo-24-p2]:

<details>
<summary>AlphaProof full solution to IMO 2024 (Problem 2)</summary>

```lean
refine Set.eq_singleton_iff_unique_mem.mpr ⟨?_, ?_⟩
  · simp only [Set.mem_setOf]
    use one_pos; use one_pos
    use 2; use 1
    use two_pos; use one_pos
    rintro n -
    simp only [one_pow]
    exact Nat.gcd_self 2

  rintro ⟨a, b⟩
  rintro ⟨a_pos, b_pos, g, N, -, -, D⟩

  have a_coprime : a.Coprime (1 + a * b) := by
    rw [Nat.coprime_add_mul_left_right]
    exact Nat.coprime_one_right _
  have b_coprime : b.Coprime (1 + a * b) := by
    rw [Nat.coprime_add_mul_right_right]
    exact Nat.coprime_one_right _

  have a_euler := Nat.ModEq.pow_totient a_coprime
  have b_euler := Nat.ModEq.pow_totient b_coprime
  rw [←ZMod.natCast_eq_natCast_iff] at a_euler b_euler

  have totient_pos :=
    ((1 + a*b).totient_pos).mpr ((zero_le _).trans_lt (lt_one_add _))

  suffices h : 1 + a * b ∣ g
  · specialize D (φ (1+a*b)*N) (Nat.le_mul_of_pos_left N totient_pos)
    have ⟨Ha, Hb⟩ :=
      D ▸ Nat.gcd_dvd (a ^ (φ (1 + a * b) * N) + b) (b ^ (φ (1 + a * b) * N) + a)
    replace Ha := h.trans Ha; replace Hb := h.trans Hb
    clear g D a_coprime b_coprime totient_pos h
    rw [←ZMod.natCast_zmod_eq_zero_iff_dvd, pow_mul] at Ha Hb
    push_cast at a_euler b_euler Ha Hb
    rw [a_euler] at Ha; clear a_euler
    rw [b_euler] at Hb; clear b_euler
    rw [one_pow] at Ha Hb
    norm_cast at Ha Hb
    rw [ZMod.natCast_zmod_eq_zero_iff_dvd] at Ha Hb
    replace Ha := Nat.le_of_dvd (Nat.add_pos_right 1 b_pos) Ha
    replace Hb := Nat.le_of_dvd (Nat.add_pos_right 1 a_pos) Hb
    rw [Prod.mk.injEq]
    constructor <;> nlinarith only [a_pos, b_pos, Ha, Hb]

  suffices h : ∃ n ≥ N, 1 + a * b ∣ a * (a ^ n + b) ∧
                        1 + a * b ∣ b * (b ^ n + a)
  · obtain ⟨n, hn, h⟩ := h
    replace h := And.intro
      (Nat.Coprime.dvd_of_dvd_mul_left a_coprime.symm h.1)
      (Nat.Coprime.dvd_of_dvd_mul_left b_coprime.symm h.2)
    replace h := Nat.dvd_gcd h.1 h.2
    rw [D _ hn] at h
    exact h
  clear D g a_coprime b_coprime a_pos b_pos

  use φ (1 + a * b) * (N + 1) - 1
  use N.le_sub_of_add_le (Nat.le_mul_of_pos_left (N + 1) totient_pos)

  obtain ⟨w, h : _ = w + 1⟩ := Nat.exists_eq_add_of_le' totient_pos
  clear totient_pos
  simp only [←ZMod.natCast_zmod_eq_zero_iff_dvd, pow_add]
  push_cast at a_euler b_euler ⊢
  rw [h] at a_euler b_euler ⊢; clear h
  constructor <;>
  simp only [mul_add, ←pow_succ', mul_one, Nat.add_succ_sub_one] <;>
  rw [add_assoc, ←mul_add_one] <;>
  rw [pow_mul] <;>
  simp only [a_euler, b_euler] <;>
  clear a_euler b_euler <;>
  simp only [one_pow] <;>
  norm_cast <;>
  simp only [ZMod.natCast_zmod_eq_zero_iff_dvd] <;>
  ring_nf <;>
  exact dvd_refl _
```

</details>

In 2025, both [DeepMind][deepmind-imo-2025] and [OpenAI][openai-imo-2025] reported gold-medal-level IMO performance, each solving five of the six problems. Unlike AlphaProof's 2024 results, these solutions were written in natural language rather than Lean.

## Proofs in Lean

At this point we can touch on the core mechanics of actually doing mathematics in Lean. Recall that a theorem in Lean is a _type_, and a proof is obtained by constructing an expression of that type.

### Tactics

There are multiple ways to do this in Lean, but the way that most closely resembles mathematics (and thus the most common approach in places like `Mathlib`) is called a **tactic proof**. Tactic proofs begin with the keyword `by` and proceed by applying a sequence of tactics. A tactic is a _meta-program_ that helps automatically construct expressions of the desired type.

Here are some basic examples to give the idea.

<TacticTable>

<TacticRow name="rfl">

Closes a goal when the two sides of an equality are definitionally equal.

```lean
example : 1 = 1 := by
  rfl
```

</TacticRow>

<TacticRow name="rw">

`rw [e]` applies identity `e` as a rewrite rule to the target of the main goal.

```lean
example (a b : ℕ) (h : a = b) :
    a + 1 = b + 1 := by
  rw [h]
```

</TacticRow>

<TacticRow name="exact">

`exact e` closes the main goal if its target type matches that of `e`.

```lean
example (a : ℕ) : a + 0 = a := by
  exact Nat.add_zero a
```

</TacticRow>

<TacticRow name="apply">

`apply e` tries to match the current goal against the conclusion of `e`'s type.

```lean
example (p q : Prop) (h_p : p)
    (h_pq : p → q) : q := by
  -- we need to show q
  -- apply the hypothesis h_pq,
  -- so now we need to show p
  apply h_pq
  -- but we have p, it's exactly
  -- the hypothesis h_p!
  exact h_p
```

</TacticRow>

<TacticRow name="linarith">

A powerful tactic that solves linear inequalities of various kinds.

```lean
example : (0 : ℝ) ≤ 73 := by
  linarith
```

</TacticRow>

<TacticRow name="induction'">

`induction' n with d hd` starts a proof by induction. Here `hd` becomes the induction hypothesis - i.e., we assume the statement holds for `n = d` and need to prove it holds for `n = d + 1`.

```lean
example (a : ℕ) : a + 1 = 1 + a := by
  -- begin a proof by induction
  induction' a with d hd
  -- case a = 0 amounts to proving 1 = 1
  · rfl
  -- case a = d, the inductive step
  · linarith
```

</TacticRow>

<TacticRow name="simp">

Uses lemmas and hypotheses to simplify the main goal target or non-dependent hypotheses.

```lean
example (a b c d : ℕ) :
    (a + 0) * 1 + (b * 0 + c) +
      (d + 0) * 1 = a + c + d := by
  simp
```

</TacticRow>

</TacticTable>

Tactics allow us to approach proving statements in Lean in a similar way to proving statements in mathematics. In either setting, one structures their argument as a series of steps until the final goal has been obtained. Tactics are a powerful concept as they let you construct programs to write proofs interactively, procedurally and even automatically, as we will see.

### The proof state

Tactics, it turns out, are only half the story when writing proofs in Lean. The other half is the **proof state**. This is a representation of the current goal you are trying to prove, together with all the local context you have (like hypotheses that are given, or that you have established along the way).

Lean reports the current proof state in the Lean Infoview window (powered by the Lean LSP in tools like VS Code, for example). A typical view might look something like this:

```text
1 goal
n : ℕ
hn : 1 < n
⊢ ∃ k, IsPrime k ∧ k ∣ n
```

This can be read as follows:

- There is currently `1 goal`, that is, one thing we need to prove.
- We have a natural number `n : ℕ` and a hypothesis `hn : 1 < n` that $n$ is greater than 1.
- The thing we need to prove is after the `⊢` symbol. In this case we need to prove the existence of a number $k$ that divides $n$ and that is prime.

As you apply tactics, you modify the proof state. You might do this by adding new variables or hypotheses, by rewriting or adjusting the remaining goal, by splitting the existing goal into subgoals, and so forth.

### David Renshaw's chess analogy

David Renshaw [draws the following analogy][renshaw-analogy] between chess and Lean.

**Chess.** You can write down a chess game as a sequence of moves in [algebraic notation][chess-notation], but this leaves _implicit_ the main visual element of chess: the position of the pieces on the board. For example, here's a representation of the [_Game of the Century_][game-of-century].

```text
1.Nf3 Nf6 2.c4 g6 3.Nc3 Bg7 4.d4 O-O 5.Bf4 d5 6.Qb3 dxc4
7.Qxc4 c6 8.e4 Nbd7 9.Rd1 Nb6 10.Qc5 Bg4 11.Bg5 Na4
12.Qa3 Nxc3 13.bxc3 Nxe4 14.Bxe7 Qb6 15.Bc4 Nxc3
16.Bc5 Rfe8+ 17.Kf1 Be6 18.Bxb6 Bxc4+ 19.Kg1 Ne2+
20.Kf1 Nxd4+ 21.Kg1 Ne2+ 22.Kf1 Nc3+ 23.Kg1 axb6
24.Qb4 Ra4 25.Qxb6 Nxd1 26.h3 Rxa2 27.Kh2 Nxf2
28.Re1 Rxe1 29.Qd8+ Bf8 30.Nxe1 Bd5 31.Nf3 Ne4
32.Qb8 b5 33.h4 h5 34.Ne5 Kg7 35.Kg1 Bc5+ 36.Kf1 Ng3+
37.Ke1 Bb4+ 38.Kd1 Bb3+ 39.Kc1 Ne2+ 40.Kb1 Nc3+
41.Kc1 Rc2# 0-1
```

When we play chess we want to _see_ the board as a way to help reason over the game state.

**Lean.** You can write a proof in the Lean theorem prover as a sequence of steps, but this format leaves _implicit_ the main visual element of theorem proving: the goal state. For example, here's the statement about prime factors from earlier:

```lean
theorem exists_prime_factor :
    ∀ n, 1 < n → ∃ k, IsPrime k ∧ k ∣ n
```

When we use Lean we want to _see_ the goal we are trying to prove. Lean provides this information, and we can watch it evolve as we make steps in the proof. The walkthrough below follows the complete proof, from the initial goal to both cases being closed.

<ProofWalkthrough />

### Mathlib, and the growing repository of results

As mentioned above, `Mathlib` is an extensive library of definitions and theorems. As of November 2025, Mathlib had over 240k theorems and over 100k definitions. Lean supports importing and using existing results to help prove theorems. One simply needs to import the relevant module, e.g., `import Mathlib.Algebra.Polynomial.Basic`.

### Tactics and automation

Beyond the existence of a large repository of known results, Lean has various kinds of automation built in to assist the working mathematician.

**Example: Rewrite suggestion.** In Lean there is a rewrite move denoted `rw` which applies a fact to the current proof state to modify the goal. One can interact with Lean by asking `rw?` (with a question mark) to get suggestions based on your active state!

```lean
import Mathlib

example (a b c : Nat) : a * b * c = b * (a * c) :=
by
  rw?
```

Possible rewrite suggestions from `Mathlib` include:

```text
Try this: rw [Nat.mul_right_comm]
-- a * c * b = b * (a * c)
Try this: rw [Nat.mul_assoc]
-- a * (b * c) = b * (a * c)
Try this: rw [Nat.mul_left_comm]
-- a * b * c = a * (b * c)
Try this: rw [Nat.mul_comm]
-- c * (a * b) = b * (a * c)
Try this: rw [← Nat.mul_assoc]
-- a * b * c = b * a * c
```

## What's the difference between formal and informal reasoning, and why should you care?

Consider the following example question from AMC-12:

Let $x, y \in \mathbb{R}$ satisfy $|x + y| + |x-y| = 2$. Show that

$$
x^2 - 6x + y^2 \leq 8
$$

Here's an excerpt from GPT-5's attempt at solving this problem:

> The constraint $|x+y|+|x-y|=2$ is the boundary of a diamond (a square rotated $45^\circ$) with vertices $(\pm1,\pm1)$.
>
> We want to maximize
>
> $$
> f(x,y)=x^2-6x+y^2=(x-3)^2+y^2-9.
> $$
>
> So maximizing $f$ is the same as maximizing the squared distance from $(3,0)$:
>
> $$
> (x-3)^2+y^2.
> $$
>
> On that diamond, the farthest points from $(3,0)$ are the **left** vertices $(-1,1)$ and $(-1,-1)$. (Geometrically: draw the diamond and the point $(3,0)$; the farthest boundary points are the two left corners.)
>
> Evaluate:
>
> - $f(-1,1)=(-1)^2-6(-1)+1^2=1+6+1=8$.
> - $f(-1,-1)=1+6+1=8$.
> - For comparison, the right vertices give $f(1,\pm1)=1-6+1=-4$.
>
> **Answer**
>
> - **Maximum value:** (8)
> - **Where:** at $\boxed{(-1,1)\ \text{and}\ (-1,-1)}$

Notice:

- GPT-5 makes a geometric argument based on the shape determined by the given constraint.
- The vertices $(\pm1,\pm1)$ define an axis-aligned square. The model **incorrectly** describes it as rotated by 45 degrees.
- It gives no justification for identifying the constraint with that boundary.
- Completing the square correctly reduces the problem to maximizing the distance from $(3,0)$.
- The final maximizing points are correct, but the geometric explanation is muddled. A correct answer alone does not establish that the reasoning is sound.

Here's a picture of the region enclosed by the constraint in the problem (shaded in green). The constraint itself is the boundary of that region. Looking at this, it's possible to guess at the reason the model mentioned diamonds rotated by 45 degrees.

<ConstraintFigure />

Question: how much credit should be assigned to this answer? It has the right _flavor_, and indeed makes many of the correct steps. But it leaves a gap between a plausible explanation and a justified argument. Worse, that gap is **not obvious at a glance**! This makes an LLM-as-a-judge-based reward hard to trust.

Consider now the formal version of this problem:

```lean
example
  (x y : ℝ)
  (h₀ : abs (x + y) + abs (x - y) = 2) : x ^ 2 - 6 * x + y ^ 2 ≤ 8
```

Notice that it is straightforward to give the formal version of this problem in Lean.

The advantage of formalization is that the proof can be checked against a precise statement, rather than relying on a fallible LLM-as-a-judge. We still need to ensure that the formal statement matches the intended problem, that the proof has no gaps, and that it uses only permitted axioms.

Here is a model-generated formal solution. Before expanding the argument, here are some key observations:

- This argument was model-generated, showing that models are capable of detailed Lean-based proofs.
- The proof is over 80 lines long. There is some tax to pay for being precise in one's argument.
- If you are not familiar with Lean, the argument may be tricky to follow. But remember, Lean is just a programming language (admittedly with a fairly steep learning curve).

<details>
<summary>Full Lean proof</summary>

```lean
 by
  by_cases hxy : x + y ≥ 0
  · by_cases hxx : x - y ≥ 0
    · have hx : x = 1 := by
        rw [abs_of_nonneg hxy, abs_of_nonneg hxx] at h₀
        linarith
      have hy_le : y ≤ 1 := by linarith [hx, hxx]
      have hy_ge : y ≥ -1 := by linarith [hx, hxy]
      have hy_abs : abs y ≤ 1 := by
        apply abs_le.mpr
        exact ⟨hy_ge, hy_le⟩
      have hy_tmp : (abs y) ^ 2 ≤ abs y := by
        rw [pow_two]
        apply mul_le_of_le_one_right
        · simp
        · exact hy_abs
      have hy_sq : y ^ 2 ≤ 1 := by
        simpa [sq_abs] using le_trans hy_tmp hy_abs
      calc
        x ^ 2 - 6 * x + y ^ 2 = 1 - 6 + y ^ 2 := by simp [hx]
        _ = y ^ 2 - 5 := by ring
        _ ≤ 1 - 5 := by linarith [hy_sq]
        _ = -4 := by norm_num
        _ ≤ 8 := by linarith
    · have hy : y = 1 := by
        rw [abs_of_nonneg hxy, abs_of_nonpos (le_of_not_ge hxx)] at h₀
        linarith
      have hx_le : x ≤ 1 := by linarith [hy, hxx]
      have hx_ge : x ≥ -1 := by linarith [hy, hxy]
      have hx_abs : abs x ≤ 1 := by
        apply abs_le.mpr
        exact ⟨hx_ge, hx_le⟩
      have hx_tmp : (abs x) ^ 2 ≤ abs x := by
        rw [pow_two]
        apply mul_le_of_le_one_right
        · simp
        · exact hx_abs
      have hx_sq : x ^ 2 ≤ 1 := by
        simpa [sq_abs] using le_trans hx_tmp hx_abs
      have h_lin : -6 * x ≤ 6 := by
        linarith [hx_ge]
      calc
        x ^ 2 - 6 * x + y ^ 2 = x ^ 2 - 6 * x + 1 := by simp [hy]
        _ ≤ 1 + 6 + 1 := by linarith [hx_sq, h_lin]
        _ = 8 := by norm_num
  · by_cases hxx : x - y ≥ 0
    · have hy : y = -1 := by
        rw [abs_of_nonpos (le_of_not_ge hxy), abs_of_nonneg hxx] at h₀
        linarith
      have hx_ge : x ≥ -1 := by linarith [hy, hxx]
      have hx_le : x ≤ 1 := by linarith [hy, hxy]
      have hx_abs : abs x ≤ 1 := by
        apply abs_le.mpr
        exact ⟨hx_ge, hx_le⟩
      have hx_tmp : (abs x) ^ 2 ≤ abs x := by
        rw [pow_two]
        apply mul_le_of_le_one_right
        · simp
        · exact hx_abs
      have hx_sq : x ^ 2 ≤ 1 := by
        simpa [sq_abs] using le_trans hx_tmp hx_abs
      have h_lin : -6 * x ≤ 6 := by
        linarith [hx_ge]
      calc
        x ^ 2 - 6 * x + y ^ 2 = x ^ 2 - 6 * x + 1 := by simp [hy]
        _ ≤ 1 + 6 + 1 := by linarith [hx_sq, h_lin]
        _ = 8 := by norm_num
    · have hx : x = -1 := by
        rw [abs_of_nonpos (le_of_not_ge hxy), abs_of_nonpos (le_of_not_ge hxx)] at h₀
        linarith
      have hy_le : y ≤ 1 := by linarith [hx, hxy]
      have hy_ge : y ≥ -1 := by linarith [hx, hxx]
      have hy_abs : abs y ≤ 1 := by
        apply abs_le.mpr
        exact ⟨hy_ge, hy_le⟩
      have hy_tmp : (abs y) ^ 2 ≤ abs y := by
        rw [pow_two]
        apply mul_le_of_le_one_right
        · simp
        · exact hy_abs
      have hy_sq : y ^ 2 ≤ 1 := by
        simpa [sq_abs] using le_trans hy_tmp hy_abs
      calc
        x ^ 2 - 6 * x + y ^ 2 = 1 + 6 + y ^ 2 := by simp [hx]
        _ = 7 + y ^ 2 := by norm_num
        _ ≤ 7 + 1 := by linarith [hy_sq]
        _ = 8 := by norm_num
```

</details>

**Takeaways.**

This example highlights fundamental challenges with informal reasoning-based methods stemming from the difficulty with scalably identifying flawed reasoning trajectories, particularly in cases where the flaws are subtle. We see how formally verifiable solutions provide a remedy.

[lean-docs]: https://leanprover-community.github.io/
[future-of-mathematics]: https://www.youtube.com/watch?v=Dp-mQ3HxgDE
[xena-intro]: https://xenaproject.wordpress.com/2021/01/21/formalising-mathematics-an-introduction/
[imperial-math-repo]: https://github.com/ImperialCollegeLondon/formalising-mathematics-2024
[liquid-tensor]: https://xenaproject.wordpress.com/2020/12/05/liquid-tensor-experiment/
[liquid-pdf]: https://www.ma.imperial.ac.uk/~buzzard/xena/pdfs/liquid_tensor_experiment.pdf
[liquid-6mo]: https://xenaproject.wordpress.com/2021/06/05/half-a-year-of-the-liquid-tensor-experiment-amazing-developments/
[liquid-beyond]: https://xenaproject.wordpress.com/2022/09/12/beyond-the-liquid-tensor-experiment/
[liquid-deps]: https://leanprover-community.github.io/liquid/dep_graph_section_1.html
[tao-talk]: https://www.youtube.com/watch?v=_sTDSO74D8Q
[flt-docs]: https://lean-lang.org/use-cases/flt/
[deepmind]: https://deepmind.google/blog/ai-solves-imo-problems-at-silver-medal-level/
[deepmind-imo-2025]: https://deepmind.google/blog/advanced-version-of-gemini-with-deep-think-officially-achieves-gold-medal-standard-at-the-international-mathematical-olympiad/
[openai-imo-2025]: https://x.com/alexwei_/status/1946477742855532918
[alpha-proof-imo-24-p2]: https://gist.github.com/dwrensha/68de74feb8f0b0700ba5454ae056a191
[mathlib]: https://github.com/leanprover-community/mathlib4
[mathlib-white-paper]: https://arxiv.org/abs/1910.09336
[mathlib-growth-paper]: https://arxiv.org/pdf/2508.21593v2
[mathlib-stats]: https://leanprover-community.github.io/mathlib_stats.html
[renshaw-analogy]: https://www.youtube.com/watch?v=KuxFWwwlEtc
[chess-notation]: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
[game-of-century]: https://en.wikipedia.org/wiki/Game_of_the_Century_(chess)
