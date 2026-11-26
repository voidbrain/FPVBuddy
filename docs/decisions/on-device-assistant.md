# Decision: the on-device assistant and vision demo (F-023)

Asked of the owner on 2026-11-26. Nothing is changed until you answer; reply in chat with A, B or C.

## What exists on `main`

- **Footer assistant** (`src/app/shared/UI/llm-ui/llm-ui.ts`): a small 450M model (`lfm2-vl-450m-q4_0`) running in the browser. It can "call" `chargeBattery`, `dischargeBattery` and `storeBattery`, but the handlers only write a log line; no battery changes. It answers only when the text contains an English keyword (battery, charge, cell, fpv …), so an Italian phrase such as "carica la batteria" is not let through.
- **Vision demo** (`src/app/shared/UI/vision-ui/vision-ui.ts`, `src/workers/vlm-worker.ts`): the same model describes a camera frame.
- Neither has a backlog record or a Gauntlet case; the real battery work goes through FPVBuddy's MCP server and NERV.

## Options

| | What happens | Cost | Choose it if |
|---|---|---|---|
| **A. Retire both** | The assistant, the demo, their services and the worker are removed with their tests. FPVBuddy keeps what NERV calls over MCP. | 0.5 h agent | You do not want a second, weaker assistant inside the app. |
| **B. Make the assistant real** | A new record gives it working handlers, Italian and English phrasing, and Gauntlet cases for the small model (tool-use-v1 and fpvbuddy-v1 through Ollama). The vision demo is retired or recorded as skipped. | New record, estimated when opened | You want to command batteries by typing in the app without NERV. |
| **C. Keep both as experiments** | Nothing changes except a recorded skip with its reason (not user-facing, small model, handlers only log). | 0.25 h agent | You want to keep playing with them and decide later. |

All three state the Italian behaviour: the owner uses NERV and all modules in Italian (2026-11-26).

## Copy and paste

Reply in the chat that runs this repository's work: `F-023: A` (or `B`, or `C`). Expected: the agent records your answer with its date in F-023 and does the step F-023-T02.
