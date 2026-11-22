import {
  RunAnywhere,
  SDKEnvironment,
  ModelManager,
  ModelCategory,
  LLMFramework,
  type CompactModelDef,
} from '@runanywhere/web';
import { LlamaCPP, VLMWorkerBridge, TextGeneration } from '@runanywhere/web-llamacpp';

import { SDKLogger, LogLevel } from '@runanywhere/web';

// Enable debug logging to see what's happening
SDKLogger.level = LogLevel.Debug;

// Define your model catalog
const MODELS: CompactModelDef[] = [
  {
    id: 'lfm2-vl-450m-q4_0',
    name: 'LFM2-VL 450M Q4_0',
    repo: 'runanywhere/LFM2-VL-450M-GGUF',
    files: ['LFM2-VL-450M-Q4_0.gguf', 'mmproj-LFM2-VL-450M-Q8_0.gguf'],
    framework: LLMFramework.LlamaCpp,
    modality: ModelCategory.Multimodal,
    memoryRequirement: 500_000_000,
  },
  {
    id: 'sherpa-onnx-whisper-tiny.en',
    name: 'Whisper Tiny English (ONNX)',
    url: 'https://huggingface.co/runanywhere/sherpa-onnx-whisper-tiny.en/resolve/main/sherpa-onnx-whisper-tiny.en.tar.gz',
    framework: LLMFramework.ONNX,
    modality: ModelCategory.SpeechRecognition,
    memoryRequirement: 105_000_000,
    artifactType: 'archive' as const,
  },
];

let _initPromise: Promise<void> | null = null;

export async function initSDK(): Promise<void> {
  if (_initPromise) return _initPromise;

  _initPromise = (async () => {
    // 1. Initialize core SDK
    await RunAnywhere.initialize({
      environment: SDKEnvironment.Development,
      debug: false,
    });

    // 2. Register the LlamaCpp backend with correct WASM path
    await LlamaCPP.register({
      wasmUrl: '/wasm/racommons-llamacpp.js',
      webgpuWasmUrl: '/wasm/racommons-llamacpp-webgpu.js',
    });

    // 3. Register model catalog
    RunAnywhere.registerModels(MODELS);

    // 4. Register model loaders with ModelManager
    // TextGeneration implements LLMModelLoader (has loadModelFromData)
    ModelManager.setLLMLoader(TextGeneration);

    // VLMWorkerBridge implements VLMLoader (has init, isInitialized, loadModel, unloadModel)
    // Use the pre-bundled worker from public/workers/ so all @runanywhere imports resolve correctly.
    VLMWorkerBridge.shared.workerUrl = new URL('/workers/vlm-worker.js', window.location.origin);
    ModelManager.setVLMLoader(VLMWorkerBridge.shared);

    console.log('[SDK] SDK initialization complete - LLM and VLM loaders registered');
  })();

  return _initPromise;
}

export { RunAnywhere, ModelManager, ModelCategory };
