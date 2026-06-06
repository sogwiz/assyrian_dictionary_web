# Translation Eval Harness

Measures the quality and cost of the multi-word translation endpoint
(`POST /api/translate`) against a curated golden set.

- **Golden set** (`golden-set.json`) — the data: English inputs paired with reviewed Assyrian expected outputs.
- **Eval** (`run-eval.js`) — the process: runs each case, scores it, reports per-stratum quality + cost.

## Run it

Run inside the web container so dependencies and `GEMINI_API_KEY` are available:

```bash
# Quick scores (chrF + structural + must_contain) — no extra LLM cost
docker-compose -f docker-compose-dev.yaml exec web node eval/run-eval.js

# Add semantic LLM-as-judge grading (costs ~1 Gemini call per case)
docker-compose -f docker-compose-dev.yaml exec web node eval/run-eval.js --judge
```

Override the target with `EVAL_BASE_URL` (default `http://localhost:3001`).
Results are written to `eval/results/eval-<timestamp>.json` for trend tracking.

## Scoring layers

| Layer | What it measures | Notes |
|-------|------------------|-------|
| **Structural** | Valid `translations[0]` with default/masculine/feminine `east`, valid `confidence` | Hard gate — the UI needs these |
| **must_contain** | Required vocabulary glyphs appear in the default output | Hard check, optional per case |
| **chrF** | Character n-gram F-score vs. expected (+ acceptable alternatives) | Right metric for low-resource, morphologically rich Sureth; better than word-level BLEU |
| **LLM judge** (`--judge`) | Semantic adequacy + fluency, 1–5 | Continuous signal; has model bias — anchor with human review |

chrF is reported in `[0,1]`. Treat it as a **regression signal**, not an absolute
truth — track whether a prompt/model change moves it up or down. Anchor periodically
with native-speaker review of a sample.

## Defining cases

Add entries to `cases[]` in `golden-set.json`. Schema is documented in the
`schema` block of that file. Minimum viable case:

```json
{
  "id": "request-want-water-001",
  "input": "I want to drink water",
  "stratum": "request",
  "reviewed_by": "native-speaker:sargon",
  "expected": { "default": { "east": "ܐܵܢܵܐ ܟܹܐ ܒܵܥܹܐ ܫܵܬܹܐ ܡܲܝ̈ܵܐ" } },
  "acceptable_alternatives": [],
  "must_contain": ["ܡܲܝ̈ܵܐ"]
}
```

Guidance:

- **Stratify.** Spread cases across `greeting | request | question | statement | tense | negation | gendered | idiom` so a single weak category can't hide behind a good average. The report breaks down chrF per stratum.
- **Review before trusting.** Cases with `reviewed_by: "unreviewed"` are flagged in the report — their scores are not ground truth until a native speaker verifies the expected output. **The three seed cases ship as `unreviewed` placeholders; verify them first.**
- **Use `acceptable_alternatives`** for the common case where several translations are equally correct — the scorer credits the closest one.
- **Use `must_contain`** to lock in non-negotiable vocabulary (e.g. the word for "water") even when phrasing varies.
- **Grow toward a few hundred** cases. 50–75 is a regression smoke-test, not a statistically confident benchmark.

## Cost accounting

Every translation call logs a `TRANSLATE_COST` line server-side with token counts,
estimated USD, and latency, and returns a `usage` object the harness aggregates.
Pricing is configurable via env (`GEMINI_INPUT_PRICE_PER_M`,
`GEMINI_OUTPUT_PRICE_PER_M`) so cost stays accurate as Gemini pricing changes.

The eval summary prints total tokens, total cost, and average cost per call —
your baseline for deciding whether the LLM approach is economical at scale.
