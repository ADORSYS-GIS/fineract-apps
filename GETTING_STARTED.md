# Getting Started with fineract-apps

This document describes the AI-assisted development setup generated for your project.

## Configured AI Platforms

The following AI coding platforms have been configured:

- **Claude Code** -- Configuration in `CLAUDE.md`
- **Cursor** -- Configuration in `.cursorrules`
- **GitHub Copilot** -- Configuration in `.github/copilot-instructions.md`
- **Windsurf** -- Configuration in `.windsurfrules`
- **codex-cli**
- **Antigravity** -- Configuration in `AGENTS.md`
- **Roo Code** -- Configuration in `.roo/rules/project-rules.md`
- **Kilo Code** -- Configuration in `.kilocode/rules/project-rules.md`

## MCP Servers

Model Context Protocol (MCP) servers extend your AI assistant with additional capabilities.

_No MCP servers were configured._

## Skills

Skills are reusable prompt templates that guide the AI through specific workflows.

The following skills are available:

- **pr-review** -- See `.claude/skills/pr-review/SKILL.md` for details
- **testing** -- See `.claude/skills/testing/SKILL.md` for details
- **documentation** -- See `.claude/skills/documentation/SKILL.md` for details
- **debugging** -- See `.claude/skills/debugging/SKILL.md` for details
- **security-audit** -- See `.claude/skills/security-audit/SKILL.md` for details
- **refactoring** -- See `.claude/skills/refactoring/SKILL.md` for details

## Knowledge Files

Knowledge files provide project-specific context to the AI assistant.
They are located in `docs/knowledge/`.

**Important:** These files contain placeholder content and should be updated
with your actual project details, architecture decisions, and domain knowledge.

## Verification

After setup, verify that everything is working:

1. **Check project rules exist:**
   ```bash
   ls CLAUDE.md .cursorrules .windsurfrules .github/copilot-instructions.md .codex/instructions.md 2>/dev/null
   ```

2. **Check skills are in place:**
   ```bash
   ls -la .claude/skills/
   ```

3. **Check MCP configuration:**
   ```bash
   cat .claude/settings.json
   ```

4. **Test with your AI assistant:**
   Open your configured AI coding tool and verify it picks up the project instructions.

