---
hide:
  - navigation
---

# Glossary

Plain-language explanations of the terms used on this site, with an everyday analogy where one helps. Many of these
terms also show a short definition when you hover over them elsewhere on the site.

## AI and language models

Language model (LLM)
:   A program trained on large amounts of text to predict and generate language. It can read a web page, answer
    questions about it and write text, but it can also state things that are not true.
    <span class="analogy">Like a very well-read assistant who answers fluently, but whose work still needs checking.</span>

Pretrained model
:   A model trained once by its developer and then used as is. ACCESS trains no models; it only gives instructions
    (prompts) to existing ones.

Zero-shot
:   Asking a model to do a task from instructions alone, without giving it worked examples.
    <span class="analogy">Like handing a new colleague a blank form and the instructions, without a filled-in sample.</span>

Hallucination
:   A fluent, confident statement by a language model that is not supported by its source.
    <span class="analogy">Like a witness filling gaps in their memory with plausible details.</span>

Agent, multi-agent system
:   An agent is a program that carries out one job on its own, repeatedly. A multi-agent system divides a large task
    among several agents. In ACCESS, the agents (Scout, Scraper, Critic, Auditor, Sentinel) each do one job.
    <span class="analogy">Like an assembly line where each station does one step.</span>

Workflow
:   A system whose steps follow fixed paths set by its designers, as opposed to an autonomous agent that chooses its
    own steps. ACCESS is a workflow, because predictability matters more than autonomy when deciding eligibility.

Neuro-symbolic
:   A design that combines neural models (good at language and patterns) with symbolic code (good at exact logic).
    In ACCESS, language models read and judge; code decides eligibility.
    <span class="analogy">Like a translator working with an accountant: one interprets, the other does the sums.</span>

Token, quota, free tier
:   Models process text in small pieces called tokens. Free tiers limit how many tokens or requests each user may send
    per minute and per day (the quota). ACCESS uses free tiers only, so quotas set its speed.

Deterministic
:   Always giving the same output for the same input. The eligibility gate is deterministic; a language model is not.

## Collecting and extracting data

Crawler, crawling
:   A program that visits web pages and follows their links to find more pages.
    <span class="analogy">Like a librarian walking the shelves, noting every book and every reference it points to.</span>

robots.txt
:   A file in which a website states which pages automated programs may visit. ACCESS respects it.

Headless browser
:   A web browser without a visible window, controlled by a program. It is needed for pages whose content only
    appears after JavaScript runs.

Fingerprint (hash)
:   A short code computed from a page's text. Identical text always gives the same code, so duplicates are found by
    comparing codes rather than whole pages.
    <span class="analogy">Like comparing fingerprints instead of whole people.</span>

Schema
:   A fixed list of fields, each with a defined type, that every record must follow (for example, deadline as a date,
    amount as a number with a currency).
    <span class="analogy">Like a standard application form: every programme is described in the same boxes.</span>

Evidence quote, grounding
:   The exact sentence from the funder's page that supports an extracted fact. A fact is *grounded* if its quote is
    found on the page.
    <span class="analogy">Like a footnote that lets you check the claim yourself.</span>

Cascade
:   Running cheap steps on everything and expensive steps only on what remains.
    <span class="analogy">Like airport security: everyone walks through the scanner, only a few bags are opened.</span>

Blackboard architecture
:   Agents coordinate through a shared store of data instead of calling each other.
    <span class="analogy">Like colleagues working from one shared whiteboard: anyone can step away without stopping the others.</span>

Max-min fairness
:   Always serving the group that currently has the least. ACCESS crawls next for the priority country with the
    fewest verified programmes.

## Verification

LLM-as-a-judge
:   Using a language model to evaluate whether a statement is correct or supported.

Judge panel, ensemble, majority vote
:   Several judges vote independently and the majority decides. ACCESS uses three judges from three different
    companies.
    <span class="analogy">Like three referees from different leagues: one referee's blind spot is outvoted by the other two.</span>

Echo chamber
:   When the checker shares the blind spots of the thing it checks, for example a model judging its own output.
    Avoided by using different companies for extraction, judging and auditing.

Claim, claim decomposition
:   A claim is one checkable fact, such as "the deadline is 2 June". Decomposition splits a record into separate
    claims so each can be verified on its own.
    <span class="analogy">Like marking an exam question by question rather than giving one overall grade.</span>

Locate, then interpret
:   The two steps of the claim check. *Locate*: code checks that the date, amount or quote actually appears on the
    page. *Interpret*: judges read only that passage and decide whether it supports the claim.

Fail closed
:   When unsure, withhold rather than guess. An unconfirmed fact is shown as "not stated".
    <span class="analogy">Like a door that locks, rather than opens, when the power fails.</span>

Fault injection, mutation testing
:   Deliberately inserting known errors to measure whether a checking process catches them.
    <span class="analogy">Like a fire drill, or a test parcel sent through airport security to check that the scanner works.</span>

Negative control
:   A test where the correct outcome is known to be "no", used to check that a change has not made a test too lenient.
    ACCESS fed deliberately wrong amounts to the reworded amount check: only 1 of 28 was accepted.

Fleiss' kappa (κ)
:   A measure of agreement among several raters that corrects for agreement expected by chance. 0 means chance-level
    agreement, 1 means perfect agreement; 0.41–0.60 is conventionally "moderate".

Trust score
:   A weighted score summarising how well a record is supported: source authenticity, judge votes, grounding and
    agreement.

## Search and matching

Embedding
:   A list of numbers that represents the meaning of a piece of text. Texts with similar meaning have similar numbers.
    <span class="analogy">Like map coordinates for meaning: related ideas sit close together.</span>

Vector index
:   A store of embeddings that can be searched for the ones closest to a query.

Cosine similarity
:   A measure of how closely two embeddings point in the same direction; used as the similarity between two texts.

Keyword search, BM25
:   Search by matching words, weighting rare words more than common ones. BM25 is the standard formula.
    <span class="analogy">Like the index at the back of a book.</span>

Dense search
:   Search by comparing embeddings, so it also finds text that says the same thing in different words.

Hybrid search, reciprocal rank fusion (RRF)
:   Running keyword and dense search together and merging their ranked lists. RRF merges lists by rank position, so the
    two searches' scores need not be on the same scale.
    <span class="analogy">Like combining two judges' rankings by placing, not by their different scoring systems.</span>

Recall@k
:   The share of searches whose correct answer appears in the top *k* results. Recall@5 = 0.93 means 93 of 100 test
    searches found the target programme in the top five.

MRR (mean reciprocal rank)
:   The average of 1 / (position of the correct answer). It rewards putting the correct answer near the top.

Known-item benchmark
:   A search test in which each query has exactly one known correct answer, so no human relevance judgements are needed.

Precision, recall (of a filter)
:   Precision: of the items the filter kept, how many were right. Recall: of all the right items, how many the
    filter kept.
    <span class="analogy">A fishing net: precision is how much of the catch is fish; recall is how many of the fish you caught.</span>

Confidence interval (95% CI)
:   A range that, under the method's assumptions, contains the true value in 95% of repeated samples. Wide intervals
    signal small samples.

## Eligibility and ranking

Eligibility gate, constraint satisfaction
:   Checking each rule of a programme against the profile, one at a time, with code.
    <span class="analogy">Like a checklist at a border: every item must be satisfied, and each refusal names the item.</span>

Hard rule, soft rule
:   A hard rule excludes outright if not met (for example, nationality). A soft rule allows a small, closable gap
    (for example, a language score slightly below the requirement).

Near miss, gap cost
:   A programme the researcher misses only on soft rules. The gap cost estimates the effort, in weeks, to close the gap.

Information gain
:   How much a piece of information reduces uncertainty. ACCESS asks the one follow-up question that settles the most
    "unknown" eligibility checks.
    <span class="analogy">Like the best first question in "Twenty Questions".</span>

Late fusion
:   Combining two separately computed scores into one final score. ACCESS uses 0.7 × fit score + 0.3 × similarity.

Retrieval-augmented generation (RAG)
:   Answering a question by first retrieving relevant passages and then having the model answer only from them, with
    citations.
    <span class="analogy">An open-book exam: the answer must come from the book, with page numbers.</span>

Faithfulness
:   Whether an answer's quotes and citations really come from the source. ACCESS checks every quote against the page.
