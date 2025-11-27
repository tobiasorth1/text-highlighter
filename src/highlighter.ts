import * as vscode from 'vscode';

interface HighlightRule {
    pattern: string;
    color?: string;
    backgroundColor: string;
    isRegex: boolean;
    problemMessage?: string;
    severity?: 'error' | 'warning' | 'information' | 'hint';
    languages: string[];
}

export function getMatches(text: string, pattern: string, isRegex: boolean): { index: number, length: number }[] {
    const matches: { index: number, length: number }[] = [];
    try {
        const flags = 'gm'; // Case-sensitive with multiline
        let regex: RegExp;
        if (isRegex) {
            regex = new RegExp(pattern, flags);
        } else {
            const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            regex = new RegExp(escapedPattern, flags);
        }

        let match;
        while ((match = regex.exec(text))) {
            matches.push({ index: match.index, length: match[0].length });
            if (match[0].length === 0) {
                regex.lastIndex++;
            }
        }
    } catch (e) {
        console.error(`Invalid regex pattern: ${pattern}`, e);
    }
    return matches;
}

export class Highlighter {
    private decorationTypes: vscode.TextEditorDecorationType[] = [];
    private diagnosticCollection: vscode.DiagnosticCollection;

    constructor(diagnosticCollection: vscode.DiagnosticCollection) {
        this.diagnosticCollection = diagnosticCollection;
    }

    public updateDecorations() {
        // Clear existing decorations
        this.decorationTypes.forEach(d => d.dispose());
        this.decorationTypes = [];

        const config = vscode.workspace.getConfiguration('textHighlighter');
        const rules = config.get<HighlightRule[]>('rules') || [];

        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }

        // Clear existing diagnostics for this document
        this.diagnosticCollection.delete(activeEditor.document.uri);

        const text = activeEditor.document.getText();
        const diagnostics: vscode.Diagnostic[] = [];

        // Get current document language and filename
        const docLanguage = activeEditor.document.languageId;
        const docFileName = activeEditor.document.fileName;

        rules.forEach(rule => {
            if (!rule.pattern || !rule.languages) {
                return;
            }

            // Check if rule applies to this document
            let languages = rule.languages;
            if (typeof languages === 'string') {
                languages = [languages];
            }

            const appliesToDoc = languages.some(lang => {
                // Check for wildcard matching any language
                if (lang === '*') {
                    return true;
                }
                // Check if it's a language ID match
                if (lang === docLanguage) {
                    return true;
                }
                // Check if it's a file extension pattern (e.g., "*.md")
                if (lang.startsWith('*.')) {
                    const extension = lang.substring(1); // Remove the *
                    return docFileName.endsWith(extension);
                }
                // Check if it's just an extension (e.g., ".md")
                if (lang.startsWith('.')) {
                    return docFileName.endsWith(lang);
                }
                return false;
            });

            if (!appliesToDoc) {
                return;
            }

            const decorationType = vscode.window.createTextEditorDecorationType({
                color: rule.color || undefined,
                // Use light4 to ensure it doesn't cover inline decorations
                light: {
                    backgroundColor: rule.backgroundColor
                },
                dark: {
                    backgroundColor: rule.backgroundColor
                },
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
            });
            this.decorationTypes.push(decorationType);

            const matches = getMatches(text, rule.pattern, rule.isRegex);

            // Filter out ranges that contain color values to preserve VSCode's color decorators
            const colorPattern = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g;
            const colorMatches: { start: number, end: number }[] = [];
            let colorMatch;
            while ((colorMatch = colorPattern.exec(text))) {
                colorMatches.push({
                    start: colorMatch.index,
                    end: colorMatch.index + colorMatch[0].length
                });
            }

            const ranges = matches
                .filter(m => {
                    // Check if this match overlaps with any color value
                    const matchEnd = m.index + m.length;
                    return !colorMatches.some(color => {
                        // Check for overlap
                        return !(matchEnd <= color.start || m.index >= color.end);
                    });
                })
                .map(m => {
                    const startPos = activeEditor.document.positionAt(m.index);
                    const endPos = activeEditor.document.positionAt(m.index + m.length);
                    return new vscode.Range(startPos, endPos);
                });

            activeEditor.setDecorations(decorationType, ranges);

            // Create diagnostics for each match (including those with color values)
            matches.forEach(m => {
                const startPos = activeEditor.document.positionAt(m.index);
                const line = activeEditor.document.lineAt(startPos.line);
                const diagnosticRange = line.range; // Highlight the whole line

                let severity = vscode.DiagnosticSeverity.Error;
                switch (rule.severity) {
                    case 'warning':
                        severity = vscode.DiagnosticSeverity.Warning;
                        break;
                    case 'information':
                        severity = vscode.DiagnosticSeverity.Information;
                        break;
                    case 'hint':
                        severity = vscode.DiagnosticSeverity.Hint;
                        break;
                }

                const message = rule.problemMessage || `Pattern match: ${rule.pattern}`;

                const diagnostic = new vscode.Diagnostic(
                    diagnosticRange,
                    message,
                    severity
                );
                diagnostics.push(diagnostic);
            });
        });

        this.diagnosticCollection.set(activeEditor.document.uri, diagnostics);
    }

    public dispose() {
        this.decorationTypes.forEach(d => d.dispose());
    }
}
