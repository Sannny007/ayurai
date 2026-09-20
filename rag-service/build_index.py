from pathlib import Path
import json
import re

import numpy as np
from fastembed import TextEmbedding

MODEL = "BAAI/bge-small-en-v1.5"
LIMIT = 1200  # target characters per chunk

chapters = json.loads(Path("data/chapters.json").read_text(encoding="utf-8"))


def split_long(p):
    if len(p) <= LIMIT:
        return [p]
    parts, cur = [], ""
    for sent in re.split(r"(?<=[.;:])\s+", p):
        if cur and len(cur) + len(sent) > LIMIT:
            parts.append(cur)
            cur = sent
        else:
            cur = (cur + " " + sent).strip()
    if cur:
        parts.append(cur)
    return parts


chunks = []
for c in chapters:
    buf = ""
    for para in c["paragraphs"]:
        for piece in split_long(para):
            if buf and len(buf) + len(piece) > LIMIT:
                chunks.append({"chapter": c["chapter"], "text": buf})
                buf = piece
            else:
                buf = (buf + "\n\n" + piece).strip()
    if buf:
        chunks.append({"chapter": c["chapter"], "text": buf})

for i, ch in enumerate(chunks):
    ch["id"] = i

print("Chunks:", len(chunks), "| average length:", sum(len(c["text"]) for c in chunks) // len(chunks))
Path("data/chunks.json").write_text(json.dumps(chunks, ensure_ascii=False, indent=1), encoding="utf-8")

print("Loading model (first time downloads about 130 MB)...")
model = TextEmbedding(MODEL)
vectors = np.array(list(model.embed([c["text"] for c in chunks])), dtype="float32")
vectors /= np.linalg.norm(vectors, axis=1, keepdims=True)
np.save("data/embeddings.npy", vectors)
print("Saved embeddings:", vectors.shape)
