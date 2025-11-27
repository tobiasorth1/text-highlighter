import * as assert from 'assert';
import * as vscode from 'vscode';
import { Highlighter } from '../../highlighter';

suite('Wildcard Language Support Test Suite', () => {
    vscode.window.showInformationMessage('Start Wildcard Language Support tests.');

    test('Wildcard * should match any language', async () => {
        // Create a document with a specific language
        const doc = await vscode.workspace.openTextDocument({
            content: 'TODO: fix this',
            language: 'typescript'
        });
        const editor = await vscode.window.showTextDocument(doc);

        // Configure a rule with wildcard language
        const config = vscode.workspace.getConfiguration('textHighlighter');
        await config.update('rules', [
            {
                pattern: 'TODO',
                color: '#FF0000',
                backgroundColor: '#FFFF00',
                isRegex: false,
                languages: ['*']
            }
        ], vscode.ConfigurationTarget.Global);

        // Initialize highlighter
        const diagnosticCollection = vscode.languages.createDiagnosticCollection('textHighlighter');
        const highlighter = new Highlighter(diagnosticCollection);

        // Trigger update
        highlighter.updateDecorations();

        // Check if decorations are applied (we can't easily check decorations directly in test API, 
        // but we can check diagnostics which are also created by the highlighter)
        const diagnostics = diagnosticCollection.get(doc.uri);

        // Clean up
        highlighter.dispose();
        await config.update('rules', undefined, vscode.ConfigurationTarget.Global);
        await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

        // Assert that we found the diagnostic
        assert.ok(diagnostics, 'Diagnostics should not be undefined');
        assert.strictEqual(diagnostics!.length, 1, 'Should have found 1 diagnostic for wildcard rule');
        assert.strictEqual(diagnostics![0].message, 'Pattern match: TODO');
    });
});
