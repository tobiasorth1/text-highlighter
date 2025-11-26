import * as assert from 'assert';

suite('Regex Debug Test', () => {
    test('Understanding multiline regex', () => {
        // Create lines with exact lengths
        const line72 = 'A'.repeat(72);  // Exactly 72 chars
        const line73 = 'B'.repeat(73);  // Exactly 73 chars
        const line100 = 'C'.repeat(100); // Exactly 100 chars

        const text = `Short
${line72}
${line73}
${line100}
End`;

        console.log('=== LINE LENGTHS ===');
        text.split('\n').forEach((line, i) => {
            console.log(`Line ${i}: ${line.length} chars`);
        });

        // Test 1: Basic pattern without anchors
        const regex1 = /.{73,}/gm;
        console.log('\n=== Pattern: .{73,} (should match 73+ char sequences) ===');
        let match;
        let count1 = 0;
        while ((match = regex1.exec(text))) {
            count1++;
            console.log(`Match ${count1}: index=${match.index}, length=${match[0].length}`);
        }
        console.log(`Total matches: ${count1}`);

        // Test 2: With anchors
        const regex2 = /^.{73,}$/gm;
        console.log('\n=== Pattern: ^.{73,}$ (should match lines with 73+ chars) ===');
        regex2.lastIndex = 0;
        let count2 = 0;
        while ((match = regex2.exec(text))) {
            count2++;
            console.log(`Match ${count2}: index=${match.index}, length=${match[0].length}`);
        }
        console.log(`Total matches: ${count2}`);

        assert.ok(true);
    });
});
