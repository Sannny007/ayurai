from pathlib import Path
import json

import numpy as np
from fastapi import FastAPI
from fastembed import TextEmbedding
from pydantic import BaseModel

MODEL = "BAAI/bge-small-en-v1.5"
MIN_SCORE = 0.60  # below this, the question is treated as not covered by the text

chunks = json.loads(Path("data/chunks.json").read_text(encoding="utf-8"))
vectors = np.load("data/embeddings.npy")
model = TextEmbedding(MODEL)

app = FastAPI(title="AyurAI RAG service")


class SearchRequest(BaseModel):
    question: str
    top_k: int = 5


@app.get("/health")
def health():
    return {"status": "ok", "chunks": len(chunks)}


@app.post("/search")
def search(req: SearchRequest):
    q = np.array(list(model.query_embed(req.question))[0], dtype="float32")
    q /= np.linalg.norm(q)
    scores = vectors @ q
    top = np.argsort(-scores)[: req.top_k]
    passages = [
        {
            "id": chunks[i]["id"],
            "source": "Sushruta Samhita, Sutrasthanam (tr. Bhishagratna, 1907)",
            "chapter": chunks[i]["chapter"],
            "score": round(float(scores[i]), 3),
            "text": chunks[i]["text"],
        }
        for i in top
    ]
    return {"found": bool(passages and passages[0]["score"] >= MIN_SCORE), "passages": passages}