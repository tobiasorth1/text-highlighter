import * as vscode from 'vscode';
import { Highlighter } from './highlighter';

let highlighter: Highlighter;

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "text-highlighter" is now active!');

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('textHighlighter');
    context.subscriptions.push(diagnosticCollection);

    highlighter = new Highlighter(diagnosticCollection);

    // Initial update
    highlighter.updateDecorations();

    // Update on configuration change
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('textHighlighter')) {
            highlighter.updateDecorations();
        }
    }));

    // Update on active editor change
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor) {
            highlighter.updateDecorations();
        }
    }));

    // Update on text change (debounced)
    let timeout: NodeJS.Timeout | undefined = undefined;
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
        if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(() => {
                highlighter.updateDecorations();
            }, 500);
        }
    }));
}

export function deactivate() {
    if (highlighter) {
        highlighter.dispose();
    }
}

