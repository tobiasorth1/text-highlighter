import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Defaults Test Suite', () => {
    vscode.window.showInformationMessage('Start defaults tests.');

    test('Default rules are present in configuration', () => {
        const config = vscode.workspace.getConfiguration('textHighlighter');
        const rules = config.get<any[]>('rules');
        // Inspect the configuration object to see if defaults are applied.
        // Note: 'rules' might return the user's setting (which might be empty if not set), 
        // but the 'inspect' method gives us the default value.
        const inspected = config.inspect<any[]>('rules');

        assert.ok(inspected, 'Configuration should be inspectable');
        assert.ok(inspected?.defaultValue, 'Default value should exist');
        assert.strictEqual(inspected?.defaultValue?.length, 4, 'There should be 4 default rules');

        const defaults = inspected?.defaultValue || [];
        const todoRule = defaults.find(r => r.pattern === 'TODO');
        const fixmeRule = defaults.find(r => r.pattern === 'FIXME');
        const noteRule = defaults.find(r => r.pattern === 'NOTE');
        const longLineRule = defaults.find(r => r.pattern === '^.{101,}$');

        assert.ok(todoRule, 'TODO rule should exist by default');
        assert.strictEqual(todoRule.color, 'gold', 'TODO should be gold');
        assert.strictEqual(todoRule.severity, 'information', 'TODO should have information severity');
        assert.ok(todoRule.problemMessage, 'TODO should have a problem message');

        assert.ok(fixmeRule, 'FIXME rule should exist by default');
        assert.strictEqual(fixmeRule.color, 'red', 'FIXME should be red');
        assert.strictEqual(fixmeRule.severity, 'warning', 'FIXME should have warning severity');
        assert.ok(fixmeRule.problemMessage, 'FIXME should have a problem message');

        assert.ok(noteRule, 'NOTE rule should exist by default');
        assert.strictEqual(noteRule.color, 'dodgerblue', 'NOTE should be dodgerblue');
        assert.strictEqual(noteRule.severity, 'information', 'NOTE should have information severity');
        assert.ok(noteRule.problemMessage, 'NOTE should have a problem message');

        assert.ok(longLineRule, 'Long line rule should exist by default');
        assert.strictEqual(longLineRule.backgroundColor, 'lightpink', 'Long line should be lightpink');
        assert.strictEqual(longLineRule.isRegex, true, 'Long line should be marked as regex');
        assert.strictEqual(longLineRule.severity, 'information', 'Long line should have information severity');
        assert.ok(longLineRule.problemMessage, 'Long line should have a problem message');
    });
});
