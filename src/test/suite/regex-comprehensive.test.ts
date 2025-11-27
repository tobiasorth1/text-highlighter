import * as assert from 'assert';
import { getMatches } from '../../highlighter';

suite('Comprehensive Regex Test Suite', () => {

    // Helper to simplify assertions
    function assertMatchCount(text: string, pattern: string, expectedCount: number, description: string) {
        const matches = getMatches(text, pattern, true);
        assert.strictEqual(matches.length, expectedCount, `${description} - Pattern: /${pattern}/`);
    }

    function assertMatchContent(text: string, pattern: string, expectedMatches: string[], description: string) {
        const matches = getMatches(text, pattern, true);
        assert.strictEqual(matches.length, expectedMatches.length, `${description} (count) - Pattern: /${pattern}/`);
        matches.forEach((m, i) => {
            const matchText = text.substring(m.index, m.index + m.length);
            assert.strictEqual(matchText, expectedMatches[i], `${description} (match ${i}) - Pattern: /${pattern}/`);
        });
    }

    test('Character Classes', () => {
        const text = 'The year is 2023 and the time is 10:45.';
        assertMatchCount(text, '\\d', 8, 'Digit \\d');
        assertMatchCount(text, '\\d+', 3, 'One or more digits \\d+'); // 2023, 10, 45
        assertMatchCount(text, '\\D', 31, 'Non-digit \\D');
        assertMatchCount(text, '\\w', 29, 'Word character \\w');
        assertMatchCount(text, '\\W', 10, 'Non-word character \\W');
        assertMatchCount(text, '\\s', 8, 'Whitespace \\s');
        assertMatchCount(text, '\\S', 31, 'Non-whitespace \\S');
        assertMatchCount(text, '.', 39, 'Any character .'); // Matches everything except newline (usually)
    });

    test('Anchors', () => {
        const text = 'Start middle End';
        assertMatchCount(text, '^Start', 1, 'Start of string ^');
        assertMatchCount(text, '^middle', 0, 'Start of string mismatch');
        assertMatchCount(text, 'End$', 1, 'End of string $');
        assertMatchCount(text, 'middle$', 0, 'End of string mismatch');
        assertMatchCount(text, '\\bmiddle\\b', 1, 'Word boundary \\b');
        assertMatchCount(text, '\\Bdd\\B', 1, 'Non-word boundary \\B');
    });

    test('Groups and Ranges', () => {
        const text = 'apple banana cherry date';
        assertMatchCount(text, '[abc]', 7, 'Character set [abc]'); // a, b, a, a, a, c, a
        assertMatchCount(text, '[^abc]', 17, 'Negated set [^abc]');
        assertMatchCount(text, '(apple|banana)', 2, 'Alternation group (a|b)');
        assertMatchCount(text, '[a-z]', 21, 'Range [a-z]');
    });

    test('Quantifiers', () => {
        const text = 'a aa aaa aaaa';
        assertMatchCount(text, 'a*', 8, 'Zero or more *'); // Matches empty strings too! 
        // Note: JS regex exec() with global flag might behave interestingly with zero-length matches.
        // Let's test non-zero matches for clarity or be specific.
        assertMatchCount(text, 'a+', 4, 'One or more +');
        assertMatchCount(text, 'a?', 14, 'Zero or one ?'); // Matches empty strings
        assertMatchCount(text, 'a{2}', 4, 'Exactly n {2}'); // aa, aa(from aaa), aa(from aaaa), aa(from aaaa) -> wait, global match consumes.
        // 'aa' -> match
        // 'aaa' -> match 'aa', 'a' left
        // 'aaaa' -> match 'aa', match 'aa'
        // Total: 1 + 1 + 2 = 4? No.
        // 'a' -> 0
        // 'aa' -> 1
        // 'aaa' -> 1
        // 'aaaa' -> 2
        // Total 4.
        assertMatchCount(text, 'a{2,}', 3, 'n or more {2,}'); // aa, aaa, aaaa
        assertMatchCount(text, 'a{2,3}', 3, 'n to m {2,3}'); // aa, aaa, aaa(from aaaa)
    });

    test('Escaped Characters', () => {
        const text = 'Price: $10.00 * 5';
        assertMatchCount(text, '\\$', 1, 'Escaped dollar \\$');
        assertMatchCount(text, '\\.', 1, 'Escaped dot \\.');
        assertMatchCount(text, '\\*', 1, 'Escaped star \\*');
    });

    test('Lookarounds (JS Support)', () => {
        const text = 'foobar foobaz';
        assertMatchCount(text, 'foo(?=bar)', 1, 'Positive lookahead (?=)');
        assertMatchCount(text, 'foo(?!bar)', 1, 'Negative lookahead (?!)');
    });

    test('Specific Scenarios', () => {
        const text = 'TODO: fix this\nFIXME: urgent\nNOTE: remember';
        assertMatchContent(text, '^(TODO|FIXME|NOTE):', ['TODO:', 'FIXME:', 'NOTE:'], 'Keywords at start of line');

        const emailText = 'Contact: test@example.com, support@site.org';
        assertMatchCount(emailText, '[\\w._%+-]+@[\\w.-]+\\.[a-zA-Z]{2,}', 2, 'Email pattern');

        const dateText = '2023-01-01 2023/02/02';
        assertMatchCount(dateText, '\\d{4}[-/]\\d{2}[-/]\\d{2}', 2, 'Date pattern');

        const ipText = '192.168.1.1 10.0.0.1 999.999.999.999';
        assertMatchCount(ipText, '\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b', 3, 'IP Address pattern (simple)');
    });

    test('Multiline handling', () => {
        const text = 'Line 1\nLine 2\nLine 3';
        assertMatchCount(text, '^Line', 3, 'Start of line with multiline flag'); // getMatches sets 'gm' flags
        assertMatchCount(text, '\\d$', 3, 'End of line with multiline flag');
    });

    test('Case sensitivity', () => {
        // getMatches sets 'gm' flags, so it is case sensitive by default?
        // Wait, 'gm' means global and multiline. No 'i'. So it IS case sensitive.
        const text = 'Word word WORD';
        assertMatchCount(text, 'word', 1, 'Case sensitive match');
        assertMatchCount(text, 'Word', 1, 'Case sensitive match');
        assertMatchCount(text, 'WORD', 1, 'Case sensitive match');
    });

    test('Greedy vs Lazy', () => {
        const text = '<div>content</div>';
        assertMatchContent(text, '<.+>', ['<div>content</div>'], 'Greedy match');
        assertMatchContent(text, '<.+?>', ['<div>', '</div>'], 'Lazy match');
    });
});
