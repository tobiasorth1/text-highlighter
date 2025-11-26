# Agents

## VSCode Plugin for Text Highlighter

### Goal
Develop a lightweight, performant VSCode extension to highlight text based on user-defined rules (string literals or regex) with customizable colors. The extension must be built from scratch to avoid license issues and conflicts with existing extensions.

### Requirements
1. **Customizable Highlighting**: Highlight text with user-specified background colors. Text color should remain unchanged by default.
2. **Multiple Rules**: Support multiple independent highlighting rules.
3. **Regex Support**: Allow full RegEx patterns for matching.
4. **Case Sensitivity**: Option to toggle case sensitivity per rule.
5. **Diagnostics**: Matches should be reported in the Problems tab. The entire line containing the match should be marked.
6. **Diagnostic Customization**: Configurable message (`problemMessage`) and severity (default to Error).
7. **Configuration**: All settings managed via `settings.json`.
8. **Documentation**: Clear instructions for usage and development.
9. **Robustness**: Thoroughly tested against other extensions to ensure compatibility.

### Proposed Configuration Structure
Users will configure the extension in `settings.json`:

```json
"textHighlighter.rules": [
  {
    "pattern": "TODO",
    "backgroundColor": "rgba(255, 0, 0, 0.3)",
    "problemMessage": "TODO item found",
    "severity": "error",
    "languages": ["python", "javascript"],
    "isRegex": false,
    "isCaseSensitive": true
  },
  {
    "pattern": "\\b(note|info)\\b",
    "backgroundColor": "blue",
    "problemMessage": "Note or Info",
    "severity": "information",
    "languages": ["*.md"],
    "isRegex": true,
    "isCaseSensitive": false
  }
]
```

### Development Plan

#### 1. Project Initialization
- [x] Initialize a new VSCode extension.
- [x] Configure `package.json` and build scripts.

#### 2. Core Implementation
- [x] Decoration Manager: Update to support background-only highlighting.
- [x] Diagnostics Manager: Implement `vscode.DiagnosticCollection`.
- [ ] **Diagnostic Enhancements**: Add `problemMessage` and `severity` support.

#### 3. Testing & Verification
- [x] Unit Tests: Test regex matching and config parsing.
- [x] Integration Tests: Verify extension activation and decoration application.
- [ ] **Automated Compatibility Testing**: Use `vscode-test` to install popular extensions (e.g., Prettier, ESLint, Python) and verify `text-highlighter` functionality remains correct.

#### 4. Documentation
- Write a comprehensive `README.md` with examples and troubleshooting tips.