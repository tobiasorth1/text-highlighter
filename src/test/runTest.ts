import * as path from 'path';

import { runTests } from '@vscode/test-electron';

async function main() {
    try {
        const extensionDevelopmentPath = path.resolve(__dirname, '../../');

        // Check if running compatibility tests
        const isCompatibility = process.argv.includes('--compatibility');
        const testDir = isCompatibility ? './compatibility/index' : './suite/index';
        const extensionTestsPath = path.resolve(__dirname, testDir);

        const launchArgs = [
            '--disable-gpu' // Recommended for CI
        ];

        if (isCompatibility) {
            console.log('Running compatibility tests...');
            // Install extensions
            const extensions = [
                'esbenp.prettier-vscode',
                'dbaeumer.vscode-eslint',
                'ms-python.python'
            ];

            for (const ext of extensions) {
                launchArgs.push(`--install - extension=${ext} `);
            }
        }

        await runTests({
            extensionDevelopmentPath,
            extensionTestsPath,
            launchArgs
        });
    } catch (err) {
        console.error('Failed to run tests');
        process.exit(1);
    }
}

main();

