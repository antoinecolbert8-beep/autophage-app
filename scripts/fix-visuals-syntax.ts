import * as fs from 'fs';

const filePath = 'components/AdvancedVisuals.tsx';
let content = fs.readFileSync(filePath, 'utf-8');
// Handle both types of line endings
let lines = content.split(/\r?\n/);

const memoComponents = [
    'MeshGradient',
    'Particles3D',
    'MagneticCursor',
    'AnimatedWaves',
    'NeuralWeb'
];

let currentComponent = '';
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('export const')) {
        const match = line.match(/export const (\w+)/);
        if (match) currentComponent = match[1];
    }

    // A component end is exactly "};" or "});" with NO leading whitespace
    const isComponentEnd = /^(\};|\}\);)\s*$/.test(line);
    
    if (isComponentEnd) {
        const isMemo = memoComponents.some(m => currentComponent === m);
        if (isMemo) {
            lines[i] = '});';
        } else {
            lines[i] = '};';
        }
    } else if (line.trim() === '});' && /^\s+/.test(line)) {
        // If it's an INDENTED }); it MUST be a typo from the previous script
        // Fix it back to };
        lines[i] = lines[i].replace('});', '};');
    }
}

fs.writeFileSync(filePath, lines.join('\r\n'), 'utf-8');
console.log("✅ [FixVisuals] Final robust synchronization complete.");
