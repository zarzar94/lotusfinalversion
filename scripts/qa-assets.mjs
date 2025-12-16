import fs from 'fs';
import path from 'path';

const root = process.cwd();
const publicDir = path.join(root, 'public');

const mustExist = (rel) => {
  const abs = path.join(publicDir, rel);
  if (!fs.existsSync(abs)) {
    return { ok: false, rel };
  }
  return { ok: true, rel };
};

const pad2 = (n) => String(n).padStart(2, '0');

const checks = [];

// Slides
for (let i = 1; i <= 57; i++) {
  const p = pad2(i);
  checks.push(mustExist(`assets/pptx_slides/slide-${p}.png`));
  checks.push(mustExist(`assets/pptx_slides/thumbs/thumb-${p}.jpg`));
}

// Branding
checks.push(mustExist('assets/images/brain_icon_44.png'));
checks.push(mustExist('assets/images/brain_logo.png'));

// Downloads
checks.push(mustExist('downloads/Check list (2).pdf'));
checks.push(mustExist('downloads/berard-profile.pdf'));

// Fonts
checks.push(mustExist('fonts/Cairo-Regular.ttf'));
checks.push(mustExist('fonts/Cairo-Bold.ttf'));

const failed = checks.filter((c) => !c.ok);

if (failed.length) {
  console.error(`\n❌ Missing ${failed.length} required asset(s):`);
  for (const f of failed) console.error(`  - public/${f.rel}`);
  process.exit(1);
}

console.log(`\n✅ Asset QA passed (${checks.length} checks).`);
