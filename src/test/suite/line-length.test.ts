import * as assert from 'assert';
import { getMatches } from '../../highlighter';

suite('Line Length Regex Test', () => {
    test('Pattern .{73,} without anchors', () => {
        const text = `Short line
This is a line with exactly 72 characters - it should NOT be matched!!XX
This is a line with exactly 73 characters - it SHOULD be matched here!!!X
Another short line`;

        const matches = getMatches(text, '.{73,}', true);
        console.log('Matches found:', matches.length);
        matches.forEach((m, i) => {
            const matched = text.substring(m.index, m.index + m.length);
            console.log(`Match ${i + 1}: index=${m.index}, length=${m.length}`);
            console.log(`  Text: "${matched}"`);
        });

        // This pattern will match ANY 73+ char sequence, not just lines
        assert.ok(matches.length > 0, 'Should find matches');
    });

    test('Pattern ^.{73,}$ with anchors', () => {
        const text = `Short line
This is a line with exactly 72 characters - it should NOT be matched!!XX
This is a line with exactly 73 characters - it SHOULD be matched here!!!X
Another short line`;

        const matches = getMatches(text, '^.{73,}$', true);
        console.log('Matches with anchors:', matches.length);
        matches.forEach((m, i) => {
            const matched = text.substring(m.index, m.index + m.length);
            console.log(`Match ${i + 1}: index=${m.index}, length=${m.length}`);
            console.log(`  Text: "${matched}"`);
        });

        // Should only match the 73-char line
        assert.strictEqual(matches.length, 1, 'Should find exactly 1 match');
    });

    test('Actual line lengths', () => {
        const lines = [
            '"pattern": "TODO",',
            '"backgroundColor": "rgba(249, 4, 4, 0.98)",',
            '"problemMessage": "TODO item found",',
        ];

        lines.forEach((line, i) => {
            console.log(`Line ${i + 1}: ${line.length} chars - "${line}"`);
        });
    });
});
