import * as assert from 'assert';
import * as vscode from 'vscode';
import { Highlighter } from '../../highlighter';

import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

suite('Settings Exclusion Test Suite', () => {
    vscode.window.showInformationMessage('Start Settings Exclusion tests.');

    test('Should only ignore VS Code settings files', async () => {
        const tmpDir = os.tmpdir();

        // 1. Workspace settings (.vscode/settings.json) - Should be IGNORED
        const vscodeDir = path.join(tmpDir, '.vscode');
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir);
        }
        const workspaceSettingsPath = path.join(vscodeDir, 'settings.json');

        // 2. User settings (User/settings.json) - Should be IGNORED
        const userDir = path.join(tmpDir, 'User');
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir);
        }
        const userSettingsPath = path.join(userDir, 'settings.json');

        // 3. Generic settings (project/settings.json) - Should be HIGHLIGHTED
        const projectDir = path.join(tmpDir, 'project');
        if (!fs.existsSync(projectDir)) {
            fs.mkdirSync(projectDir);
        }
        const genericSettingsPath = path.join(projectDir, 'settings.json');

        const content = new Uint8Array(Buffer.from('// TODO: fix this'));

        // Create files
        await vscode.workspace.fs.writeFile(vscode.Uri.file(workspaceSettingsPath), content);
        await vscode.workspace.fs.writeFile(vscode.Uri.file(userSettingsPath), content);
        await vscode.workspace.fs.writeFile(vscode.Uri.file(genericSettingsPath), content);

        try {
            // Configure rule
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

            const diagnosticCollection = vscode.languages.createDiagnosticCollection('textHighlighter');
            const highlighter = new Highlighter(diagnosticCollection);

            // Test Workspace Settings (Ignored)
            const wsDoc = await vscode.workspace.openTextDocument(vscode.Uri.file(workspaceSettingsPath));
            await vscode.window.showTextDocument(wsDoc);
            highlighter.updateDecorations();
            assert.strictEqual(diagnosticCollection.get(wsDoc.uri)?.length, 0, 'Should ignore .vscode/settings.json');

            // Test User Settings (Ignored)
            const userDoc = await vscode.workspace.openTextDocument(vscode.Uri.file(userSettingsPath));
            await vscode.window.showTextDocument(userDoc);
            highlighter.updateDecorations();
            assert.strictEqual(diagnosticCollection.get(userDoc.uri)?.length, 0, 'Should ignore User/settings.json');

            // Test Generic Settings (Highlighted)
            const genericDoc = await vscode.workspace.openTextDocument(vscode.Uri.file(genericSettingsPath));
            await vscode.window.showTextDocument(genericDoc);
            highlighter.updateDecorations();
            assert.ok(diagnosticCollection.get(genericDoc.uri)?.length! > 0, 'Should highlight generic settings.json');

            highlighter.dispose();
        } finally {
            // Cleanup
            try {
                // We don't delete dirs to avoid issues if they existed, but in tmp it should be fine.
                // For safety just delete files.
                await vscode.workspace.fs.delete(vscode.Uri.file(workspaceSettingsPath));
                await vscode.workspace.fs.delete(vscode.Uri.file(userSettingsPath));
                await vscode.workspace.fs.delete(vscode.Uri.file(genericSettingsPath));
            } catch (e) {
                console.error('Error cleaning up files:', e);
            }
            const config = vscode.workspace.getConfiguration('textHighlighter');
            await config.update('rules', undefined, vscode.ConfigurationTarget.Global);
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');
        }
    });
});
