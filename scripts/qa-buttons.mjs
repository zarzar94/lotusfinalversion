import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const patterns = [
  'styles.primaryBtn',
  'styles.ghostBtn',
  'styles.dangerBtn',
  'styles.secondaryBtn',
];

const matches = [];

const walk = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    if (!fullPath.endsWith('.ts') && !fullPath.endsWith('.tsx')) continue;
    const content = readFileSync(fullPath, 'utf8');
    if (!patterns.some((pattern) => content.includes(pattern))) continue;
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      patterns.forEach((pattern) => {
        if (line.includes(pattern)) {
          matches.push({
            file: fullPath,
            line: index + 1,
            pattern,
          });
        }
      });
    });
  }
};

walk('src');

if (matches.length > 0) {
  const grouped = matches.reduce((acc, entry) => {
    acc[entry.file] = acc[entry.file] ?? [];
    acc[entry.file].push(entry);
    return acc;
  }, {});
  Object.entries(grouped).forEach(([file, entries]) => {
    console.log(file);
    entries.forEach((entry) => {
      console.log(`  ${entry.line}: ${entry.pattern}`);
    });
  });
  console.error(`Found ${matches.length} legacy button styles.`);
  process.exit(1);
}

console.log('No legacy button styles found.');
