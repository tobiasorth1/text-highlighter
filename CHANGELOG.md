# Change Log

All notable changes to the "Text Highlighter" extension will be documented in this file.

## [0.0.3] - 2025-12-04

- Improved default rules: simplified patterns (plain strings instead of regex), added severity and problemMessage to all defaults
- Enhanced default highlighting with named colors (gold, red, dodgerblue, lightpink) for better readability
- Added default rule for long lines (>100 characters) with lightpink background
- Added exclusion for VS Code settings files (.vscode/settings.json and User/settings.json) to prevent unwanted highlighting
- Expanded test suite with default rules validation and settings exclusion tests
- Updated documentation with improved cookbook examples and clearer configuration guidance

## [0.0.2] - 2025-12-02

- Added Bug Report issue template
- Updated README with contribution guidelines and error reporting info
- Fixed wildcard (`*`) support for language matching

## [0.0.1] - 2025-11-26

- Initial release
- Added support for custom regex and string patterns
- Added configurable background and text colors
- Added problem tab integration with configurable severity
