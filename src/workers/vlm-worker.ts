/**
 * VLM Worker entry point.
 *
 * This file is imported via `new URL(..., import.meta.url)` so the Angular
 * bundler (Vite) resolves all transitive deps from the package barrel export
 * instead of using the raw npm workers/ file (which has unresolved relative imports).
 */
import { startVLMWorkerRuntime } from '@runanywhere/web-llamacpp'

startVLMWorkerRuntime()
