# Literature review

ACCESS draws on two strands of research: **scholarly recommender systems**, which match researchers to
opportunities, and the **verification of language-model output**, which addresses whether the facts a model produces
are correct. Three further findings shaped specific design choices.

## Scholarly recommender systems

| Study | Approach | Key finding | Limitation for our problem |
|---|---|---|---|
| Zhang et al., 2023 [[1]](../references.md) | Survey of 225 scholarly recommender studies | Content-based filtering dominates; most systems address a single task | No integrated support across funding, careers and venues |
| Zhu et al., 2023 [[2]](../references.md) | BERT model matching publication profiles to NIH grant announcements | Semantic matching improves grant recommendation | Suitability is treated as relevance; eligibility is not modelled |
| Zhao et al., 2024 [[3]](../references.md) | Survey of LLM-based recommender systems | LLMs build richer representations of users and items | Extracted content is not verified against its source |

The closest prior work, the NIH grant recommender [[2]](../references.md), shows that semantic matching works for
grants. However, semantic relevance does not establish suitability: an opportunity may depend on nationality, career
stage, institutional affiliation or a deadline.

## Verifying what language models produce

| Study | Finding | Consequence in ACCESS |
|---|---|---|
| Ji et al., 2023 [[7]](../references.md) | Generated text can be fluent yet unsupported by its source ("hallucination") | No extracted fact is shown without verification |
| Thorne et al., 2018 [[8]](../references.md) | FEVER: claims are verified against evidence as *supported*, *refuted* or *not enough information* | Our three outcomes: confirmed, rejected, not stated |
| Min et al., 2023 [[9]](../references.md) | FActScore: split long text into atomic facts and verify each separately | Records are verified claim by claim, not as a whole |
| Lewis et al., 2020 [[10]](../references.md) | Retrieval-augmented generation grounds answers in retrieved passages | Judges and the Q&A feature see the relevant page passage |
| Verga et al., 2024 [[11]](../references.md) | A panel of diverse smaller models judges better, and with less bias, than one large model | Three judges from three different companies |
| Panickssery et al., 2024 [[12]](../references.md) | LLM evaluators recognise and favour their own outputs | The extracting model never judges its own work |

## Findings that shaped specific design choices

| Finding | Design consequence |
|---|---|
| A single LLM acting as a judge shows position and self-enhancement bias [[4]](../references.md) | Verification by a panel with majority voting |
| Sentence embeddings allow fast semantic search [[5]](../references.md) | A vector index to retrieve programmes by meaning |
| Language models are largely insensitive to negation: "not open to international applicants" resembles "open to international applicants" [[6]](../references.md) | Eligibility is decided by deterministic rules, never by similarity scores |

## Research gap

No existing system combines (i) collection from the open web, (ii) verification of extracted facts against their
source, (iii) eligibility as a hard constraint and (iv) personalised ranking. ACCESS integrates all four.
