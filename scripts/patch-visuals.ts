import * as fs from 'fs';
const path = 'components/AdvancedVisuals.tsx';
const content = fs.readFileSync(path, 'utf-8');
// Trim trailing whitespace and weird chars
const cleaned = content.trimEnd();
fs.writeFileSync(path, cleaned + '\n', 'utf-8');
console.log("✅ [FixVisuals] Trailing characters cleaned.");
