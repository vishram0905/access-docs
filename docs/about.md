---
hide:
  - navigation
---

# About ACCESS

ACCESS finds the research funding a researcher is actually eligible for, and shows the evidence behind every
decision. This page sets out the problem we set out to solve, the vision behind the system and where we intend to
take it.

## ACCESS in two minutes

<div class="video-frame">
<video controls preload="metadata" playsinline poster="../assets/video/access-explainer-poster.jpg">
  <source src="../assets/video/access-explainer.mp4" type="video/mp4">
  Your browser cannot play this video. <a href="../assets/video/access-explainer.mp4">Download it instead.</a>
</video>
</div>
<p class="video-caption">A short explainer that follows one researcher, Priya, from forty open browser tabs to a
verified shortlist, and shows how the system works behind the scenes.</p>

## The problem

A researcher looking for funding faces three difficulties at once.

<div class="lp-cards lp-cards--3 about-cards" markdown>
<div class="lp-card" markdown>
<h3>The information is fragmented</h3>
<p>Scholarships, fellowships and grants are published on thousands of university, government and foundation
websites. No single portal covers them, and aggregator sites are often incomplete or out of date.</p>
</div>
<div class="lp-card" markdown>
<h3>Eligibility, not topic, decides</h3>
<p>Nationality, career stage, degree, host country and deadline determine whether an application is possible at
all. Search engines and scholarly recommenders rank by topical relevance and leave these rules to the reader.</p>
</div>
<div class="lp-card" markdown>
<h3>Errors are costly</h3>
<p>A misread nationality rule or a wrong deadline can cost an applicant weeks of preparation. General-purpose
language models make such errors fluently, so every fact shown to a researcher must be checkable.</p>
</div>
</div>

The result is a familiar experience for postgraduate students: hours spent across many tabs, reading fine print, and
still not knowing which opportunities are realistically open to them.

## Our vision

We want a researcher to describe themselves once and receive a shortlist they can trust: only the programmes they
are eligible for, ranked by how well each fits their goals, with every decision traceable to a sentence on the
funder's own page.

Four principles guide the design.

| Principle | What it means in ACCESS |
|---|---|
| **Official sources only** | Programmes are read from funders' own websites. Aggregators are used to discover programmes, never as the source of a fact. |
| **Eligibility as a hard constraint** | Plain, tested code applies every eligibility rule to the researcher's profile. The same profile always receives the same answer. |
| **Every claim is verified** | Three AI judges from three different companies check each extracted claim against the page, and an auditor measures how many planted errors they catch. Claims that cannot be confirmed are withheld. |
| **Models read, code decides** | Language models do what they do well, reading messy pages and judging whether a sentence supports a claim. Decisions that must be reproducible are left to code. |

ACCESS supports discovery and decision-making only. It does not submit applications or contact funders on a
researcher's behalf, because doing so would transfer agency from the researcher to the system and raise questions of
accountability.

## Who it is for

ACCESS is designed for people at the transition points of an academic career: an undergraduate looking for a funded
master's degree, a master's student seeking a PhD scholarship, a doctoral candidate looking for a postdoctoral
fellowship, and early-career researchers looking for grants and travel funding.

## Where it stands, and where it is going

The prototype covers 629 verified programmes with 1,009 quoted eligibility rules, drawn from funders in 30 host
countries. First results appear in under half a second, and 93% of benchmark searches find the target programme in
the top five. The [Results](results.md) and [Test report](test-report.md) pages give the measurements in full.

The next steps follow from the limitations we have measured:

- **Coverage.** Continental Europe is under-represented, so national European schemes are the next priority.
- **Evaluation.** A comparison with a relevance-only baseline will quantify how much the eligibility gate improves
  on topic matching alone.
- **Scope.** In the longer term, the same verified, eligibility-aware approach can extend from funding to
  supervisors, conferences and career opportunities, towards a single platform for the postgraduate journey.

[Try the live app :material-arrow-right:](https://access-funding.streamlit.app/){ .md-button .md-button--primary target="_blank" }
[Read the documentation](documentation/index.md){ .md-button }

## The team

ACCESS was built as a group project for GP8000 / GP8001 AI Literacy at Nanyang Technological University, Cohort C,
Group 5. The source code is available on [GitHub](https://github.com/vishram0905/access).
