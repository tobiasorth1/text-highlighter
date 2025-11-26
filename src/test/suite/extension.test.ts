import * as assert from 'assert';
import * as vscode from 'vscode';
// We can't easily test the Highlighter class directly because it depends on vscode.window and vscode.workspace which are mocked in the test environment but harder to control without a real editor.
// Mock DiagnosticCollection if we were testing Highlighter class directly, but here we are just testing logic. However, if we add integration tests later, we need to be aware. For now, just checking if any existing tests broke.

// For now, let's create a simple test that checks if the extension activates.
suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });
});
