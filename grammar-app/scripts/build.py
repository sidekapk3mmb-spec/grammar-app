#!/usr/bin/env python3
"""Validasi data/units.json lalu hasilkan data/units.js (dibaca index.html)."""
import json, sys, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
data = json.loads((root / "data" / "units.json").read_text(encoding="utf-8"))
errs = []
if len(data["units"]) != 145: errs.append("jumlah unit bukan 145")
for i, u in enumerate(data["units"], 1):
    if u["unit"] != i: errs.append(f"urutan unit salah di {i}")
    for q in u["practice"]["questions"]:
        if q["type"] == "multiple_choice":
            if q.get("answer_index") is None or not 0 <= q["answer_index"] < len(q.get("options", [])):
                errs.append(f"{q['id']}: answer_index tidak valid")
        elif q["type"] == "fill_blank":
            if "___" not in q["prompt"] or not q.get("accepted_answers"):
                errs.append(f"{q['id']}: fill_blank butuh ___ dan accepted_answers")
        else: errs.append(f"{q['id']}: type tidak dikenal")
if errs:
    print("\n".join(errs)); sys.exit(1)
(root / "data" / "units.js").write_text("window.GRAMMAR_DATA = " + json.dumps(data, ensure_ascii=False) + ";\n", encoding="utf-8")
st = {}
for u in data["units"]: st[u["practice"]["status"]] = st.get(u["practice"]["status"], 0) + 1
print("OK:", len(data["units"]), "unit,", sum(len(u["practice"]["questions"]) for u in data["units"]), "soal,", st)
