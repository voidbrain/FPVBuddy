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

### Checks before you finish

Before you open, update or merge a PR, read [pull requests](docs/agents/pull-requests.md).

<!-- safety:start -->
**What the agent does on its own, and what it asks first.** These rules load with this file in every session; the procedures below are read when they apply, never in place of these rules.
- On its own: branch from `main` in a separate `git worktree` (every task, single or parallel: the primary checkout stays on `main` with no edits of its own, because a running service, another session or the owner may rely on it; put worktrees in a sibling directory or under `.claude/worktrees/`; a project names what relies on its primary checkout with a project line), commit, push its branches, open PRs against `main` (then name the PR by its number in the records it touches, and push that before the checks finish), resolve conflicts on its own PRs, land its own PR through the landing queue once every check on it has passed and GitHub can merge it: one lander merges ready PRs one at a time, with at most two in CI ([parallel work](docs/agents/parallel-work.md), "Landing queue"; `node tools/merge-when-green.mjs <PR>…` waits for the checks and stops on any failing check or conflict), delete merged branches and their worktrees, reconcile and close backlog records.
- Asks first: material changes to an adopted upfront feature plan (BACKLOG-RULES, "Optional upfront feature plans"); a decision or check a record marks 🧑; repository settings (branch protection, required checks, secrets) and dismissing a code-scanning alert; rewriting published history or force-pushing; deleting what it did not create; a harness change it cannot place as project or template ("Changing a harness file").
- Never: merge with a failing or pending check, or bypass the branch protection. A project narrows this list with a project line.
- Optional push guard: `node tools/guard.mjs install` makes git refuse a push to `main`, a force-push and an archive rewrite, citing these rules (APPLY.md, "Push guard"; a Claude Code adapter does the same before the command runs). A refused operation the owner approves runs once with `HARNESS_GUARD_ALLOW=<rule>`; never set it without that approval.
- Never remove a safeguard (an ownership, evidence, privacy or safety rule) because it is old or rarely triggered, and never rewrite governing rules unattended: consolidating rules keeps every requirement ([rule review](docs/agents/rule-review.md), "Periodic rule consolidation").
<!-- safety:end -->

```bash
npm run check:freshness   # first, at session start: backlog behind main, merged branches, audit age
npm run check:fast        # single pre-push bundle: format, lint, typecheck, backlog, work, rules, tooling, maintenance <!-- project -->
npm run lint              # ESLint + angular-eslint + template accessibility <!-- project -->
npm test -- --watch=false # Vitest unit tests <!-- project -->
npm run build             # Angular production build (dist/FPVBuddy) <!-- project -->
npm run typecheck         # strict tsc check with noUnusedLocals / noUnusedParameters <!-- project -->
npm run check:backlog     # active record layout and lifecycle cues
npm run check:conventions # stack conventions (docs/agents/angular.md) and unused exports <!-- project -->
npm run format:check      # Prettier check on src/**/*.{ts,css,html}; `npm run format` fixes it <!-- project -->
npm run check:tooling     # a formatter check and a linter exist and run in CI (required for every stack)
npm run code:map -- <path> # exports with line ranges: read those lines, not the whole file
```

- Format and lint in CI too (`check:tooling`; a project with no source code records `tooling.exempt` with its reason).
- A failing test is evidence until shown otherwise: change its expectation only when the requirement deliberately changed, and say which; otherwise fix the code.
- A bug fix starts with a committed test that fails without the fix; the fix never edits that test to pass (BACKLOG-RULES, "A bug fix starts with a failing test").
- Replacing a feature removes its state, helpers and tests too: no dead code.

### Changing a harness file

Before editing a file listed in `.harness.json` (`copied`, `forked`, `adapted`, or `.harness.json` itself), decide: this project only, or every project. The edit is the trigger, whatever the request's words: an "allow X" that changes how work is done is a rule.
- **This project only**: content or a setting stays here; a project line in a template section ends with `<!-- project -->`; a changed harness rule is an override (APPLY.md, "Project overrides").
- **Every project**: the template first, then reconcile here (APPLY.md, "Changing the harness from a project").
- **Unsure**: ask the user before editing. Never decide silently. (`check:freshness` lists the harness files a branch changes.)

### Procedures: read before the task

Each procedure is binding when its trigger applies: read it before the task; a short index never defers a requirement. All of them: [procedure index](docs/agents/procedures.md). `npm run check:rules` fails when a never or ask-first rule lives only in a procedure.

| Before you | Read |
|---|---|
| start a session | [session start](docs/agents/session-start.md) |
| open, update or merge a PR | [pull requests](docs/agents/pull-requests.md) |
| change Angular code (`src/app/`) | [Angular rules](docs/agents/angular.md) <!-- project --> |
| update or close a backlog record | [backlog rules](docs/BACKLOG-RULES.md) (it names the one file a change needs) |
| write or change documentation | [documentation](docs/backlog/documentation.md) |
| change something an output is derived from (`src/workers/vlm-worker.ts`) | [change impact](docs/agents/change-impact.md); do each row `check:freshness` lists, or record why not <!-- project --> |
| change tests or coverage | [coverage guide](docs/agents/coverage-guide.md) |
| switch tasks or hand off context | [task context](docs/agents/task-context.md) |
| work in parallel: claimed tasks, branches, model assignments | [parallel work](docs/agents/parallel-work.md) (claims inside) |
| reassess architecture or decisions | [architecture review](docs/agents/architecture-review.md) |
| set up the project or change its stack or workflow (capability assessment) | [MCP guidance](docs/agents/mcp.md), "In short" |
| add, configure or rely on an MCP connection, or edit MCP selections | [MCP guidance](docs/agents/mcp.md) (commands inside) |
| work across repositories of a solution | [solution profile](docs/agents/solution-profile.md) (refresh inside) |
| add or use a shared skill | [skills](docs/agents/skills.md) |
| adopt or reconcile the harness, or review maintenance evidence | [maintenance](docs/agents/maintenance.md) |
| change AGENTS.md, CLAUDE.md, BACKLOG-RULES or `docs/backlog/`; measure friction; consolidate rules | [rule review](docs/agents/rule-review.md) (agent-behaviour checks when a runner is set) |
| run an audit, or record its findings or an improvement proposal | [audit](docs/agents/audit.md) ([findings](docs/agents/audit-findings.md)) |

### Testing the joins

- A change that touches how two parts meet gets a test across both, not one per side. Unit tests on each part did not catch the bugs that reached users.

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

**At the start of every session, before other work, run `npm run check:freshness`** and do what it lists, as [session start](docs/agents/session-start.md) says.

- Backlog records are source-owned: edit `docs/work/records/<ID>.md` and the step files `docs/work/tasks/<ID>-Tnn.json` (small steps with an estimate, one actor and `dependsOn`), then `npm run work:build` regenerates `docs/BACKLOG.md`; never edit the generated ledger by hand. A wait on another repository's step is written in the record text (`depends on <repo>:<STEP-ID>`). <!-- project -->
- This backlog owns only this repository's work: reject foreign next actions and closure conditions; a master never waits on what derives from it (BACKLOG-RULES, "One repository, one backlog").
- Keep a confirmed bug, a candidate fix, an unimplemented feature and a completed check distinct: a merge is not verification, a unit test is not a visual, pointer or device check, a green CI run proves only the checks it ran. Archives and audits are dated evidence, not current status.
- A plan or promise given to the user becomes backlog records in the same change, and the reply names them. Nothing promised lives only in the conversation.
