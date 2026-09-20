from pathlib import Path
import json
import re

import numpy as np
from fastapi import FastAPI
from fastembed import TextEmbedding
from pydantic import BaseModel
from rank_bm25 import BM25Okapi

MODEL = "BAAI/bge-small-en-v1.5"
MIN_SCORE = 0.60  # best meaning-match below this => question is not covered by the text
POOL = 30         # candidates taken from each ranking before merging

STOP = set(
    "the of and to in a is that it as with for by be or are this which on from at an his not have one "
    "what how do i you can when where who why should".split()
)

chunks = json.loads(Path("data/chunks.json").read_text(encoding="utf-8"))
vectors = np.load("data/embeddings.npy")
synonyms = json.loads(Path("synonyms.json").read_text(encoding="utf-8"))
model = TextEmbedding(MODEL)


def tokenize(text):
    words = re.findall(r"[a-z0-9']+", text.lower())
    return [w[:-1] if len(w) > 3 and w.endswith("s") else w for w in words if w not in STOP and len(w) > 1]


bm25 = BM25Okapi([tokenize(c["text"]) for c in chunks])


def expand_query(question):
    """Add the book's own names for any term the reader used (Tulsi -> Surasa, Tulasi)."""
    q = question.lower()
    matched, extra = [], []
    for group in synonyms:
        if any(re.search(rf"\b{re.escape(t)}s?\b", q) for t in group["terms"]):
            matched.append(group)
            extra += [t for t in group["terms"] if t not in q]
    return (question + " " + " ".join(extra)).strip(), matched


def merge_rankings(rankings, k=60):
    """Reciprocal rank fusion: a chunk ranked high in either list rises to the top."""
    scores = {}
    for ranking in rankings:
        for rank, idx in enumerate(ranking):
            scores[idx] = scores.get(idx, 0) + 1 / (k + rank + 1)
    return sorted(scores, key=scores.get, reverse=True)


app = FastAPI(title="AyurAI RAG service")


class SearchRequest(BaseModel):
    question: str
    top_k: int = 6


@app.get("/health")
def health():
    return {"status": "ok", "chunks": len(chunks)}


@app.post("/search")
def search(req: SearchRequest):
    expanded, matched = expand_query(req.question)

    q = np.array(list(model.query_embed(expanded))[0], dtype="float32")
    q /= np.linalg.norm(q)
    dense_scores = vectors @ q
    dense_rank = [int(i) for i in np.argsort(-dense_scores)[:POOL]]

    keyword_scores = bm25.get_scores(tokenize(expanded))
    keyword_rank = [int(i) for i in np.argsort(-keyword_scores)[:POOL] if keyword_scores[i] > 0]

    top = merge_rankings([dense_rank, keyword_rank])[: req.top_k]
    passages = [
        {
            "id": chunks[i]["id"],
            "source": "Sushruta Samhita, Sutrasthanam (tr. Bhishagratna, 1907)",
            "chapter": chunks[i]["chapter"],
            "score": round(float(dense_scores[i]), 3),
            "text": chunks[i]["text"],
        }
        for i in top
    ]
    return {
        "found": bool(dense_scores.max() >= MIN_SCORE),
        "matched": [{"label": g["label"], "terms": g["terms"]} for g in matched],
        "passages": passages,
    }