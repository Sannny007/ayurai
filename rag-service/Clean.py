from pathlib import Path
import json
import re

RAW = Path("data/sushruta_vol1.txt")
OUT = Path("data/chapters.json")
START = 3866  # the book body begins at line 3867 (index 3866)
TOTAL_CHAPTERS = 46


def squash(s):
    return re.sub(r"\s+", " ", s).strip()


lines = RAW.read_text(encoding="utf-8", errors="ignore").splitlines()

# cut the library card page at the very end of the file
for idx in range(len(lines) - 1, -1, -1):
    if "PLEASE DO NOT REMOVE" in squash(lines[idx]).upper():
        lines = lines[: max(idx - 15, START + 1)]
        break

lines = lines[START:]


def roman_to_int(s):
    values = {"I": 1, "V": 5, "X": 10, "L": 50}
    total = 0
    for i, ch in enumerate(s):
        v = values[ch]
        if i + 1 < len(s) and values[s[i + 1]] > v:
            total -= v
        else:
            total += v
    return total


def chapter_number(line):
    """Return the chapter number if this line is a chapter heading, else None."""
    if len(line.strip()) > 40:
        return None
    key = re.sub(r"[^A-Z0-9|]", "", line.upper())
    m = re.match(r"^CHA[PF][TI1]E[RE]([IVXLN1|]+)$", key)  # allows 'CHAPIER' (T read as i)
    if not m:
        return None
    numeral = m.group(1).replace("1", "I").replace("|", "I").replace("N", "II")  # 'in' means III
    numeral = re.sub(r"(?<!X)L", "I", numeral)
    n = roman_to_int(numeral)
    return n if 1 <= n <= TOTAL_CHAPTERS else None


def is_page_header(line):
    s = squash(line).upper()
    if not s or len(s) >= 60:
        return False
    letters = re.sub(r"[^A-Z]", "", s)
    if re.search(r"SUT.{0,3}STH", letters):  # SUTRASTHANAM in any OCR spelling
        return True
    return bool(re.search(r"SU[S5]H", s) and re.search(r"AP\.", s))  # 'THE SUSHRUTA SAMHITA ... Chap.'


def join_lines(block):
    text = ""
    for l in block:
        l = squash(l)
        if text.endswith("-") and l[:1].islower():
            text = text[:-1] + l  # word split across lines
        else:
            text = (text + " " + l).strip()
    return text


def clean_chapter(seg_lines):
    cleaned = ["" if is_page_header(l) else l for l in seg_lines]

    blocks, cur = [], []
    for l in cleaned:
        if l.strip():
            cur.append(l)
        elif cur:
            blocks.append(cur)
            cur = []
    if cur:
        blocks.append(cur)

    blocks = [b for b in blocks if b[0].lstrip()[0] not in "*†‡§"]  # drop footnotes
    paras = [join_lines(b) for b in blocks]

    merged = []
    for p in paras:
        if merged and not re.search(r"[.;:?!\"”')\]]$", merged[-1]) and p[:1].islower():
            merged[-1] = merged[-1] + " " + p
        else:
            merged.append(p)
    return [p for p in merged if re.search(r"[A-Za-z]{3,}", p)]  # drop stray page numbers


candidates = [(i, chapter_number(l)) for i, l in enumerate(lines)]
candidates = [(i, n) for i, n in candidates if n is not None]

kept, last = [], 0
for i, n in candidates:
    if last < n <= last + 4:
        kept.append((i, n))
        last = n

chapters = []
for k, (idx, n) in enumerate(kept):
    end = kept[k + 1][0] if k + 1 < len(kept) else len(lines)
    chapters.append({
        "chapter": n,
        "start_line": START + idx + 1,
        "paragraphs": clean_chapter(lines[idx + 1:end]),
    })

OUT.write_text(json.dumps(chapters, ensure_ascii=False, indent=1), encoding="utf-8")

# ---------------- report ----------------
size = lambda c: sum(len(p) for p in c["paragraphs"])
found = {c["chapter"] for c in chapters}
print("Chapters found:", len(chapters), "of", TOTAL_CHAPTERS)
print("Missing chapters:", [n for n in range(1, TOTAL_CHAPTERS + 1) if n not in found])
print("Total paragraphs:", sum(len(c["paragraphs"]) for c in chapters), "| characters:", sum(size(c) for c in chapters))

print("\nLargest chapters:")
for c in sorted(chapters, key=size, reverse=True)[:5]:
    print(f"  Ch {c['chapter']}: {len(c['paragraphs'])} paragraphs, {size(c)} characters")

by_num = {c["chapter"]: c for c in chapters}
for n in (3, 24):
    print(f"\nChapter {n}, first paragraphs:")
    for p in by_num.get(n, {"paragraphs": ["(not found)"]})["paragraphs"][:2]:
        print("-", p[:150])

print("\nEnd of the book, last 2 paragraphs:")
for p in chapters[-1]["paragraphs"][-2:]:
    print("-", p[:180])

leftover = [p for c in chapters for p in c["paragraphs"]
            if len(p) < 200 and re.search(r"SUT.{0,3}STH", re.sub(r"[^A-Z]", "", p.upper()))]
print("\nShort paragraphs that still look like page headers:", len(leftover))
for p in leftover[:4]:
    print("-", p)