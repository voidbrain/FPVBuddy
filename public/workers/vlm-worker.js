// node_modules/@runanywhere/web-llamacpp/dist/Infrastructure/VLMWorkerRuntime.js
var wasmModule = null;
var vlmHandle = 0;
var isWebGPU = false;
var offsets = null;
function workerOffsetOf(m, name) {
  const fn = m[`_rac_wasm_offsetof_${name}`];
  return typeof fn === "function" ? fn() : 0;
}
function workerSizeOf(m, name) {
  const fn = m[`_rac_wasm_sizeof_${name}`];
  return typeof fn === "function" ? fn() : 0;
}
function loadOffsetsFromModule(m) {
  return {
    config: { logLevel: workerOffsetOf(m, "config_log_level") },
    llmOptions: {
      maxTokens: workerOffsetOf(m, "llm_options_max_tokens"),
      temperature: workerOffsetOf(m, "llm_options_temperature"),
      topP: workerOffsetOf(m, "llm_options_top_p"),
      systemPrompt: workerOffsetOf(m, "llm_options_system_prompt")
    },
    llmResult: {
      text: workerOffsetOf(m, "llm_result_text"),
      promptTokens: workerOffsetOf(m, "llm_result_prompt_tokens"),
      completionTokens: workerOffsetOf(m, "llm_result_completion_tokens")
    },
    vlmImage: {
      format: workerOffsetOf(m, "vlm_image_format"),
      filePath: workerOffsetOf(m, "vlm_image_file_path"),
      pixelData: workerOffsetOf(m, "vlm_image_pixel_data"),
      base64Data: workerOffsetOf(m, "vlm_image_base64_data"),
      width: workerOffsetOf(m, "vlm_image_width"),
      height: workerOffsetOf(m, "vlm_image_height"),
      dataSize: workerOffsetOf(m, "vlm_image_data_size")
    },
    vlmOptions: {
      maxTokens: workerOffsetOf(m, "vlm_options_max_tokens"),
      temperature: workerOffsetOf(m, "vlm_options_temperature"),
      topP: workerOffsetOf(m, "vlm_options_top_p"),
      streamingEnabled: workerOffsetOf(m, "vlm_options_streaming_enabled"),
      systemPrompt: workerOffsetOf(m, "vlm_options_system_prompt"),
      modelFamily: workerOffsetOf(m, "vlm_options_model_family")
    },
    vlmResult: {
      text: workerOffsetOf(m, "vlm_result_text"),
      promptTokens: workerOffsetOf(m, "vlm_result_prompt_tokens"),
      imageTokens: workerOffsetOf(m, "vlm_result_image_tokens"),
      completionTokens: workerOffsetOf(m, "vlm_result_completion_tokens"),
      totalTokens: workerOffsetOf(m, "vlm_result_total_tokens"),
      timeToFirstTokenMs: workerOffsetOf(m, "vlm_result_time_to_first_token_ms"),
      imageEncodeTimeMs: workerOffsetOf(m, "vlm_result_image_encode_time_ms"),
      totalTimeMs: workerOffsetOf(m, "vlm_result_total_time_ms"),
      tokensPerSecond: workerOffsetOf(m, "vlm_result_tokens_per_second")
    },
    structuredOutputConfig: {
      jsonSchema: workerOffsetOf(m, "structured_output_config_json_schema"),
      includeSchemaInPrompt: workerOffsetOf(m, "structured_output_config_include_schema_in_prompt")
    },
    structuredOutputValidation: {
      isValid: workerOffsetOf(m, "structured_output_validation_is_valid"),
      errorMessage: workerOffsetOf(m, "structured_output_validation_error_message"),
      extractedJson: workerOffsetOf(m, "structured_output_validation_extracted_json")
    },
    embeddingsOptions: {
      normalize: workerOffsetOf(m, "embeddings_options_normalize"),
      pooling: workerOffsetOf(m, "embeddings_options_pooling"),
      nThreads: workerOffsetOf(m, "embeddings_options_n_threads")
    },
    embeddingsResult: {
      embeddings: workerOffsetOf(m, "embeddings_result_embeddings"),
      numEmbeddings: workerOffsetOf(m, "embeddings_result_num_embeddings"),
      dimension: workerOffsetOf(m, "embeddings_result_dimension"),
      processingTimeMs: workerOffsetOf(m, "embeddings_result_processing_time_ms"),
      totalTokens: workerOffsetOf(m, "embeddings_result_total_tokens")
    },
    embeddingVector: {
      data: workerOffsetOf(m, "embedding_vector_data"),
      dimension: workerOffsetOf(m, "embedding_vector_dimension"),
      structSize: workerSizeOf(m, "embedding_vector")
    },
    diffusionOptions: {
      prompt: workerOffsetOf(m, "diffusion_options_prompt"),
      negativePrompt: workerOffsetOf(m, "diffusion_options_negative_prompt"),
      width: workerOffsetOf(m, "diffusion_options_width"),
      height: workerOffsetOf(m, "diffusion_options_height"),
      steps: workerOffsetOf(m, "diffusion_options_steps"),
      guidanceScale: workerOffsetOf(m, "diffusion_options_guidance_scale"),
      seed: workerOffsetOf(m, "diffusion_options_seed"),
      scheduler: workerOffsetOf(m, "diffusion_options_scheduler"),
      mode: workerOffsetOf(m, "diffusion_options_mode"),
      denoiseStrength: workerOffsetOf(m, "diffusion_options_denoise_strength"),
      reportIntermediate: workerOffsetOf(m, "diffusion_options_report_intermediate"),
      progressStride: workerOffsetOf(m, "diffusion_options_progress_stride")
    },
    diffusionResult: {
      imageData: workerOffsetOf(m, "diffusion_result_image_data"),
      imageSize: workerOffsetOf(m, "diffusion_result_image_size"),
      width: workerOffsetOf(m, "diffusion_result_width"),
      height: workerOffsetOf(m, "diffusion_result_height"),
      seedUsed: workerOffsetOf(m, "diffusion_result_seed_used"),
      generationTimeMs: workerOffsetOf(m, "diffusion_result_generation_time_ms"),
      safetyFlagged: workerOffsetOf(m, "diffusion_result_safety_flagged")
    }
  };
}
var LOG_PREFIX = "[RunAnywhere:VLMWorker]";
function logInfo(...args) {
  console.info(LOG_PREFIX, ...args);
}
function logWarn(...args) {
  console.warn(LOG_PREFIX, ...args);
}
function logError(...args) {
  console.error(LOG_PREFIX, ...args);
}
function allocString(str) {
  const m = wasmModule;
  const len = m.lengthBytesUTF8(str) + 1;
  const ptr = m._malloc(len);
  m.stringToUTF8(str, ptr, len);
  return ptr;
}
function readString(ptr) {
  if (!ptr)
    return "";
  return wasmModule.UTF8ToString(ptr);
}
function writeToWasmHeap(src, destPtr) {
  const m = wasmModule;
  if (m.HEAPU8) {
    m.HEAPU8.set(src, destPtr);
    return;
  }
  for (let i = 0; i < src.length; i++) {
    m.setValue(destPtr + i, src[i], "i8");
  }
}
var OPFS_MODELS_DIR = "models";
async function loadFromOPFS(key) {
  try {
    const root = await navigator.storage.getDirectory();
    const modelsDir = await root.getDirectoryHandle(OPFS_MODELS_DIR);
    let file;
    if (key.includes("/")) {
      const parts = key.split("/");
      let dir = modelsDir;
      for (let i = 0; i < parts.length - 1; i++) {
        dir = await dir.getDirectoryHandle(parts[i]);
      }
      const handle = await dir.getFileHandle(parts[parts.length - 1]);
      file = await handle.getFile();
    } else {
      const handle = await modelsDir.getFileHandle(key);
      file = await handle.getFile();
    }
    const buffer = await file.arrayBuffer();
    return new Uint8Array(buffer);
  } catch {
    return null;
  }
}
async function initWASM(wasmJsUrl, useWebGPU = false) {
  isWebGPU = useWebGPU;
  logInfo(`Loading WASM module (${useWebGPU ? "WebGPU" : "CPU"})...`);
  const { default: createModule } = await import(
    /* @vite-ignore */
    wasmJsUrl
  );
  const wasmBaseUrl = wasmJsUrl.substring(0, wasmJsUrl.lastIndexOf("/") + 1);
  wasmModule = await createModule({
    print: (text) => logInfo(text),
    printErr: (text) => logError(text),
    locateFile: (path) => wasmBaseUrl + path
  });
  const m = wasmModule;
  const adapterSize = m._rac_wasm_sizeof_platform_adapter();
  const adapterPtr = m._malloc(adapterSize);
  for (let i = 0; i < adapterSize; i++)
    m.setValue(adapterPtr + i, 0, "i8");
  const PTR_SIZE = 4;
  let offset = 0;
  const fileExistsCb = m.addFunction((_pathPtr, _ud) => {
    return 0;
  }, "iii");
  m.setValue(adapterPtr + offset, fileExistsCb, "*");
  offset += PTR_SIZE;
  const noopReadCb = m.addFunction((_pathPtr, _outData, _outSize, _ud) => -180, "iiiii");
  m.setValue(adapterPtr + offset, noopReadCb, "*");
  offset += PTR_SIZE;
  const noopWriteCb = m.addFunction((_pathPtr, _data, _size, _ud) => -180, "iiiii");
  m.setValue(adapterPtr + offset, noopWriteCb, "*");
  offset += PTR_SIZE;
  const noopDelCb = m.addFunction((_pathPtr, _ud) => -180, "iii");
  m.setValue(adapterPtr + offset, noopDelCb, "*");
  offset += PTR_SIZE;
  const secureGetCb = m.addFunction((_kp, outPtr, _ud) => {
    m.setValue(outPtr, 0, "*");
    return -182;
  }, "iiii");
  m.setValue(adapterPtr + offset, secureGetCb, "*");
  offset += PTR_SIZE;
  const secureSetCb = m.addFunction((_keyPtr, _valPtr, _ud) => 0, "iiii");
  m.setValue(adapterPtr + offset, secureSetCb, "*");
  offset += PTR_SIZE;
  const secureDelCb = m.addFunction((_keyPtr, _ud) => 0, "iii");
  m.setValue(adapterPtr + offset, secureDelCb, "*");
  offset += PTR_SIZE;
  const logCb = m.addFunction((level, catPtr, msgPtr, _ud) => {
    const cat = m.UTF8ToString(catPtr);
    const msg = m.UTF8ToString(msgPtr);
    const prefix = `[RunAnywhere:VLMWorker:${cat}]`;
    if (level <= 1)
      console.debug(prefix, msg);
    else if (level === 2)
      console.info(prefix, msg);
    else if (level === 3)
      console.warn(prefix, msg);
    else
      console.error(prefix, msg);
  }, "viiii");
  m.setValue(adapterPtr + offset, logCb, "*");
  offset += PTR_SIZE;
  m.setValue(adapterPtr + offset, 0, "*");
  offset += PTR_SIZE;
  const nowMsCb = m.addFunction((_ud) => Date.now(), "ii");
  m.setValue(adapterPtr + offset, nowMsCb, "*");
  offset += PTR_SIZE;
  const memInfoCb = m.addFunction((outPtr, _ud) => {
    const totalMB = navigator.deviceMemory ?? 4;
    const totalBytes = totalMB * 1024 * 1024 * 1024;
    m.setValue(outPtr, totalBytes & 4294967295, "i32");
    m.setValue(outPtr + 4, 0, "i32");
    m.setValue(outPtr + 8, totalBytes & 4294967295, "i32");
    m.setValue(outPtr + 12, 0, "i32");
    m.setValue(outPtr + 16, 0, "i32");
    m.setValue(outPtr + 20, 0, "i32");
    return 0;
  }, "iii");
  m.setValue(adapterPtr + offset, memInfoCb, "*");
  offset += PTR_SIZE;
  m.setValue(adapterPtr + offset, 0, "*");
  offset += PTR_SIZE;
  m.setValue(adapterPtr + offset, 0, "*");
  offset += PTR_SIZE;
  m.setValue(adapterPtr + offset, 0, "*");
  offset += PTR_SIZE;
  m.setValue(adapterPtr + offset, 0, "*");
  logInfo("Step 1: Registering platform adapter...");
  if (typeof m._rac_set_platform_adapter === "function") {
    const adapterResult = m._rac_set_platform_adapter(adapterPtr);
    if (adapterResult !== 0) {
      logWarn(`rac_set_platform_adapter returned ${adapterResult}`);
    }
  }
  logInfo("Step 1 done: Platform adapter registered");
  logInfo("Step 2: Calling rac_init...");
  const configSize = m._rac_wasm_sizeof_config();
  const configPtr = m._malloc(configSize);
  for (let i = 0; i < configSize; i++)
    m.setValue(configPtr + i, 0, "i8");
  m.setValue(configPtr, adapterPtr, "*");
  const logLevelOffset = typeof m._rac_wasm_offsetof_config_log_level === "function" ? m._rac_wasm_offsetof_config_log_level() : 4;
  m.setValue(configPtr + logLevelOffset, 2, "i32");
  try {
    const initResult = await m.ccall("rac_init", "number", ["number"], [configPtr], { async: true });
    if (initResult !== 0) {
      logWarn(`rac_init returned non-zero (${initResult}), continuing without full core init`);
    } else {
      logInfo("Step 2 done: rac_init succeeded");
    }
  } catch (e) {
    logWarn(`rac_init failed in Worker (${e}), continuing \u2014 VLM does not require full core init`);
  }
  m._free(configPtr);
  logInfo("Step 3: Loading struct offsets...");
  offsets = loadOffsetsFromModule(m);
  logInfo("Step 3 done: Offsets loaded");
  logInfo("Step 4: Registering VLM backend...");
  if (typeof m["_rac_backend_llamacpp_vlm_register"] !== "function") {
    throw new Error("VLM backend not available in WASM build. Rebuild with: ./scripts/build.sh --webgpu --vlm");
  }
  const regResult = await m.ccall("rac_backend_llamacpp_vlm_register", "number", [], [], { async: true });
  logInfo(`Step 4 done: VLM backend registered (result: ${regResult})`);
  logInfo("Step 5: Creating VLM component...");
  const handlePtr = m._malloc(4);
  const createResult = await m.ccall("rac_vlm_component_create", "number", ["number"], [handlePtr], { async: true });
  if (createResult !== 0) {
    m._free(handlePtr);
    throw new Error(`rac_vlm_component_create failed: ${createResult}`);
  }
  vlmHandle = m.getValue(handlePtr, "i32");
  m._free(handlePtr);
  logInfo(`WASM initialized, VLM component ready (${isWebGPU ? "WebGPU" : "CPU"})`);
}
async function loadModel(modelOpfsKey, modelFilename, mmprojOpfsKey, mmprojFilename, modelId, modelName, providedModelData, providedMmprojData) {
  const m = wasmModule;
  m.FS_createPath("/", "models", true, true);
  self.postMessage({ id: -1, type: "progress", payload: { stage: "Reading model from storage..." } });
  let modelData;
  if (providedModelData && providedModelData.byteLength > 0) {
    logInfo(`Using transferred model data: ${(providedModelData.byteLength / 1024 / 1024).toFixed(1)} MB`);
    modelData = new Uint8Array(providedModelData);
  } else {
    logInfo(`Reading model from OPFS: key=${modelOpfsKey}`);
    const opfsData = await loadFromOPFS(modelOpfsKey);
    if (!opfsData)
      throw new Error(`Model not found in OPFS: ${modelOpfsKey}`);
    modelData = opfsData;
  }
  logInfo(`Model data: ${(modelData.length / 1024 / 1024).toFixed(1)} MB`);
  self.postMessage({ id: -1, type: "progress", payload: { stage: "Preparing model..." } });
  const modelPath = `/models/${modelFilename}`;
  try {
    m.FS_unlink(modelPath);
  } catch {
  }
  logInfo(`Writing model to WASM FS: ${modelPath}`);
  m.FS_createDataFile("/models", modelFilename, modelData, true, true, true);
  logInfo("Model written to WASM FS");
  self.postMessage({ id: -1, type: "progress", payload: { stage: "Reading vision encoder..." } });
  let mmprojData;
  if (providedMmprojData && providedMmprojData.byteLength > 0) {
    logInfo(`Using transferred mmproj data: ${(providedMmprojData.byteLength / 1024 / 1024).toFixed(1)} MB`);
    mmprojData = new Uint8Array(providedMmprojData);
  } else {
    logInfo(`Reading mmproj from OPFS: key=${mmprojOpfsKey}`);
    const opfsMmproj = await loadFromOPFS(mmprojOpfsKey);
    if (!opfsMmproj)
      throw new Error(`mmproj not found in OPFS: ${mmprojOpfsKey}`);
    mmprojData = opfsMmproj;
  }
  logInfo(`mmproj data: ${(mmprojData.length / 1024 / 1024).toFixed(1)} MB`);
  const mmprojPath = `/models/${mmprojFilename}`;
  try {
    m.FS_unlink(mmprojPath);
  } catch {
  }
  logInfo(`Writing mmproj to WASM FS: ${mmprojPath}`);
  m.FS_createDataFile("/models", mmprojFilename, mmprojData, true, true, true);
  logInfo("mmproj written to WASM FS");
  self.postMessage({ id: -1, type: "progress", payload: { stage: "Loading model..." } });
  const pathPtr = allocString(modelPath);
  const projPtr = allocString(mmprojPath);
  const idPtr = allocString(modelId);
  const namePtr = allocString(modelName);
  try {
    const result = await m.ccall("rac_vlm_component_load_model", "number", ["number", "number", "number", "number", "number"], [vlmHandle, pathPtr, projPtr, idPtr, namePtr], { async: true });
    if (result !== 0) {
      throw new Error(`rac_vlm_component_load_model failed: ${result}`);
    }
    logInfo(`Model loaded: ${modelId}`);
  } finally {
    m._free(pathPtr);
    m._free(projPtr);
    m._free(idPtr);
    m._free(namePtr);
  }
}
async function processImage(rgbPixels, width, height, prompt, maxTokens, temperature, topP, systemPrompt, modelFamily) {
  const m = wasmModule;
  const pixelArray = new Uint8Array(rgbPixels);
  const imageSize = m.ccall("rac_wasm_sizeof_vlm_image", "number", [], []);
  const optSize = m.ccall("rac_wasm_sizeof_vlm_options", "number", [], []);
  const resSize = m.ccall("rac_wasm_sizeof_vlm_result", "number", [], []);
  const imagePtr = m._malloc(imageSize);
  for (let i = 0; i < imageSize; i++)
    m.setValue(imagePtr + i, 0, "i8");
  const vi = offsets.vlmImage;
  m.setValue(imagePtr + vi.format, 1, "i32");
  const pixelPtr = m._malloc(pixelArray.length);
  writeToWasmHeap(pixelArray, pixelPtr);
  m.setValue(imagePtr + vi.pixelData, pixelPtr, "*");
  m.setValue(imagePtr + vi.width, width, "i32");
  m.setValue(imagePtr + vi.height, height, "i32");
  m.setValue(imagePtr + vi.dataSize, pixelArray.length, "i32");
  const optPtr = m._malloc(optSize);
  for (let i = 0; i < optSize; i++)
    m.setValue(optPtr + i, 0, "i8");
  const vo = offsets.vlmOptions;
  m.setValue(optPtr + vo.maxTokens, maxTokens, "i32");
  m.setValue(optPtr + vo.temperature, Number.isFinite(temperature) ? temperature : 0.7, "float");
  m.setValue(optPtr + vo.topP, Number.isFinite(topP) ? topP : 0.9, "float");
  let systemPromptPtr = 0;
  if (systemPrompt) {
    systemPromptPtr = allocString(systemPrompt);
    m.setValue(optPtr + vo.systemPrompt, systemPromptPtr, "*");
  }
  m.setValue(optPtr + vo.modelFamily, modelFamily ?? 0, "i32");
  const promptPtr = allocString(prompt);
  const resPtr = m._malloc(resSize);
  for (let i = 0; i < resSize; i++)
    m.setValue(resPtr + i, 0, "i8");
  try {
    const r = await m.ccall("rac_vlm_component_process", "number", ["number", "number", "number", "number", "number"], [vlmHandle, imagePtr, promptPtr, optPtr, resPtr], { async: true });
    if (r !== 0) {
      throw new Error(`rac_vlm_component_process failed: ${r}`);
    }
    const vr = offsets.vlmResult;
    const textPtr = m.getValue(resPtr + vr.text, "*");
    const result = {
      text: readString(textPtr),
      promptTokens: m.getValue(resPtr + vr.promptTokens, "i32"),
      imageTokens: m.getValue(resPtr + vr.imageTokens, "i32"),
      completionTokens: m.getValue(resPtr + vr.completionTokens, "i32"),
      totalTokens: m.getValue(resPtr + vr.totalTokens, "i32")
    };
    m.ccall("rac_vlm_result_free", null, ["number"], [resPtr]);
    return result;
  } finally {
    if (systemPromptPtr)
      m._free(systemPromptPtr);
    m._free(promptPtr);
    m._free(imagePtr);
    m._free(optPtr);
    m._free(pixelPtr);
    m._free(resPtr);
  }
}
function handleMessage(e) {
  const { type, id } = e.data;
  const respond = async () => {
    switch (type) {
      case "init": {
        await initWASM(e.data.payload.wasmJsUrl, e.data.payload.useWebGPU ?? false);
        self.postMessage({ id, type: "result", payload: { success: true, useWebGPU: isWebGPU } });
        break;
      }
      case "load-model": {
        const p = e.data.payload;
        await loadModel(p.modelOpfsKey, p.modelFilename, p.mmprojOpfsKey, p.mmprojFilename, p.modelId, p.modelName, p.modelData, p.mmprojData);
        self.postMessage({ id, type: "result", payload: { success: true } });
        break;
      }
      case "process": {
        const p = e.data.payload;
        const result = await processImage(p.rgbPixels, p.width, p.height, p.prompt, p.maxTokens, p.temperature, p.topP, p.systemPrompt, p.modelFamily);
        self.postMessage({ id, type: "result", payload: result });
        break;
      }
      case "cancel": {
        if (wasmModule && vlmHandle) {
          wasmModule.ccall("rac_vlm_component_cancel", "number", ["number"], [vlmHandle]);
        }
        self.postMessage({ id, type: "result", payload: { success: true } });
        break;
      }
      case "unload": {
        if (wasmModule && vlmHandle) {
          wasmModule.ccall("rac_vlm_component_unload", "number", ["number"], [vlmHandle]);
        }
        self.postMessage({ id, type: "result", payload: { success: true } });
        break;
      }
    }
  };
  respond().catch((err) => {
    const message = err instanceof Error ? err.message : String(err);
    logError(`Error in ${type}:`, message);
    self.postMessage({ id, type: "error", payload: { message } });
  });
}
function startVLMWorkerRuntime() {
  logInfo("VLM Worker runtime starting...");
  self.onmessage = handleMessage;
}

// src/workers/vlm-worker.ts
startVLMWorkerRuntime();
