const fs = require("fs");
const path = require("path");

async function main() {
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    console.log("sharp not installed, skipping local compression");
    return;
  }

  const imagesDir = path.join(__dirname, "..", "public", "images");
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".jpg"));

  for (const file of files) {
    const input = path.join(imagesDir, file);
    const before = fs.statSync(input).size;

    await sharp(input)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(input + ".tmp");

    fs.renameSync(input + ".tmp", input);
    const after = fs.statSync(input).size;
    console.log(`${file}: ${Math.round(before / 1024)}KB -> ${Math.round(after / 1024)}KB`);
  }
}

main().catch(console.error);
