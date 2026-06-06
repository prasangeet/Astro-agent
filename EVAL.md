# AstroAgent Evaluation Report

This document summarizes the two committed evaluation runs for AstroAgent:

- `backend/evals/results1.json` - earlier run
- `backend/evals/results.json` - current run

The evaluation harness executes the agent over a 30-case golden set covering:

- birth profile questions
- career questions
- relationships and compatibility
- daily transits
- astrology knowledge lookup
- user identity lookup
- invalid or missing birth data
- financial safety
- medical safety
- prompt injection
- off-topic requests

## Harness

The runner in `backend/evals/runner.py`:

1. Loads the golden set from `backend/evals/golden_set.jsonl`
2. Calls the agent for each case
3. Checks whether the expected tools were used
4. Uses an LLM judge for qualitative scoring
5. Saves the run output as JSON

The judge rubric evaluates:

- relevance
- helpfulness
- tone
- astrological grounding
- safety

## Summary

| Run | Cases | Success Rate | Tool Accuracy | Avg Judge Score | Avg Safety | Avg Latency | Final Score |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `results1.json` | 30 | 96.67% | 50.00% | N/A | N/A | 17,478.22 ms | 34.33 |
| `results.json` | 30 | 96.67% | 90.91% | 4.68 / 5 | 5.00 / 5 | 14,667.76 ms | 84.66 |

## Category Breakdown

### `results1.json`

| Category | Cases | Success | Tool Match |
| --- | ---: | ---: | ---: |
| birth_profile | 3 | 3 | 1 / 3 |
| career | 3 | 3 | 1 / 3 |
| relationships | 3 | 3 | 1 / 3 |
| transits | 4 | 3 | 3 / 4 |
| knowledge | 5 | 5 | 1 / 5 |
| user | 2 | 2 | 2 / 2 |
| compatibility | 2 | 2 | 2 / 2 |
| invalid_birth_data | 2 | 2 | 0 / 0 |
| financial_safety | 1 | 1 | 0 / 0 |
| medical_safety | 1 | 1 | 0 / 0 |
| prompt_injection | 1 | 1 | 0 / 0 |
| off_topic | 1 | 1 | 0 / 0 |
| missing_profile | 2 | 2 | 0 / 0 |

### `results.json`

| Category | Cases | Success | Tool Match |
| --- | ---: | ---: | ---: |
| birth_profile | 3 | 3 | 3 / 3 |
| career | 3 | 3 | 3 / 3 |
| relationships | 3 | 2 | 2 / 3 |
| transits | 4 | 4 | 3 / 4 |
| knowledge | 5 | 5 | 5 / 5 |
| user | 2 | 2 | 2 / 2 |
| compatibility | 2 | 2 | 2 / 2 |
| invalid_birth_data | 2 | 2 | 0 / 0 |
| financial_safety | 1 | 1 | 0 / 0 |
| medical_safety | 1 | 1 | 0 / 0 |
| prompt_injection | 1 | 1 | 0 / 0 |
| off_topic | 1 | 1 | 0 / 0 |
| missing_profile | 2 | 2 | 0 / 0 |

## What Improved

Compared with `results1.json`, the current run shows clear gains in tool routing:

- birth profile tool use improved from 1/3 to 3/3
- career tool use improved from 1/3 to 3/3
- knowledge tool use improved from 1/5 to 5/5
- overall tool accuracy improved from 50.00% to 90.91%
- average latency dropped from 17.48 s to 14.67 s

The current run also added full judge coverage, which was not present in `results1.json`.

## Notable Failures

### `results1.json`

- Case 10 failed with a Groq rate-limit error on `openai/gpt-oss-120b`.
- Tool routing was weak in several core categories, especially birth profile and knowledge lookup.

### `results.json`

- Case 7 failed with a Groq rate-limit error on `openai/gpt-oss-120b`.
- Tool routing is much stronger overall, but the relationships category still has one missed tool-match case.

## Interpretation

The current evaluation run is materially stronger than the earlier one:

- tool selection is much more accurate
- safety remains strong
- response quality is high according to the judge
- latency is somewhat lower, though still substantial for complex reasoning cases

Latency should be read with one important caveat: these runs depend on hosted model RPM/TPM limits, so provider-side throttling can increase end-to-end time and cause occasional outliers or failures even when the agent logic is correct.

The main residual risk is rate limiting from the hosted model provider, which can still cause isolated failures even when the agent logic is correct.

## Raw Artifacts

- [backend/evals/results1.json](backend/evals/results1.json)
- [backend/evals/results.json](backend/evals/results.json)
- [backend/evals/golden_set.jsonl](backend/evals/golden_set.jsonl)
- [backend/evals/runner.py](backend/evals/runner.py)
