# Area notes

## Pages & UI (`src/app/pages/`, `src/app/shared/UI/`)

- Follow [Angular rules](angular.md) (`OnPush`, standalone defaults, `inject()`, signals, native `@if`/`@for`, relative template/style paths).
- Run `npm run lint` and `npm test -- --watch=false` before pushing UI changes.

## Services (`src/app/services/`)

- `ModelService` and `runanywhere` coordinate local on-device LLM/VLM model loading and inference via WebAssembly/ONNX/WebGPU.
- Keep `serve` headers (`Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: credentialless` in `angular.json`) intact for SharedArrayBuffer/WASM worker support.

## VLM Worker (`src/workers/vlm-worker.ts`)

- `src/workers/vlm-worker.ts` compiles to `public/workers/vlm-worker.js` via `npm run build:worker`.
- Whenever `src/workers/vlm-worker.ts` changes, regenerate `public/workers/vlm-worker.js` in the same PR.
