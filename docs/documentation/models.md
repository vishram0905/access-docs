# Models and resources

ACCESS uses only pretrained models, through free tiers or run locally. No model is trained or fine-tuned, and no
paid service is used.

## Which model does what

| Role | Model (company) | Where it runs |
|---|---|---|
| Normalizer (extraction) | Gemini Flash family (Google) | Gemini API, free tier |
| Judge pool: three per record, never Google | GPT-OSS-120B (OpenAI), Qwen 27B (Alibaba), Nemotron 3 Super (NVIDIA), GLM-5.3 Flash (Zhipu), Phi-4-mini (Microsoft), Muse Glimmer 30B (Meta) | Groq and NVIDIA free tiers; Phi-4-mini locally |
| Online reviewers | GPT-OSS-120B, Phi-4-mini | Groq; local |
| Fit ranker | Qwen 27B, with a fallback chain across three companies | Groq; NVIDIA |
| Application plans and Q&A | First available: Gemini Flash, Nemotron, GLM, Qwen | Various |
| Auditor | First model that did not judge the record being re-checked | Various |
| Embeddings | nomic-embed-text | Locally |

## No echo chamber

Each role is assigned so that **no model grades its own work**:

- the extractor (Google) is never one of the judges;
- each record's three judges come from three different companies;
- the auditor's own votes are excluded when it re-checks records it judged;
- the model that writes benchmark queries (NVIDIA) differs from the embedding model (Nomic).

## Working within free-tier limits

Free tiers cap how many requests and tokens each model accepts per minute and per day. ACCESS treats these limits as a
scheduling problem:

- **Token budgets per role** over a rolling 24-hour window, so background verification cannot use up the quota that
  live searches need.
- **Live requests first.** Background roles may use only 60% of each minute's token allowance, so a researcher's
  search never queues behind background work.
- **Fallback chains.** Each AI role has an ordered list of models from different providers; the first with quota
  available is used.
- **Failures are never the record's fault.** A provider outage, timeout or quota error pauses the work. It does not
  count against the page being processed.

The main consequence is speed: verification throughput is set by the slowest company's free quota, not by computing
power. This is why the verified library grows by tens of records per day rather than thousands.
