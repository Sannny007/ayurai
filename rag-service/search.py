from pathlib import Path
import json

import numpy as np
from fastembed import TextEmbedding

chunks = json.loads(Path("data/chunks.json").read_text(encoding="utf-8"))
vectors = np.load("data/embeddings.npy")
model = TextEmbedding("BAAI/bge-small-en-v1.5")


def search(question, k=5):
    q = np.array(list(model.query_embed(question))[0], dtype="float32")
    q /= np.linalg.norm(q)
    scores = vectors @ q
    top = np.argsort(-scores)[:k]
    return [(float(scores[i]), chunks[i]) for i in top]


if __name__ == "__main__":
    while True:
        question = input("\nAsk (press Enter to quit): ").strip()
        if not question:
            break
        for score, c in search(question):
            print(f"\n[{score:.2f}] Sutrasthanam, Chapter {c['chapter']}")
            print(c["text"][:350].replace("\n", " "), "...")