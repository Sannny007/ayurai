from pathlib import Path
import re

lines = Path("data/sushruta_vol1.txt").read_text(encoding="utf-8", errors="ignore").splitlines()


def squash(s):
    return re.sub(r"\s+", " ", s).strip()


def caps_ratio(s):
    letters = [c for c in s if c.isalpha()]
    return sum(c.isupper() for c in letters) / len(letters) if letters else 0


def show_headings(name, start, end):
    print(f"\n== Short capital-letter lines near {name} (lines {start}-{end}) ==")
    for i in range(start - 1, end):
        s = squash(lines[i])
        if 3 <= len(s) <= 45 and caps_ratio(s) > 0.6 and "SUSHRUTA" not in s.upper():
            print(i + 1, "|", s)


show_headings("chapter 3", 4411, 4966)
show_headings("chapter 24", 11287, 11897)

print("\n== Peek along the end of the book (every 250 lines from 19662) ==")
for i in range(19661, len(lines), 250):
    print(i + 1, "|", squash(lines[i])[:110])