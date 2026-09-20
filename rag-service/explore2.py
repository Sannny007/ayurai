from pathlib import Path
import re

lines = Path("data/sushruta_vol1.txt").read_text(encoding="utf-8", errors="ignore").splitlines()
START = 3867


def squash(s):
    return re.sub(r"\s+", " ", s).strip()


print("== Lines 3867 to 3885 ==")
for i in range(START - 1, START + 18):
    print(i + 1, "|", squash(lines[i]))

print("\n== CHAPTER headings ==")
chapters = [(i + 1, squash(l)) for i, l in enumerate(lines)
            if i >= START and re.match(r"\s*CHAPTER\b", l) and len(l) < 60]
print("count:", len(chapters))
for num, line in chapters[:20]:
    print(num, "|", line)

print("\n== Other page headers (short lines with SUSHRUTA) ==")
others = [(i + 1, squash(l)) for i, l in enumerate(lines)
          if i >= START and "SUSHRUTA" in l.upper() and len(squash(l)) < 45]
print("count:", len(others))
for num, line in others[:12]:
    print(num, "|", line)

print("\n== Where the book might end ==")
for i, l in enumerate(lines):
    if i >= START and re.fullmatch(r"\s*(INDEX|GLOSSARY|ERRATA|ADDENDA|APPENDIX)\.?\s*", l):
        print(i + 1, "|", squash(l))