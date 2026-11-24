<!-- Written by tools/impact-map.mjs from the "impact" rows of .harness.json: change the rows, then run it. -->

# Impact map

What must follow a change, and what must run again after it (docs/agents/change-impact.md). `npm run check:freshness` lists, on every PR, the rows a branch sets off and the order to run them.

**More detail:** [Code coverage](coverage.md)

| Id | When these change | Made of (content) | This must follow | Command | Runs again after | Checked by |
|---|---|---|---|---|---|---|
| vlm-worker-bundle | `src/workers/vlm-worker.ts` | `src/workers/vlm-worker.ts` | public/workers/vlm-worker.js | `npm run build:worker` |  | CI build |
| work-items | `docs/work/**`, `docs/agents/model-profiles.json`, `tools/work-items.mjs` | `docs/work/**`, `docs/agents/model-profiles.json`, `tools/work-items.mjs` | docs/BACKLOG.md | `node tools/work-items.mjs build && node tools/work-items.mjs check` |  | npm run check:work in CI |

## Content dependencies

What each output is made of, besides code: change one of these and the output is out of date.

| Output | Made of | Redo with |
|---|---|---|
| public/workers/vlm-worker.js | `src/workers/vlm-worker.ts` | `npm run build:worker` |
| docs/BACKLOG.md | `docs/work/**`, `docs/agents/model-profiles.json`, `tools/work-items.mjs` | `node tools/work-items.mjs build && node tools/work-items.mjs check` |

## Value couplings

A value that lives in more than one place: change it in one, change it in all. Best kept by one shared source, else by a test.

| Value | Where | Kept equal by |
|---|---|---|
| (none listed) | | |

## Outside the repository

What can change an output with no commit here, and how we would notice.

| What | Affects | Noticed by |
|---|---|---|
| (none listed) | | |
