import * as assert from 'assert';
import { getMatches } from '../../highlighter';

suite('Highlighter Logic Test Suite', () => {
    test('String matching', () => {
        const text = 'Hello World, hello world';
        const matches = getMatches(text, 'hello', false);
        assert.strictEqual(matches.length, 1); // Case-sensitive, only matches lowercase
    });

    test('Regex matching', () => {
        const text = 'Test 123, test 456';
        const matches = getMatches(text, '\\d+', true);
        assert.strictEqual(matches.length, 2);
    });

    test('Regex matching (invalid)', () => {
        const text = 'Test';
        const matches = getMatches(text, '[', true);
        assert.strictEqual(matches.length, 0);
    });
});
