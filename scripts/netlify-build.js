const { spawnSync } = require('child_process');

console.log('🚀 Starting robust Netlify build script...');

// Ensure NODE_OPTIONS includes strict memory limit
const desiredMemory = '--max-old-space-size=4096';
let nodeOptions = process.env.NODE_OPTIONS || '';

if (!nodeOptions.includes('max-old-space-size')) {
    nodeOptions += ` ${desiredMemory}`;
    process.env.NODE_OPTIONS = nodeOptions; // Set for current process and children
    console.log(`💪 Set NODE_OPTIONS to: ${nodeOptions}`);
} else {
    console.log(`ℹ️ NODE_OPTIONS already set: ${nodeOptions}`);
}

try {
    // 1. Generate Prisma Client
    console.log('📦 Generating Prisma Client...');
    const prisma = spawnSync('npx', ['prisma', 'generate'], {
        stdio: 'inherit',
        shell: true,
        env: { ...process.env, NODE_OPTIONS: nodeOptions } // Explicitly pass env
    });

    if (prisma.error) throw prisma.error;
    if (prisma.status !== 0) throw new Error(`Prisma exited with code ${prisma.status}`);

    // 2. Run Next.js Build
    console.log('🏗️  Running Next.js Build...');

    const nextBin = require.resolve('next/dist/bin/next');
    // We run 'node' with the next binary. 
    // We rely on NODE_OPTIONS being inherited by this child process.
    const build = spawnSync('node', [nextBin, 'build'], {
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: nodeOptions } // Explicitly pass env
    });

    if (build.error) throw build.error;
    if (build.status !== 0) throw new Error(`Next.js build exited with code ${build.status}`);

    console.log('✅ Build completed successfully!');
} catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
}
