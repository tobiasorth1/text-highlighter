# Text Highlighter

A VSCode extension to highlight text based on custom rules (string literals or regex) with configurable colors.

## Features

- Highlight multiple patterns with different background colors.
- **Diagnostics**: Matches are reported in the Problems tab (whole line).
- **Configurable Severity**: Set diagnostic severity (error, warning, information, hint).
- **Custom Messages**: Define custom problem messages for each rule.
- Support for Regular Expressions.
- Case sensitivity toggle.
- Customizable background colors (text color remains unchanged by default).

## Configuration

Add the following to your `settings.json`:

```json
"textHighlighter.rules": [
  {
    "pattern": "TODO",
    "backgroundColor": "rgba(249, 4, 4, 0.98)",
    "problemMessage": "TODO item found",
    "severity": "error",
    "languages": ["python", "javascript", "typescript"],
    "isRegex": false,
    "isCaseSensitive": true
  },
  {
    "pattern": "\\b(note|info)\\b",
    "backgroundColor": "blue",
    "problemMessage": "Note or Info",
    "severity": "information",
    "languages": ["*.md", "*.txt"],
    "isRegex": true,
    "isCaseSensitive": false
  }
]
```

### Configuration Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `pattern` | string | Yes | - | Text or regex pattern to match |
| `languages` | array | Yes | - | Language IDs (e.g., `"python"`) or file patterns (e.g., `"*.md"`) |
| `backgroundColor` | string | No | `"rgba(255, 255, 0, 0.3)"` | CSS background color |
| `color` | string | No | undefined | CSS text color (leave empty to preserve syntax highlighting) |
| `problemMessage` | string | No | `"Pattern match: {pattern}"` | Custom message for Problems tab |
| `severity` | string | No | `"error"` | Diagnostic severity: `error`, `warning`, `information`, or `hint` |
| `isRegex` | boolean | No | `false` | Treat pattern as regular expression |

**Note:** All pattern matching is case-sensitive.

**Regex Tips:**
- Use `^` and `$` for line anchors (multiline mode is enabled)
- For lines longer than 72 chars: `^.{73,}$`
- For matching at start of line: `^pattern`

## Development Instructions

### Prerequisites
- Node.js
- VSCode

### Setup
1. Clone the repository.
2. Run `npm install` to install dependencies.

### Running the Extension
1. Open the project in VSCode.
2. Press `F5` to start debugging. This will open a new "Extension Development Host" window.
3. In the new window, open a file and test the highlighting.

### Running Tests
- Run `npm test` to run the automated tests.
- Run `npm run test:compatibility` to run compatibility tests with other extensions.
