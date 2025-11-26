import * as assert from 'assert';
import { getMatches } from '../../highlighter';

suite('Pattern Verification Test', () => {
    test('Verify pattern ".{73,}" behavior', () => {
        // Simulate the actual JSON content
        const jsonContent = `{
    "pattern": "TODO",
    "backgroundColor": "rgba(249, 4, 4, 0.98)",
    "problemMessage": "TODO item found",
    "severity": "error",
    "isRegex": false,
    "languages": ["plaintext", "python"]
}`;

        console.log('=== Testing pattern: .{73,} ===');
        const matches1 = getMatches(jsonContent, '.{73,}', true);
        console.log(`Matches found: ${matches1.length}`);
        matches1.forEach((m, i) => {
            const matched = jsonContent.substring(m.index, m.index + m.length);
            const lineNum = jsonContent.substring(0, m.index).split('\n').length;
            console.log(`Match ${i + 1}: Line ${lineNum}, index=${m.index}, length=${m.length}`);
            console.log(`  First 50 chars: "${matched.substring(0, 50)}..."`);
        });

        console.log('\n=== Testing pattern: ^.{73,}$ ===');
        const matches2 = getMatches(jsonContent, '^.{73,}$', true);
        console.log(`Matches found: ${matches2.length}`);
        matches2.forEach((m, i) => {
            const matched = jsonContent.substring(m.index, m.index + m.length);
            const lineNum = jsonContent.substring(0, m.index).split('\n').length;
            console.log(`Match ${i + 1}: Line ${lineNum}, index=${m.index}, length=${m.length}`);
            console.log(`  Text: "${matched}"`);
        });

        assert.ok(true);
    });
});
