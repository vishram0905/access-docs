# Layer 3 · Ranking and explanation

Layer 3 orders the eligible programmes by fit and explains each result. It follows one user-experience principle:
**answer first, then refine.**

<div class="flow" markdown>
<div class="step"><strong>0.4 s · Instant results</strong>Search and eligibility gate. No cloud AI is involved, so results appear even if every model provider is down.</div>
<div class="step"><strong>~15 s · Fit ranking</strong>In the background, a language model scores each eligible programme for fit and gives a reason.</div>
<div class="step hot"><strong>On request · Plan and Q&amp;A</strong>An application plan, and answers to questions, each citing the official page.</div>
</div>

## Fit ranker

**What it does.** Scores every eligible programme from 0 to 100 for fit with the researcher's field, career stage
and goals, with a one-sentence reason.

**Method.** *An LLM used as a ranker*, scoring candidates in batches of ten, combined with semantic similarity by
**late fusion**:

> final score = 0.7 × fit score + 0.3 × semantic similarity (rescaled to 0–100)

**Design safeguards.**

- The ranker only **orders** results. It can never add or remove a programme; the eligibility gate alone decides that.
- If a model skips items, a second pass scores them. If the main model is unavailable, a fallback chain across three
  companies takes over. Each item records which model scored it, because scores from different models are not on the
  same scale.
- Without any score, results stay in similarity order and are labelled as such. A score is never invented.

**Why this method.** The state of the art for LLM ranking is sliding-window listwise reranking, which needs several
model calls per search; on a rate-limited free tier, batches of ten give context across candidates at a fraction of the
calls. The 0.7 / 0.3 weights are expert choices, not learned.

**Evidence.** Initially, three or four of 30 programmes were left unranked and ranking took 215–531 s, because
background verification filled the shared per-minute model quota. After batching and giving live requests priority
over background work, one test persona had 29 of 29 programmes ranked in 55 s and another 17 of 17 in 15 s. The cost:
background verification runs up to 40% slower.

## Online reviewers

Two reviewers from different companies rate the relevance of the top 15 eligible results and five near misses. A
low rating moves a result to the end, with the reason shown, but **never removes it**: in testing, one reviewer
wrongly dropped a valid scholarship, and an eligible result must not disappear because of one model's opinion.

## Application plans and questions

**What it does.** For any programme, ACCESS can write an application plan or answer a question such as "Do I need
work experience?".

**Method.** *Retrieval-augmented generation* [[10]](../references.md), scoped to that programme's official page. The
page is split into overlapping passages; the most relevant passages are retrieved with hybrid search; the model must
answer only from those passages, cite them and copy quotes word for word. Every quote is then checked against the page
text. If the passages do not contain the answer, the model must reply "The official page does not say."

**Evidence.** 24 of 24 answers to a fixed set of questions were faithful: every quote appeared on the page and every
citation pointed to a retrieved passage (exact 95% lower bound 0.86). Median answer time 2.7 s. 42% of answers were
"The official page does not say." This check proves the quotes are real; it does not test whether the answer follows
logically from them.

**A bug found by this evaluation.** The first run scored 79%. Every rejected quote was in fact on the page: the checker
did not recognise citations written as "P5" instead of "5". After the fix, the same answers scored 24 of 24.
