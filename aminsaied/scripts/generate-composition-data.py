#!/usr/bin/env python3
"""Reconstruct the article's coefficients with exact symmetric functions.

This is a data-export implementation of s_mu[Lie], truncated by output degree,
not the decomposition-puzzle algorithm or the baseline benchmark from the paper.
Uses only Python's standard library. Run from any directory with Python 3.9+.

Lie_d = (1/d) sum_{k | d} mobius(k) p_k^(d/k).
s_mu = sum_{rho |- |mu|} character(mu, rho) p_rho / z_rho.
Characters are computed by the Murnaghan-Nakayama rule on beta numbers.
"""

from collections import Counter, defaultdict
from fractions import Fraction
from functools import lru_cache
from hashlib import sha256
from math import factorial
from pathlib import Path
import argparse
import json


DEGREE = 14
OUTPUT = (
    Path(__file__).resolve().parents[1]
    / "src/components/CompositionFactors/coefficients.json"
)
BASELINE_OUTPUT = OUTPUT.with_name("degree-five.json")


@lru_cache(maxsize=None)
def partitions(n, largest=None):
    if n == 0:
        return ((),)
    largest = min(n, n if largest is None else largest)
    return tuple(
        (first,) + rest
        for first in range(largest, 0, -1)
        for rest in partitions(n - first, first)
    )


@lru_cache(maxsize=None)
def character(shape, cycle):
    if not cycle:
        return int(not shape)
    length = len(shape)
    beta = tuple(part + length - i - 1 for i, part in enumerate(shape))
    hook = cycle[0]
    result = 0
    for bead in beta:
        destination = bead - hook
        if destination < 0 or destination in beta:
            continue
        moved = sorted(
            (destination if value == bead else value for value in beta),
            reverse=True,
        )
        remainder = tuple(
            value - length + i + 1
            for i, value in enumerate(moved)
            if value - length + i + 1 > 0
        )
        height = sum(destination < value < bead for value in beta)
        result += (-1) ** height * character(remainder, cycle[1:])
    return result


def centralizer(cycle):
    result = 1
    for part, count in Counter(cycle).items():
        result *= part**count * factorial(count)
    return result


def mobius(n):
    sign = 1
    prime = 2
    while prime * prime <= n:
        if n % prime == 0:
            n //= prime
            sign *= -1
            if n % prime == 0:
                return 0
        prime += 1
    return -sign if n > 1 else sign


@lru_cache(maxsize=None)
def adams_lie(step):
    terms = {}
    for degree in range(1, DEGREE // step + 1):
        for divisor in range(1, degree + 1):
            if degree % divisor == 0 and mobius(divisor):
                shape = (step * divisor,) * (degree // divisor)
                terms[shape] = Fraction(mobius(divisor), degree)
    return terms


@lru_cache(maxsize=None)
def power_plethysm(cycle):
    if not cycle:
        return {(): Fraction(1)}
    result = defaultdict(Fraction)
    for left, a in power_plethysm(cycle[:-1]).items():
        for right, b in adams_lie(cycle[-1]).items():
            if sum(left) + sum(right) <= DEGREE:
                result[tuple(sorted(left + right, reverse=True))] += a * b
    return {shape: value for shape, value in result.items() if value}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def write_baseline(payload):
    count = sum(sum(shape) <= 5 for shape in payload["partitions"])
    require(count == 18, "The degree-five baseline must contain 18 partitions")
    baseline = {
        "partitions": payload["partitions"][:count],
        "matrix": [row[:count] for row in payload["matrix"][:count]],
    }
    BASELINE_OUTPUT.write_text(json.dumps(baseline, separators=(",", ":")) + "\n")
    print(f"Wrote {count} x {count} static-figure coefficients to {BASELINE_OUTPUT}")


def main():
    shapes = [
        shape for degree in range(1, DEGREE + 1) for shape in partitions(degree)
    ]
    index = {shape: i for i, shape in enumerate(shapes)}
    matrix = [[0] * len(shapes) for _ in shapes]
    characters = {}

    for degree in range(1, DEGREE + 1):
        block = partitions(degree)
        table = [[character(shape, cycle) for cycle in block] for shape in block]
        classes = [factorial(degree) // centralizer(cycle) for cycle in block]
        for i, left in enumerate(table):
            for j in range(i + 1):
                inner = sum(a * b * size for a, b, size in zip(left, table[j], classes))
                require(
                    inner == (factorial(degree) if i == j else 0),
                    f"Character orthogonality failed at degree {degree}: {i}, {j}",
                )
        characters[degree] = table

    for degree in range(1, DEGREE + 1):
        block = partitions(degree)
        scaled_powers = []
        for cycle in block:
            scaled = {}
            for shape, value in power_plethysm(cycle).items():
                # Scaling degree-n terms by n! keeps the basis changes integral.
                numerator = value * factorial(sum(shape))
                require(numerator.denominator == 1, "Non-integral character numerator")
                scaled[shape] = numerator.numerator
            scaled_powers.append(scaled)

        for mu, row in zip(block, characters[degree]):
            numerators = defaultdict(int)
            for cycle, coefficient, powers in zip(block, row, scaled_powers):
                weight = coefficient * (factorial(degree) // centralizer(cycle))
                if weight:
                    for shape, value in powers.items():
                        numerators[shape] += weight * value

            for target in range(degree, DEGREE + 1):
                values = [numerators[shape] for shape in partitions(target)]
                denominator = factorial(degree) * factorial(target)
                for lambda_, char_row in zip(partitions(target), characters[target]):
                    numerator = sum(a * b for a, b in zip(values, char_row))
                    value, remainder = divmod(numerator, denominator)
                    require(
                        remainder == 0 and 0 <= value < 2**53,
                        f"Invalid coefficient at {lambda_}, {mu}: {numerator}/{denominator}",
                    )
                    matrix[index[lambda_]][index[mu]] = value
        print(f"Computed columns for |mu| = {degree}", flush=True)

    for i, lambda_ in enumerate(shapes):
        for j, mu in enumerate(shapes):
            if sum(lambda_) == sum(mu):
                require(matrix[i][j] == int(i == j), "Equal-degree identity failed")

    # Published examples, not values obtained from the figures.
    examples = [
        ((4, 2), (1, 1, 1), 2),
        ((4, 3, 3), (3, 2), 84),
        ((2, 1, 1), (1, 1), 2),
        ((3, 1), (1, 1), 1),
    ]
    for lambda_, mu, expected in examples:
        require(
            matrix[index[lambda_]][index[mu]] == expected,
            f"Original repository example disagrees: {lambda_}, {mu}",
        )

    degree_four = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0],
        [0, 2, 1, 0, 1, 1, 0, 0, 1, 0, 0],
        [1, 1, 2, 1, 2, 1, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    ]
    require(
        [row[:11] for row in matrix[:11]] == degree_four,
        "Original repository degree-four matrix disagrees",
    )

    matrix_json = json.dumps(matrix, separators=(",", ":"))
    payload = {
        "degree": DEGREE,
        "partitionOrder": "increasing degree, then reverse lexicographic",
        "rows": "lambda",
        "columns": "mu",
        "method": "exact degree-truncated power-sum plethysm",
        "paper": "https://arxiv.org/abs/1711.04326",
        "referenceCommit": "524d90f982ce447b3ddaec0f53409e31d9de5872",
        "matrixSha256": sha256(matrix_json.encode()).hexdigest(),
        "partitions": shapes,
        "matrix": matrix,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, separators=(",", ":")) + "\n")
    write_baseline(payload)
    print(
        f"Wrote {len(shapes)} x {len(shapes)} exact coefficients to {OUTPUT}\n"
        f"Maximum: {max(map(max, matrix))}; SHA-256: {payload['matrixSha256']}"
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--baseline-only",
        action="store_true",
        help="Extract the static degree-five figure data from the existing full table.",
    )
    args = parser.parse_args()
    if args.baseline_only:
        write_baseline(json.loads(OUTPUT.read_text()))
    else:
        main()
