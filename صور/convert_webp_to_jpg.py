"""Convertit les images WebP en JPG avec des noms compatibles LaTeX."""
from PIL import Image
import os

# Noms reels des fichiers WebP -> noms attendus par le document LaTeX
files = {
    "agadirofla": "agadirofla",
    "قصبة تاريخية بجهة سوس ماسة]": "kasbah",
    "تردانت": "taroudant",
    "الاطلس الصغير": "atlas",
    "نموذج لمنزل تقليدي سوسي": "maison",
    "فرقة روايس تؤدي عرضًا فنيًا]": "rways",
    "عرض لرقصة أحواش]": "ahwach",
    "زربية سوسية تقليدية]": "zarbiya",
    "حلي فضية أمازيغية]": "holi",
    "أوانٍ فخارية تقليدية]": "fakhkhar",
    "المنتزه الوطني لسوس ماسة]": "parc",
    "وادي الجنة]": "wadi",
    "الأقواس الصخرية بشاطئ ليكزيرا]": "legzira",
    "طبق أملو وزيت الأركان]": "amlu",
    "شجرة الأركان]": "argan",
}

converted = 0
errors = []
log_lines = []

for old_name, new_name in files.items():
    src = f"{old_name}.webp"
    dst = f"{new_name}.jpg"
    if os.path.exists(src):
        try:
            img = Image.open(src).convert("RGB")
            img.save(dst, "JPEG", quality=92)
            log_lines.append(f"OK  {src}  ->  {dst}")
            converted += 1
        except Exception as e:
            errors.append(f"ERR  {src}: {e}")
    else:
        errors.append(f"MISSING  {src}")

log_lines.append(f"\n{converted} images converties.")
if errors:
    log_lines.append("\nProblemes:")
    log_lines.extend(f"  {e}" for e in errors)

with open("conversion_log.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(log_lines))
