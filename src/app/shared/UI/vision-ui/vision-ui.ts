import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit, inject } from '@angular/core';
import { initSDK } from '../../../services/runanywhere';
import { ModelService } from '../../../services/model.service';
import { VLMWorkerBridge } from '@runanywhere/web-llamacpp';

const LIVE_INTERVAL_MS = 2500;
const LIVE_MAX_TOKENS = 30;
const SINGLE_MAX_TOKENS = 80;
const CAPTURE_DIM = 256; // CLIP resizes internally; larger is wasted work

interface VisionResult {
  text: string;
  totalMs: number;
}

@Component({
  selector: 'app-vision-ui',
  imports: [],
  templateUrl: './vision-ui.html',
})
export class VisionUi implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('videoMountRef', { static: false }) videoMountRef!: ElementRef<HTMLDivElement>;

  private modelService = inject(ModelService);
  private readonly MODEL_ID = 'lfm2-vl-450m-q4_0';

  protected cameraActive = signal(false);
  protected processing = signal(false);
  protected liveMode = signal(false);
  protected result = signal<VisionResult | null>(null);
  protected error = signal<string | null>(null);
  protected prompt = signal('Describe what you see briefly.');
  protected isModelLoading = signal(true);
  protected modelReady = signal(false);
  protected downloadProgress = signal<number | null>(null);
  protected modelStatus = signal<string>('Initializing...');

  private captureRef: any = null;
  private processingRef = false;
  private liveIntervalRef: ReturnType<typeof setInterval> | null = null;
  private liveModeRef = false;
  private stream: MediaStream | null = null;

  ngOnInit() {
    this.isModelLoading.set(true);
  }

  async ngAfterViewInit() {
    try {
      await initSDK();
      this.modelStatus.set('Loading model...');

      // Request model from centralized service
      await this.modelService.loadModel(this.MODEL_ID);

      this.modelReady.set(true);
      this.modelStatus.set('Ready');
      console.log('[VisionUI] Model ready');
    } catch (err) {
      console.error('[VisionUI] Error initializing:', err);
      this.error.set('Failed to initialize vision model');
    } finally {
      this.isModelLoading.set(false);
    }
  }

  ngOnDestroy() {
    this.cleanup();
  }

  private cleanup() {
    if (this.liveIntervalRef) {
      clearInterval(this.liveIntervalRef);
      this.liveIntervalRef = null;
    }

    if (this.captureRef) {
      if (this.captureRef.stop) {
        this.captureRef.stop();
      }
      if (this.captureRef.videoElement?.parentNode) {
        this.captureRef.videoElement.parentNode.removeChild(this.captureRef.videoElement);
      }
      this.captureRef = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
  }

  async startCamera() {
    if (this.captureRef?.isCapturing) return;

    this.error.set(null);

    try {
      // Try to get camera access - first try back camera, then fall back to any camera
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false
        });
      } catch (backCameraError) {
        this.stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      }

      // Create video element and attach stream
      const video = document.createElement('video');
      video.srcObject = this.stream;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.borderRadius = '12px';

      // Store reference for frame capture
      this.captureRef = {
        videoElement: video,
        isCapturing: true,
        captureFrame: (dim: number) => this.captureFrame(video, dim)
      };

      // Mount video element
      const mount = this.videoMountRef?.nativeElement;
      if (mount) {
        mount.innerHTML = '';
        mount.appendChild(video);
      }

      this.cameraActive.set(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);

      if (msg.includes('NotAllowed') || msg.includes('Permission')) {
        this.error.set(
          'Camera permission denied. On macOS, check System Settings → Privacy & Security → Camera and ensure your browser is allowed.',
        );
      } else if (msg.includes('NotFound') || msg.includes('DevicesNotFound')) {
        this.error.set('No camera found on this device.');
      } else if (msg.includes('NotReadable') || msg.includes('TrackStartError')) {
        this.error.set('Camera is in use by another application.');
      } else {
        this.error.set(`Camera error: ${msg}`);
      }
    }
  }

  private captureFrame(video: HTMLVideoElement, dim: number): { rgbPixels: Uint8Array; width: number; height: number } | null {
    if (!video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement('canvas');
    canvas.width = dim;
    canvas.height = dim;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, dim, dim);

    const imageData = ctx.getImageData(0, 0, dim, dim);
    return {
      rgbPixels: new Uint8Array(imageData.data.buffer),
      width: dim,
      height: dim
    };
  }

  async describeFrame(maxTokens: number) {
    if (this.processingRef) return;

    const cam = this.captureRef;
    if (!cam?.isCapturing) return;

    const frame = cam.captureFrame(CAPTURE_DIM);
    if (!frame) return;

    this.processing.set(true);
    this.processingRef = true;
    this.error.set(null);

    const t0 = performance.now();

    try {
      const result = await VLMWorkerBridge.shared.process(
        frame.rgbPixels,
        frame.width,
        frame.height,
        this.prompt(),
        { maxTokens }
      );
      this.result.set({ text: result.text, totalMs: performance.now() - t0 });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isWasmCrash = msg.includes('memory access out of bounds')
        || msg.includes('RuntimeError');

      if (isWasmCrash) {
        this.result.set({ text: 'Recovering from memory error... next frame will retry.', totalMs: 0 });
      } else {
        this.error.set(msg);
        if (this.liveModeRef) this.stopLive();
      }
    } finally {
      this.processing.set(false);
      this.processingRef = false;
    }
  }

  async describeSingle() {
    if (!this.captureRef?.isCapturing) {
      await this.startCamera();
      return;
    }
    await this.describeFrame(SINGLE_MAX_TOKENS);
  }

  async startLive() {
    if (!this.captureRef?.isCapturing) {
      await this.startCamera();
    }

    this.liveMode.set(true);
    this.liveModeRef = true;

    // Immediately describe first frame
    this.describeFrame(LIVE_MAX_TOKENS);

    // Then poll every 2.5s — skips ticks while inference is running
    this.liveIntervalRef = setInterval(() => {
      if (!this.processingRef && this.liveModeRef) {
        this.describeFrame(LIVE_MAX_TOKENS);
      }
    }, LIVE_INTERVAL_MS);
  }

  stopLive() {
    this.liveMode.set(false);
    this.liveModeRef = false;
    if (this.liveIntervalRef) {
      clearInterval(this.liveIntervalRef);
      this.liveIntervalRef = null;
    }
  }

  toggleLive() {
    if (this.liveMode()) {
      this.stopLive();
    } else {
      this.startLive();
    }
  }

  updatePrompt(event: Event) {
    const input = event.target as HTMLInputElement;
    this.prompt.set(input.value);
  }
}
