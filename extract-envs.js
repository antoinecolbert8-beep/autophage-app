const fs = require('fs');
const path = require('path');

const DIRS_TO_SCAN = ['app', 'lib', 'core', 'components', 'scripts', 'netlify'];
const ENV_REGEX = /process\.env\.([A-Za-z0-9_]+)/g;

function scanDir(dir, envs = new Set()) {
    if (!fs.existsSync(dir)) return envs;
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== '.next') {
                scanDir(fullPath, envs);
            }
        } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            let match;
            while ((match = ENV_REGEX.exec(content)) !== null) {
                if (match[1] !== 'NODE_ENV') {
                    envs.add(match[1]);
                }
            }
        }
    }
    return envs;
}

const allEnvs = new Set();
for (const dir of DIRS_TO_SCAN) {
    scanDir(path.join(process.cwd(), dir), allEnvs);
}

const sortedEnvs = Array.from(allEnvs).sort();
console.log(JSON.stringify(sortedEnvs, null, 2));
