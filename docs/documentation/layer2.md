# Layer 2 · Matching and eligibility

Layer 2 answers two separate questions: *which programmes are relevant to this researcher?* and *which of them is
the researcher eligible for?* The first is a search problem; the second is a logic problem. They are handled by
different methods on purpose.

## Research matcher: hybrid search

**What it does.** Retrieves the programmes most relevant to the researcher's interests from the whole library.

**Method.** Two searches are combined:

- **Keyword search (BM25)** [[17]](../references.md) matches exact terms, such as "postdoctoral", a field name or a
  programme acronym.
- **Dense search** compares embeddings [[5]](../references.md), [[19]](../references.md), so it also matches
  paraphrases ("funding for early-career researchers" and "postdoctoral fellowship").
- **Reciprocal rank fusion** [[18]](../references.md) merges the two ranked lists without having to put their scores
  on a common scale. Keyword results are weighted 2:1.

**Why this method.** Funding pages are full of exact names and acronyms, which favour keyword search; paraphrased
queries favour dense search. A cross-encoder reranker could add accuracy but was not used: on a CPU it adds latency
for marginal gains at this scale.

**Evidence: known-item benchmark.** 100 programmes were sampled at random. For each, a model from a different company
than the embedder wrote the query a qualifying researcher might type, in its own words and without the programme's or
funder's name. The programme is the single correct answer.

<div class="bars" markdown>
<div class="row"><span>Dense only</span><div class="track"><div class="fill" style="width:73%"></div></div><span class="val">73%</span></div>
<div class="row"><span>Keyword only (BM25)</span><div class="track"><div class="fill" style="width:88%"></div></div><span class="val">88%</span></div>
<div class="row"><span>Hybrid, equal weights</span><div class="track"><div class="fill" style="width:89%"></div></div><span class="val">89%</span></div>
<div class="row"><span><b>Hybrid, keyword 2:1 (used)</b></span><div class="track"><div class="fill alt" style="width:93%"></div></div><span class="val">93%</span></div>
<div class="caption">Recall@5: share of queries whose target programme appears in the top five results. 95% confidence interval for the method used: 88–97%.</div>
</div>

| Method | Recall@1 | Recall@5 | Recall@10 | MRR | ms per query |
|---|---|---|---|---|---|
| Dense only | 0.49 | 0.73 | 0.83 | 0.60 | 11 |
| Keyword only (BM25) | 0.72 | 0.88 | 0.93 | 0.79 | 0.5 |
| Hybrid, equal weights | 0.66 | 0.89 | 0.94 | 0.76 | 12 |
| **Hybrid, keyword 2:1** | 0.69 | **0.93** | **0.94** | 0.79 | 14 |

A negative result: rewriting programme descriptions in plain English before embedding them did not improve dense
search (MRR 0.59).

## Eligibility gate

**What it does.** Tests every rule of every candidate programme against the profile, one line at a time, and places
each programme in one of three groups.

**Method.** *Deterministic constraint satisfaction* over the rule register. Each rule has one of five outcomes:

| Outcome | Meaning |
|---|---|
| Pass | The profile meets the rule |
| Fail | The profile does not meet the rule |
| Near | A soft rule is missed by a small margin (e.g. IELTS 0.5 below the requirement) |
| Conditional | Met once the current degree is completed |
| Unknown | The profile does not contain the attribute. Never treated as a pass |

<div class="flow" markdown>
<div class="step"><strong>Eligible</strong>No rule fails. Passed on to ranking.</div>
<div class="step"><strong>Within reach</strong>Only soft, closable gaps. Shown separately, easiest gap first.</div>
<div class="step hot"><strong>Excluded</strong>A hard rule fails, for example nationality. Never shown as a match.</div>
</div>

**Why rules, not a model.** The same input always gives the same answer, every decision can be traced to a quoted
rule, and the logic can be tested. A language model deciding eligibility would be non-deterministic and hard to
audit, and models are known to struggle with negation [[6]](../references.md).

**Evidence.** 32 of 32 hand-checked unit tests (one per rule type and outcome) and 4 of 4 consistency checks pass, for
example "a programme is never both eligible and excluded". The gate runs in under a millisecond per programme.

**Where it fails.** The gate is only as good as the rules it receives, which is why every rule is verified in Layer 0
first.

## Near-miss set

**What it does.** Shows programmes that the researcher narrowly misses, ordered by how much effort it would take to
close the gap.

**Method.** *Soft-constraint relaxation*: hard rules (nationality, age, years since PhD) exclude; soft rules missed
within a margin create a near miss. Near misses are ordered by an estimated **gap cost** in weeks, for example 0.5
IELTS points ≈ 4 weeks, one career step ≈ 26 weeks.

**Limitation.** The effort estimates are hand-set approximations. Near misses are also rare in practice, because
funding pages seldom state numeric thresholds: a minimum GPA appears in 17 of 598 records and an IELTS score in 2.
