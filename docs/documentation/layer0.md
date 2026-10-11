# Layer 0 · Building the library

Layer 0 runs offline and continuously. It turns web pages into **verified programme records**: structured
descriptions of funding programmes in which every displayed fact has been checked against the funder's own page.
Because it runs in the background, slow and careful verification never delays a user's search.

<div class="flow" markdown>
<div class="step"><strong>1 · Harvester</strong>Finds and fetches funder pages; discards irrelevant ones cheaply</div>
<div class="step"><strong>2 · Normalizer</strong>Extracts each programme into a fixed schema, with a quote per fact</div>
<div class="step hot"><strong>3 · Info Critic</strong>Verifies each fact with a three-company judge panel</div>
<div class="step"><strong>4 · Library</strong>Vector index (meaning) and rule register (eligibility rules)</div>
</div>

The **Auditor** tests the Info Critic with planted errors, and the **Sentinel** monitors the whole pipeline.

## The funnel

<div class="bars" markdown>
<div class="row"><span>Pages fetched</span><div class="track"><div class="fill" style="width:100%"></div></div><span class="val">92,016</span></div>
<div class="row"><span>Programme records extracted</span><div class="track"><div class="fill" style="width:14%"></div></div><span class="val">1,207</span></div>
<div class="row"><span>Fully verified</span><div class="track"><div class="fill alt" style="width:4.5%"></div></div><span class="val">370</span></div>
<div class="caption">From 6,467 websites, as of 12 October 2026. Bars are not to scale. Of the extracted records, 252 have at least one claim withheld and 585 are still waiting for the claim check.</div>
</div>

Most fetched pages are not funding programmes (27,496) or are duplicates (6,025). About 18,900 further candidate pages
are waiting to be read by the Normalizer. **We chose to verify existing records before extracting more**: a
smaller library in which every row is checked is more useful than a larger one that cannot be trusted.

---

## 1 · Harvester

**What it does.** Finds funding websites, fetches their pages, renders pages that are built by JavaScript, and keeps
pages that look like a single funding programme.

**Method.**

- *Prioritised sources.* National and government scholarship schemes first, then universities in ranking order (QS
  World University Rankings 2026), starting from each university's central scholarships page. Within the priority
  countries, the country with the fewest verified programmes is served next, so a large queue for one country cannot
  starve another (*max-min fairness*).
- *Polite crawling.* robots.txt is respected, one request per website at a time, with delays and back-off. Sites that
  block automated access are read from the Internet Archive instead, labelled with the snapshot date; protection is
  never circumvented.
- *A free keyword filter* scores each page before any language model sees it. This is the cascade principle: the
  model quota is the scarcest resource.
- *Duplicate detection* by a fingerprint of each page's text (SHA-256 hash).
- *A headless browser* (Playwright) renders pages whose content only appears after JavaScript runs.

**Why this method.** The state of the art for targeted crawling is *focused crawling* with a learned link classifier.
We did not use it: it needs labelled training links, and the bottleneck is the extraction quota, not crawling, so a
smarter crawler would not increase the number of verified records per day.

**Evidence** (crawl log, one row per request, 7 October):

| Measure | Value |
|---|---|
| Fetched successfully | 72% of 84,415 requests |
| Skipped because robots.txt disallows | 501 requests |
| Pages passed to the Normalizer that were real programmes (precision) | 67% (1,762 of 2,612) |
| …that were index pages listing programmes (used for their links) | 25% |
| …that were irrelevant | 7% |
| Real programmes the filter discarded (miss rate), random sample of 60 | 10% (95% CI 5–20%) |

**Where it fails.** The filter misses about one programme page in ten. Of the six misses in the sample, two scored just
under the threshold, two were not in English, and two were old news items. Adding foreign-language keywords rescued
none of the six and let three irrelevant pages through, so it was reverted: the misses fail on page structure, not
vocabulary. Lowering the threshold would raise recall, but recall is not the bottleneck while thousands of pages wait
for extraction.

---

## 2 · Normalizer

**What it does.** A language model reads each candidate page and fills a **fixed schema** of about 50 typed fields:
programme type, career levels, host country, deadline, amount, coverage of tuition and travel, and eligibility rules.

**Method.** *Zero-shot, schema-constrained information extraction* with Google Gemini. "Zero-shot" means the model is
given instructions and the schema, but no training examples. Each eligibility rule is stored as a typed triple, for
example `nationality in [Singapore, Singapore PR]`, marked as hard or soft, and every field must carry a
**word-for-word quote** from the page. The quote is what later makes the fact checkable.

**Example of a verified record** (LKY-STEP Award, Singapore):

| Field | Value | Quote from the page |
|---|---|---|
| Nationality | Singapore citizen or permanent resident | "Be Singapore Citizens or Singapore Permanent Residents." |
| Amount | 3,500 SGD, one-time | "One-time cash award of S$3,500." |
| Career level | Undergraduate | "Be matriculating into a full-time undergraduate degree course…" |
| Verification | Each rule confirmed by 3 of 3 judges | |

**Why this method.** A fine-tuned extractor would need labelled training data, which does not exist for this task;
hand-written parsers break across thousands of different site layouts. Zero-shot extraction generalises across
layouts with no training data.

**Trade-off.** The free tier allows roughly 500 pages per day, which is the main limit on throughput. A rule the page
states but the model misses cannot be enforced; the Q&A feature (Layer 3) can still surface it from the page text.

### The host-country field

Originally, programmes held in more than one country were labelled with a single value, "Multiple". Search treated
this as a wildcard, so such programmes appeared under **every** country filter. The field now holds an explicit list
of countries or regions, a flag for programmes open to any destination, and a supporting quote, all verified like any
other claim. A list the judges cannot confirm becomes "not stated", which remains visible to every search rather than
hiding the programme. The effect on a search for Japan: about 156 results before, 94 after.

---

## 3 · Info Critic

**What it does.** Decides what a user is allowed to see. It verifies each record in two stages and publishes only
records whose displayed facts are all confirmed.

**Method.**

<div class="flow" markdown>
<div class="step"><strong>A · Whole record</strong>Three judges: is this page a funding programme, and does the record describe it?</div>
<div class="step"><strong>B1 · Locate</strong>Code finds each claim's quote, date or amount on the page. Not found means not confirmed, at zero model cost.</div>
<div class="step"><strong>B2 · Interpret</strong>Three judges see only the located passage and vote on one claim at a time.</div>
<div class="step hot"><strong>C · Decide</strong>A majority confirms: the claim is shown. Otherwise it is withheld as "not stated".</div>
</div>

The claims checked are each eligibility rule, the deadline, the amount, "fully funded", the programme type and the
host country. A record is **verified** only if every claim it shows is confirmed and at least one eligibility rule is
confirmed.

- *An ensemble of heterogeneous judges.* The judge pool holds six models from six companies (OpenAI, Alibaba, NVIDIA,
  Zhipu, Microsoft and Meta). Each record is judged by three of them, from three different companies, and never by the
  extractor's company (Google). A record is never decided by fewer than three judges; it waits.
- *Claim decomposition*, following FActScore [[9]](../references.md): a whole-record verdict hides which part is
  wrong, so each claim is checked separately.
- *Locate, then interpret.* For dates and amounts, exact matching on the page is free and more reliable than a
  model's reading, so it runs first. The judges then answer a narrow question about one passage, with known traps
  listed (for example, an intake date is not a deadline; a range is not a single value).

**Why this method.** A single strong judge is cheaper but shows known biases [[4]](../references.md),
[[12]](../references.md). A majority vote outperforms its members only if their errors are independent (Condorcet's
jury theorem); judges from different companies are less likely to share blind spots [[11]](../references.md).

**Evidence.**

- *Agreement between judges:* Fleiss' κ = 0.51 over 1,888 rule judgements [[14]](../references.md), "moderate" on the
  Landis and Koch scale [[15]](../references.md). Some disagreement is expected from independent judges; near-perfect
  agreement would suggest an echo chamber.
- *Why stage B was added:* measured on 575 records, whole-record judging was wrong in both directions. It marked 93% of
  correct deadlines and 91% of correct amounts as unconfirmed, yet caught only 27% of planted deadline errors and 21% of
  planted amount errors (see the Auditor below).
- *Locate step, all records, no model cost:* true claims located: deadline 85%, amount 92%, rule quote 98%. Planted
  wrong deadlines were located in only 0.5% of cases and inflated amounts in 0%, so they are caught before any judge reads them.

**Trade-offs.** Three extra short judge calls per record mean about 40% fewer records verified per day on free quota.
Exact matching can miss a true value written in an unusual format; the cost is a withheld claim, never a wrong one shown.

### A wording effect, measured with a control

Judges rejected correct amounts when the claim said "the programme pays X" and the page said "up to X". After the claim
was reworded to accept a stated maximum, **35 of 44** previously rejected amounts were confirmed. Because loosening a
check could also let wrong values through, we ran a **negative control**: deliberately wrong amounts on the same pages.
Only **1 of 28** was accepted, and that value matched a real award tier on the page.

### Trust score

Each verified record also receives a transparent trust score: a weighted sum of source authenticity (0.25), funding
vote (0.20), rule support (0.20), grounding of quotes (0.20), judge agreement (0.10) and validation checks (0.05).
The weights are expert choices, not learned, because no labelled outcomes existed at design time. The Auditor's test
results provide labelled data from which the weights could later be learned.

---

## 4 · Auditor

**What it does.** Measures the Info Critic instead of trusting it.

**Method.** *Fault injection*, also known as mutation testing [[16]](../references.md): take a verified record, insert
one known error, and run it through verification exactly as deployed. Because the location of the error is known,
the detection rate can be measured directly. Five error types are planted: an invented eligibility rule, a flipped
nationality rule ("open to" ↔ "not open to"), a deadline shifted by months, an amount multiplied by four, and a record
paired with another programme's page. The Auditor also re-reads random pages blind and compares its extraction with
the stored record. It is never one of the judges whose work it tests.

**Evidence: whole-record panel alone, 768 planted errors.**

<div class="bars" markdown>
<div class="row"><span>Invented rule</span><div class="track"><div class="fill" style="width:100%"></div></div><span class="val">100%</span></div>
<div class="row"><span>Wrong page</span><div class="track"><div class="fill" style="width:98%"></div></div><span class="val">98%</span></div>
<div class="row"><span>Flipped nationality</span><div class="track"><div class="fill alt" style="width:51%"></div></div><span class="val">51%</span></div>
<div class="row"><span>Shifted deadline</span><div class="track"><div class="fill alt" style="width:27%"></div></div><span class="val">27%</span></div>
<div class="row"><span>Amount ×4</span><div class="track"><div class="fill alt" style="width:21%"></div></div><span class="val">21%</span></div>
<div class="caption">Share of planted errors caught. The panel reliably rejects invented content but often misses subtle changes, which motivated the claim-by-claim check.</div>
</div>

The Auditor now tests the full verification process (panel and claim check together). In a pilot, the claim check
caught 4 of 4 flipped nationality rules. Full-process detection rates per error type are still accumulating.

**A bug found by the test itself.** The first full-process test reported a planted amount as "missed". Inspection
showed that the panel had already removed the amount from the record in place, so the test compared the planted value
with nothing. The test now compares against a snapshot taken before judging.

---

## 5 · Sentinel

Monitors progress every five minutes. It diagnoses problems with fixed rules first, and lets a language model choose
only from a whitelist of safe actions: restart an agent, rest a failing model, change the number of workers. A health
audit found that provider outages had been counted against the pages themselves, silently retiring 15,729 of 15,731
queued pages; provider failures now pause the work instead.

---

## Library: vector index and rule register

Verified records are published into two stores.

- **Vector index.** Each programme is converted into an embedding with `nomic-embed-text` [[19]](../references.md),
  run locally, and searched exhaustively by cosine similarity. Approximate indexes (such as HNSW) pay off only at
  around 100,000 vectors; at a few thousand programmes, exhaustive search takes milliseconds.
- **Rule register.** A typed store of eligibility rules (attribute, operator, value, hard or soft, quote, judge votes)
  that the eligibility gate evaluates in Layer 2.
