import * as assert from 'assert';
import * as vscode from 'vscode';
import { Highlighter } from '../../highlighter';

suite('Wildcard Robustness Test Suite', () => {
    test('Should handle languages as string instead of array', async () => {
        // Create a document
        const doc = await vscode.workspace.openTextDocument({
            content: 'TODO: fix this',
            language: 'plaintext'
        });
        await vscode.window.showTextDocument(doc);

        // Configure a rule with INVALID languages (string instead of array)
        // We need to bypass type checking to simulate user error in JSON
        const config = vscode.workspace.getConfiguration('textHighlighter');
        const invalidRule = {
            pattern: 'TODO',
            color: '#FF0000',
            backgroundColor: '#FFFF00',
            isRegex: false,
            languages: '*' // This is the user error
        };

        await config.update('rules', [invalidRule], vscode.ConfigurationTarget.Global);

        // Initialize highlighter
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('textHighlighter');
        const highlighter = new Highlighter(diagnosticCollection);

        // Trigger update - this should NOT throw
        try {
            highlighter.updateDecorations();
        } catch (e) {
            assert.fail('updateDecorations threw an error with invalid config: ' + e);
        }

        // Check diagnostics - ideally it should still work if we support it, 
        // or at least not crash.
        const diagnostics = diagnosticCollection.get(doc.uri);

        // Clean up
        highlighter.dispose();
        await config.update('rules', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        // If we decide to support string input, this assertion should pass.
        assert.ok(diagnostics, 'Diagnostics should not be undefined');
        assert.strictEqual(diagnostics!.length, 1, 'Should have found 1 diagnostic for wildcard rule with string config');
        assert.strictEqual(diagnostics![0].message, 'Pattern match: TODO');
    });
});
