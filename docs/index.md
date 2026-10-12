---
hide:
  - navigation
---

# ACCESS

**AI-Curated Constraint-Aware Eligibility & Scholarly Search**

*GP8000 / GP8001 AI Literacy · Cohort C · Group 5*

Researchers look for funding across thousands of university, government and foundation websites. Most of what they
find is irrelevant, and much of what looks relevant is closed to them: it requires a different nationality, career
stage or host country. Existing scholarly recommender systems rank opportunities by **topic**; they do not check
**eligibility**, and they do not verify that the facts they display are correct.

ACCESS is a multi-agent AI system that addresses both problems. It builds a library of funding programmes from the
open web, **verifies every displayed fact against the funder's own page**, and returns only the programmes a
researcher is eligible for, ranked by fit and with the evidence for each decision.

<div class="kpis" markdown>
<div class="kpi"><div class="num">370</div><div class="lbl">programmes with every displayed fact verified</div></div>
<div class="kpi"><div class="num">631</div><div class="lbl">eligibility rules, each backed by a quote from the funder's page</div></div>
<div class="kpi"><div class="num">0.4 s</div><div class="lbl">to the first eligibility-filtered results</div></div>
<div class="kpi"><div class="num">93%</div><div class="lbl">of test searches find the target programme in the top five</div></div>
</div>

<small>Figures as of 12 October 2026. See [Results](results.md).</small>

## The idea in one picture

<div class="diagram" markdown>

```mermaid
flowchart LR
  subgraph OFF["Offline: runs continuously"]
    L0["<b>Layer 0 · Build the library</b><br/>crawl funder websites<br/>extract each programme<br/>verify every fact"]
  end
  subgraph ON["Online: runs for each search"]
    L1["<b>Layer 1 · Understand the user</b><br/>form → profile"]
    L2["<b>Layer 2 · Match and filter</b><br/>relevant programmes<br/>→ eligibility rules"]
    L3["<b>Layer 3 · Rank and explain</b><br/>fit score, evidence,<br/>application plan"]
  end
  L0 --> L2
  L1 --> L2 --> L3
```

</div>
<p class="swipe-hint">Swipe sideways to see the whole diagram.</p>

The design rests on one division of labour: **language models read; deterministic code decides.** Models are good at
reading messy web pages and judging whether a sentence supports a claim. Code is better at decisions that must be
reproducible and explainable, such as whether a researcher meets a nationality rule.

## How to read this site

| If you want to… | Go to |
|---|---|
| Understand how each part of the system works and why it was built that way | [Documentation](documentation/index.md) |
| See what ACCESS can do today, and how we measured it | [Results](results.md) |
| Look up a technical term in plain language | [Glossary](glossary.md) (terms are also explained when you hover over them) |
| Find the literature we build on | [Literature review](documentation/literature.md) and [References](references.md) |

## Scope

ACCESS covers **research funding**: scholarships from undergraduate to PhD level, research fellowships, postdoctoral
positions, research grants and travel grants. Coverage priority goes to the destinations with the most student
traffic: Singapore, the United States, the United Kingdom, Japan, China (including Hong Kong), Australia, Canada and
the rest of Europe.

ACCESS supports discovery and decision-making only. It does not submit applications or contact funders on a user's
behalf, because doing so would transfer decision-making agency from the researcher to the system and raise questions
of safety and accountability.
