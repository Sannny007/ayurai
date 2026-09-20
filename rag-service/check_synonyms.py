import json
import re
from pathlib import Path

chunks = json.loads(Path("data/chunks.json").read_text(encoding="utf-8"))
groups = json.loads(Path("synonyms.json").read_text(encoding="utf-8"))
texts = [c["text"].lower() for c in chunks]

for g in groups:
    counts = {t: sum(bool(re.search(rf"\b{re.escape(t)}s?\b", x)) for x in texts) for t in g["terms"]}
    print(g["label"], counts)