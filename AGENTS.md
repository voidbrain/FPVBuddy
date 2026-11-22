# FPVBuddy Agent Instructions

## Project conventions (FPVBuddy)

The project is **FPVBuddy**. The repository is `https://github.com/voidbrain/FPVBuddy`; the default branch is `main`. Angular project: `FPVBuddy` (Angular v21 with Tailwind CSS v4, Vitest unit tests, and `@runanywhere/web` local LLM/VLM worker inference).

### Architecture

- `src/app/pages/` holds routed page components; `src/app/shared/UI/` holds reusable presentation components; `src/app/services/` holds singleton Angular services (`ModelService`, `runanywhere`).
- `src/workers/vlm-worker.ts` is bundled into `public/workers/vlm-worker.js` via `npm run build:worker` whenever the worker changes.
- `eslint.config.mjs` and `npm run check:conventions` enforce TypeScript, Angular, and accessibility lint rules.

### Style guide

- Before any UI change (templates, styles, user-facing text) read [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md). Follow its voice, `@theme` tokens (`src/styles.css`), local fonts (`Space Grotesk`, `Inter`, `Material Symbols Outlined`), and spacing; never add CDN links or literal colours outside tokens.
- A new token or shared component updates [docs/STYLE-GUIDE.md](docs/STYLE-GUIDE.md) in the same change.

### Adding things

- **Page or UI component**: add under `src/app/pages/` or `src/app/shared/UI/` following [Angular rules](docs/agents/angular.md), register routes in `src/app/app.routes.ts` with lazy loading, and add Vitest tests (`*.spec.ts`).
- **VLM worker change**: edit `src/workers/vlm-worker.ts` and rebuild `public/workers/vlm-worker.js` with `npm run build:worker`.

### Documentation

- Keep top-level docs (`README.md`, `docs/STYLE-GUIDE.md`) concise (~150–200 lines max) and clearly structured as entry points.
- Keep docs current and free of backlog IDs or "not yet shipped / planned" lists; document shipped behavior and point to [docs/BACKLOG.md](docs/BACKLOG.md) where needed.

### Checks before you finish

Before you open, update or merge a PR, read [pull requests](docs/agents/pull-requests.md): PRs against `main`, when a green PR takes new work, conflicts, scoped verification and independent review.

<!-- safety:start -->
**What the agent does on its own, and what it asks first.** These rules load with this file in every session; the procedures below are read when they apply, never in place of these rules.
- On its own: branch from `main` in a separate `git worktree` (every task, single or parallel: the primary checkout stays on `main` with no edits of its own, because a running service, another session or the owner may rely on it; put worktrees in a sibling directory or under `.claude/worktrees/`; a project names what relies on its primary checkout with a project line), commit, push its branches, open PRs against `main` (then name the PR by its number in the records it touches, and push that before the checks finish), resolve conflicts on its own PRs, merge its own PR once every check on it has passed and GitHub can merge it (`node tools/merge-when-green.mjs <PR>…` waits for that and stops on any failing check or conflict), delete merged branches and their worktrees, reconcile and close backlog records.
- Asks first: material changes to an adopted upfront feature plan (BACKLOG-RULES, "Optional upfront feature plans"); a decision or check a record marks 🧑; repository settings (branch protection, required checks, secrets) and dismissing a code-scanning alert; rewriting published history or force-pushing; deleting what it did not create; a harness change it cannot place as project or template ("Changing a harness file").
- Never: merge with a failing or pending check, or bypass the branch protection. A project narrows this list with a project line.
- Optional push guard: `node tools/guard.mjs install` makes git refuse a push to `main`, a force-push and an archive rewrite, citing these rules (APPLY.md, "Push guard"; a Claude Code adapter does the same before the command runs). A refused operation the owner approves runs once with `HARNESS_GUARD_ALLOW=<rule>`; never set it without that approval.
- Never remove a safeguard (an ownership, evidence, privacy or safety rule) because it is old or rarely triggered, and never rewrite governing rules unattended: consolidating rules keeps every requirement ([rule review](docs/agents/rule-review.md), "Periodic rule consolidation").
<!-- safety:end -->

```bash
npm run check:freshness   # first, at session start: backlog behind main, merged branches, audit age
npm run lint              # ESLint + angular-eslint + template accessibility
npm test -- --watch=false # Vitest unit tests
npm run build             # Angular production build (dist/FPVBuddy)
npm run typecheck         # strict tsc check with noUnusedLocals / noUnusedParameters
npm run check:backlog     # active record layout and lifecycle cues
npm run check:conventions # stack conventions (docs/agents/angular.md) and unused exports
npm run format:check      # Prettier check on src/**/*.{ts,css,html}; `npm run format` fixes it
npm run check:tooling     # a formatter check and a linter exist and run in CI (required for every stack)
npm run code:map -- <path> # exports with line ranges: read those lines, not the whole file
```

- Every project formats and lints its source, in CI too: `check:tooling` fails without both.
- A failing test is evidence until shown otherwise: check it against the intended behaviour. Change its expectation only when the requirement deliberately changed, and say which requirement; otherwise fix the code.
- Do not leave dead code behind when replacing a feature: its state, helpers and tests go too.
- A bug fix starts with a committed test that fails without the fix; the fix never edits that test to pass (BACKLOG-RULES, "A bug fix starts with a failing test").

### Changing a harness file

Before editing a file listed in `.harness.json` (`copied`, `forked`, `adapted`, or `.harness.json` itself), decide whether the change holds for this project only or for every project. The edit is the trigger, whatever the request's words: an "allow X" that changes how work is done is a rule.
- **This project only**: its content or a setting stays here. A project line inside a section that comes from the template ends with `<!-- project -->`, so a reconcile keeps it; a changed harness rule is an override (APPLY.md, "Project overrides").
- **Every project**: the template first, then reconcile here (APPLY.md, "Changing the harness from a project").
- **Unsure**: ask the user before editing. Never decide silently.

`npm run check:freshness` lists the harness files a branch changes, locally and on every PR.

### Procedures: read before the task

All applicable rules must be known and followed from the start; shorter indexes never defer requirements. The [procedure discovery index](docs/agents/procedures.md) links authorities and expected evidence. Each procedure below is binding when its trigger applies: read it before starting that task. `npm run check:rules` fails when a never or ask-first rule lives only in a procedure.

| Before you | Read |
|---|---|
| start a session (`npm run check:freshness` lists what is due) | [session start](docs/agents/session-start.md) |
| open, update or merge a PR | [pull requests](docs/agents/pull-requests.md) |
| change Angular code (`src/app/`) | [Angular rules](docs/agents/angular.md) |
| switch independent tasks or compact/handoff context | [Task context](docs/agents/task-context.md) |
| work on claimed tasks, parallel branches or model assignments | [Parallel work](docs/agents/parallel-work.md) |
| claim, renew or release a task | [shared claims](docs/agents/claims.md) |
| reassess architecture, decisions or alternatives | [Architecture reassessment](docs/agents/architecture-review.md) |
| change tests, coverage settings or the coverage page | [coverage guide](docs/agents/coverage-guide.md) |
| change something another output is derived from (`src/workers/vlm-worker.ts`) | [change impact](docs/agents/change-impact.md) |
| add, configure or rely on an MCP connection | [MCP guidance](docs/agents/mcp.md) |
| add or use a shared skill | [skill guidance](docs/agents/skills.md) |
| adopt or reconcile the harness or review maintenance evidence | [maintenance guidance](docs/agents/maintenance.md) |
| measure friction, consolidate rules or run the periodic token review | [rule review](docs/agents/rule-review.md) |
| run an audit (`check:freshness` says when) | [audit procedure](docs/agents/audit.md) |
| record audit findings or improvement proposals | [audit findings](docs/agents/audit-findings.md) |
| update or close a backlog record | [backlog rules](docs/BACKLOG-RULES.md) |

## Area notes

Before changing an area, read its section in [docs/agents/areas.md](docs/agents/areas.md): the rules and lessons there are as binding as this file.

| Area | Covers |
|---|---|
| Pages & UI | `src/app/pages/`, `src/app/shared/UI/` |
| Services | `src/app/services/` (`ModelService`, `runanywhere`) |
| VLM Worker | `src/workers/vlm-worker.ts` and `public/workers/vlm-worker.js` |

## Privacy

- Never commit secrets, tokens or personal data. Test data is neutral and invented.

## Work tracking

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, as [session start](docs/agents/session-start.md) says for each finding.

- Keep a confirmed bug, a candidate fix awaiting review, an unimplemented feature and a completed check distinct. A merge is not verification, and a passing unit test is not a verified visual, pointer or device fix. A green CI run establishes the checks it named, not the absence of bugs.
- A change to a harness file follows "Changing a harness file" above: this project only, every project (the template first), or ask.
- A plan or promise given to the user becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.
