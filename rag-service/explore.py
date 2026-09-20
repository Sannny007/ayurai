from pathlib import Path
import re

text = Path("data/sushruta_vol1.txt").read_text(encoding="utf-8", errors="ignore")
lines = text.splitlines()
print("Total lines:", len(lines))


def squash(s):
    # collapse repeated spaces so patterns are easier to see
    return re.sub(r"\s+", " ", s).strip()


chap = [(i + 1, squash(l)) for i, l in enumerate(lines) if "Chap" in l and len(l) < 80]
print("\nShort lines containing 'Chap':", len(chap))
for num, line in chap[:25]:
    print(num, "|", line)

sutra = [(i + 1, squash(l)) for i, l in enumerate(lines) if "SUTRASTHANAM" in l.upper() and len(l) < 80]
print("\nShort lines containing 'SUTRASTHANAM':", len(sutra))
for num, line in sutra[:10]:
    print(num, "|", line)