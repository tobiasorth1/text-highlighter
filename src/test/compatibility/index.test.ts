import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Compatibility Test Suite', () => {
    vscode.window.showInformationMessage('Start compatibility tests.');

    test('Highlighting should work with other extensions present', async () => {
        // Create a document
        const doc = await vscode.workspace.openTextDocument({
            content: 'TODO: Fix this\nSome other text',
            language: 'plaintext'
        });
        await vscode.window.showTextDocument(doc);

        // Configure rule
        const config = vscode.workspace.getConfiguration('textHighlighter');
        await config.update('rules', [{
            pattern: 'TODO',
            backgroundColor: 'rgba(255,0,0,0.3)',
            severity: 'warning',
            problemMessage: 'Custom Warning',
            languages: ['plaintext'],
            isRegex: false
        }], vscode.ConfigurationTarget.Global);

        // Wait for debounce
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check diagnostics
        const diagnostics = vscode.languages.getDiagnostics(doc.uri);
        assert.strictEqual(diagnostics.length, 1, 'Should have 1 diagnostic');
        assert.strictEqual(diagnostics[0].message, 'Custom Warning', 'Should have custom message');
        assert.strictEqual(diagnostics[0].severity, vscode.DiagnosticSeverity.Warning, 'Should have warning severity');

        // Verify range covers the whole line
        assert.strictEqual(diagnostics[0].range.start.character, 0);
        assert.strictEqual(diagnostics[0].range.end.character, 14); // Length of "TODO: Fix this"
    });
});
