import { startVLMWorkerRuntime } from '@runanywhere/web-llamacpp'

// This is a web worker file that runs in a separate thread
// startVLMWorkerRuntime() sets up the worker message handlers
startVLMWorkerRuntime()

// Empty export required for Vite's ?worker&url syntax
export {};
