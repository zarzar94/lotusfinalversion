# Changelog

## Unversioned Changes
- VSCode: Added copy-to-clipboard button on code blocks and bash tool inputs.
- VSCode: Fixed extension not working on Windows ARM64 by falling back to x64 binary via emulation.
- Bedrock: Improved efficiency of token counting.
- Bedrock: Added support for `aws login` AWS Management Console credentials.
- Replaced AgentOutputTool and BashOutputTool with a unified TaskOutputTool.

## 2.0.65
- Added ability to switch models while writing a prompt (Alt+P on Linux/Windows, Option+P on macOS).
- Added context window information to status line input.
- Added `fileSuggestion` setting for custom `@` file search commands.
- Added `CLAUDE_CODE_SHELL` environment variable to override automatic shell detection.
- Fixed prompt not being saved to history when aborting with Escape.
- Fixed Read tool image handling to identify format from bytes instead of file extension.

## 2.0.67
- Thinking mode enabled by default for Opus 4.5; configuration moved to `/config`.
- Added search to `/permissions` with `/` shortcut for filtering rules by tool name.
- `/doctor` now shows why the autoupdater is disabled.
- Fixed false "Another process is currently updating Claude" error when up-to-date.
- Fixed MCP servers from `.mcp.json` stuck pending in non-interactive mode.
- Fixed scroll position resetting after deleting a permission rule.
- Fixed word deletion/navigation for non-Latin scripts.
- Fixed `claude install --force` not bypassing stale lock files.
- Fixed consecutive @~/ file references parsing issue in CLAUDE.md.
- Windows: Fixed plugin MCP servers failing due to colons in log directory paths.

## 2.0.68
- Fixed IME positioning for CJK languages.
- Fixed disallowed MCP tools being visible.
- Fixed steering message loss while subagent runs.
- Fixed Option+Arrow word navigation to use word boundaries for CJK.
- Improved plan mode exit UX.
- Added support for enterprise managed settings.

## 2.0.69
- Minor bugfixes.

## 2.0.70
- Enter accepts prompt suggestions immediately (Tab still edits).
- Added wildcard syntax `mcp__server__*` for MCP tool permissions.
- Added auto-update toggle per marketplace.
- Added `current_usage` to status line input.
- Fixed input clearing during queued commands.
- Fixed Tab replacing typed input with suggestions.
- Fixed diff view not updating after terminal resize.
- Improved memory usage by 3x for large conversations.
- Improved resolution of screenshots copied to clipboard (Ctrl+S).
- Removed # shortcut for quick memory entry.
- Fixed thinking mode toggle persistence in /config.
- Improved UI for file creation permission dialog.

## 2.0.71
- Added /config toggle to enable/disable prompt suggestions.
- Added /settings alias for /config.
- Fixed @ file reference suggestions triggering in middle of a path.
- Fixed MCP servers not loading with --dangerously-skip-permissions.
- Fixed permission rules rejecting shell glob patterns.
- Bedrock: ANTHROPIC_BEDROCK_BASE_URL respected.
- New syntax highlighting engine.

## 2.0.72
- Added Claude in Chrome (Beta).
- Reduced terminal flickering.
- Added scannable QR code tip for mobile app.
- Added loading indicator when resuming conversations.
- Fixed /context not respecting custom system prompts in non-interactive mode.
- Fixed Ctrl+Y paste order when pasting multiple lines.
- Improved @ mention file suggestion speed.
- Improved file suggestion performance with .ignore/.rgignore.
- Improved settings validation errors.
- Changed thinking toggle to Alt+T.

## 2.0.73
- Added clickable [Image #N] links.
- Added Alt+Y yank-pop.
- Added plugin discover search filtering.
- Added support for custom session IDs with --fork-session.
- Fixed slow input history cycling and race condition overwriting text.
- Improved /theme command to open theme picker directly.
- Improved theme picker UI.
- Improved search UX with unified SearchBox.
- VSCode: Added tab icon badges for pending permissions and unread completions.

## 2.0.74
- Added LSP tool for code intelligence.
- Added /terminal-setup support for Kitty, Alacritty, Zed, Warp.
- Added Ctrl+T to toggle syntax highlighting in /theme.
- Added guidance for macOS users when Alt shortcuts fail.
- Fixed skill allowed-tools not applied to skill-invoked tools.
- Fixed Opus 4.5 tip showing when already using Opus.
- Fixed crash when syntax highlighting isn't initialized.
- Fixed /plugins discover selection indicator while search is focused.
- Fixed macOS shortcut labels to show "opt".
- Improved /context visualization with grouped skills/agents and sorted token count.
- Windows: Fixed improper rendering.
- VSCode: Added gift tag pictogram for year-end promotion message.

## Version Comparisons
- 2.0.65 -> 2.0.67: Thinking mode default, /permissions search, MCP and word-navigation fixes.
- 2.0.67 -> 2.0.68: IME support, MCP visibility fixes, plan exit UX.
- 2.0.68 -> 2.0.70: Major UX/perf updates and permissions enhancements.
- 2.0.70 -> 2.0.71: Prompt suggestion toggle and new syntax highlighting engine.
- 2.0.71 -> 2.0.72: Chrome integration, faster @ suggestions, Alt+T thinking toggle.
- 2.0.72 -> 2.0.73: Image links, yank-pop, plugin discover search, session IDs.
- 2.0.73 -> 2.0.74: LSP tool, terminal setup, /context improvements.
