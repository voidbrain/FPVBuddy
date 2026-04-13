import { Injectable, signal } from '@angular/core';
import { ModelManager, ModelCategory, type CompactModelDef } from '@runanywhere/web';
import { TextGeneration } from '@runanywhere/web-llamacpp';

interface ModelState {
  id: string;
  status: 'idle' | 'downloading' | 'loaded' | 'error';
  progress: number;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class ModelService {
  private modelStates = signal<Map<string, ModelState>>(new Map());
  private downloadPromises = new Map<string, Promise<void>>();

  async getModel(modelId: string): Promise<CompactModelDef | null> {
    const models = ModelManager.getModels().filter(m => m.id === modelId);
    return models[0] || null;
  }

  async loadModel(modelId: string): Promise<void> {
    console.log('[ModelService] Loading model:', modelId);

    // Return existing download if in progress
    if (this.downloadPromises.has(modelId)) {
      console.log('[ModelService] Model already loading, waiting...');
      return this.downloadPromises.get(modelId)!;
    }

    // Set loading state
    this.updateModelState(modelId, 'downloading', 0);

    // Create download promise
    const downloadPromise = (async () => {
      try {
        const model = await this.getModel(modelId);
        if (!model) {
          throw new Error(`Model ${modelId} not found in catalog`);
        }

        // Check if already in OPFS
        const downloader = ModelManager.getDownloader();
        const existsInOPFS = await downloader.existsInOPFS(modelId);

        if (!existsInOPFS) {
          // Download model
          console.log('[ModelService] Downloading model from:', model.url || model.repo);
          await ModelManager.downloadModel(modelId);
          console.log('[ModelService] Model download completed');
        } else {
          console.log('[ModelService] Model already cached in OPFS');
        }

        // Load model via ModelManager
        console.log('[ModelService] Calling ModelManager.loadModel...', modelId);
        await ModelManager.loadModel(modelId);
        console.log('[ModelService] VLM model loaded (vision path)');

        // Also load into LLM path for ToolCalling (uses TextGeneration on main thread, separate from VLM worker)
        if (model.modality === ModelCategory.Multimodal) {
          console.log('[ModelService] Loading model into LLM path for tool calling...');
          const downloader = ModelManager.getDownloader();
          const data = await downloader.loadFromOPFS(modelId);
          if (data) {
            await TextGeneration.loadModelFromData({
              model,
              data: new Uint8Array(data),
            } as unknown as Parameters<typeof TextGeneration.loadModelFromData>[0]);
            console.log('[ModelService] LLM model loaded (tool calling path)');
          } else {
            console.warn('[ModelService] Could not load LLM model: data not found in OPFS');
          }
        }

        console.log('[ModelService] Model loaded successfully');

        this.updateModelState(modelId, 'loaded', 100);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('[ModelService] Failed to load model:', errorMsg);
        this.updateModelState(modelId, 'error', 0, errorMsg);
        throw error;
      } finally {
        this.downloadPromises.delete(modelId);
      }
    })();

    this.downloadPromises.set(modelId, downloadPromise);
    return downloadPromise;
  }

  isModelReady(modelId: string): boolean {
    const state = this.modelStates().get(modelId);
    return state?.status === 'loaded';
  }

  getModelState(modelId: string) {
    return this.modelStates().get(modelId);
  }

  private updateModelState(
    modelId: string,
    status: ModelState['status'],
    progress: number,
    error?: string
  ) {
    const newState = new Map(this.modelStates());
    newState.set(modelId, { id: modelId, status, progress, error });
    this.modelStates.set(newState);
    console.log('[ModelService] Model state updated:', { modelId, status, progress });
  }
}
