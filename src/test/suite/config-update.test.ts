import * as assert from 'assert';
import * as vscode from 'vscode';
import { Highlighter } from '../../highlighter';

suite('Dynamic Configuration Update Test Suite', () => {
    test('Should apply configuration changes without reload', async () => {
        // Create a document
        const doc = await vscode.workspace.openTextDocument({
            content: 'TODO: initial\nFIXME: update',
            language: 'plaintext'
        });
        await vscode.window.showTextDocument(doc);

        const config = vscode.workspace.getConfiguration('textHighlighter');

        // 1. Set initial rule
        const initialRule = {
            pattern: 'TODO',
            color: '#FF0000',
            backgroundColor: '#FFFF00',
            isRegex: false,
            languages: ['plaintext']
        };
        await config.update('rules', [initialRule], vscode.ConfigurationTarget.Global);

        // Initialize highlighter (simulating extension activation)
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('textHighlighter');
        const highlighter = new Highlighter(diagnosticCollection);

        // Initial update
        highlighter.updateDecorations();

        // Verify initial state
        let diagnostics = diagnosticCollection.get(doc.uri);
        assert.ok(diagnostics, 'Diagnostics should be present');
        assert.strictEqual(diagnostics!.length, 1, 'Should have 1 diagnostic initially');
        assert.strictEqual(diagnostics![0].message, 'Pattern match: TODO');

        // 2. Update rule (change pattern to FIXME)
        const updatedRule = {
            pattern: 'FIXME',
            color: '#00FF00',
            backgroundColor: '#00FFFF',
            isRegex: false,
            languages: ['plaintext']
        };

        // We need to manually trigger the update logic that would normally be triggered by the event listener
        // In a real extension, vscode.workspace.onDidChangeConfiguration would fire.
        // In this unit test, we might need to manually call updateDecorations() if we can't easily mock the event.
        // However, the user asked if "updates to extension" need restart. 
        // If we change config, the event listener in extension.ts calls highlighter.updateDecorations().
        // So we should verify that calling updateDecorations() picks up the new config.

        await config.update('rules', [updatedRule], vscode.ConfigurationTarget.Global);

        // Simulate the event listener firing
        highlighter.updateDecorations();

        // Verify updated state
        diagnostics = diagnosticCollection.get(doc.uri);
        assert.ok(diagnostics, 'Diagnostics should be present after update');
        assert.strictEqual(diagnostics!.length, 1, 'Should have 1 diagnostic after update');
        assert.strictEqual(diagnostics![0].message, 'Pattern match: FIXME');

        // Clean up
        highlighter.dispose();
        await config.update('rules', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    });
});
