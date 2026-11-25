import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { ToolCalling, type ToolDefinition, getNumberArg } from '@runanywhere/web-llamacpp';
import { initSDK } from '../../../services/runanywhere';
import { ModelService } from '../../../services/model.service';

@Component({
  selector: 'app-llm-ui',
  imports: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './llm-ui.html',
})
export class LlmUi implements OnInit {
  private modelService = inject(ModelService);
  private readonly MODEL_ID = 'lfm2-vl-450m-q4_0';

  protected readonly inputText = signal('');
  protected readonly response = signal('');
  protected readonly isGenerating = signal(false);
  protected readonly isModelLoading = signal(true);

  private allowedKeywords = [
    'battery',
    'charge',
    'discharge',
    'store',
    'voltage',
    'cell',
    'pack',
    'series',
    'fpv',
  ];

  private isAllowed(input: string): boolean {
    return this.allowedKeywords.some((k) => input.toLowerCase().includes(k));
  }

  // Define available functions for the LLM
  private functions: ToolDefinition[] = [
    {
      name: 'chargeBattery',
      description: 'Charge an FPV battery',
      parameters: [
        {
          name: 'battery_id',
          type: 'number',
          description: 'The ID of the battery to charge',
          required: true,
        },
        {
          name: 'series',
          type: 'string',
          description: "Battery series (e.g., '4S', '6S')",
          required: false,
        },
      ],
    },
    {
      name: 'dischargeBattery',
      description: 'Discharge an FPV battery',
      parameters: [
        {
          name: 'battery_id',
          type: 'number',
          description: 'The ID of the battery to discharge',
          required: true,
        },
        {
          name: 'series',
          type: 'string',
          description: "Battery series (e.g., '4S', '6S')",
          required: false,
        },
      ],
    },
    {
      name: 'storeBattery',
      description: 'Store an FPV battery at storage voltage',
      parameters: [
        {
          name: 'battery_id',
          type: 'number',
          description: 'The ID of the battery to store',
          required: true,
        },
        {
          name: 'series',
          type: 'string',
          description: "Battery series (e.g., '4S', '6S')",
          required: false,
        },
      ],
    },
  ];

  private registerTools() {
    // Register each tool with its executor
    ToolCalling.registerTool(this.functions[0], async (args) => {
      console.log('Charging battery:', args);
      const batteryId = getNumberArg(args, 'battery_id');
      return {
        success: { type: 'boolean', value: true },
        message: { type: 'string', value: `Charging battery ${batteryId}` },
      };
    });

    ToolCalling.registerTool(this.functions[1], async (args) => {
      console.log('Discharging battery:', args);
      const batteryId = getNumberArg(args, 'battery_id');
      return {
        success: { type: 'boolean', value: true },
        message: { type: 'string', value: `Discharging battery ${batteryId}` },
      };
    });

    ToolCalling.registerTool(this.functions[2], async (args) => {
      console.log('Storing battery:', args);
      const batteryId = getNumberArg(args, 'battery_id');
      return {
        success: { type: 'boolean', value: true },
        message: { type: 'string', value: `Storing battery ${batteryId}` },
      };
    });
  }

  async ngOnInit() {
    try {
      await initSDK();
      this.registerTools();

      // Request model from centralized service
      await this.modelService.loadModel(this.MODEL_ID);
      console.log('[LLM] Model ready');
    } catch (err) {
      console.error('[LLM] Error initializing:', err);
    } finally {
      this.isModelLoading.set(false);
    }
  }

  async handleGenerate() {
    if (this.isGenerating()) return;

    this.isGenerating.set(true);
    this.response.set('');

    try {
      // Check if input is allowed
      if (!this.isAllowed(this.inputText())) {
        this.response.set('Sorry, I can only help with FPV battery-related questions.');
        return;
      }

      // Use tool calling to execute functions
      const result = await ToolCalling.generateWithTools(this.inputText(), {
        maxTokens: 200,
        temperature: 0.3,
      });

      // Check if any tools were called
      if (result.toolCalls && result.toolCalls.length > 0) {
        const toolCall = result.toolCalls[0];
        const argsStr = Object.entries(toolCall.arguments)
          .map(([key, val]) => {
            if (val.type === 'number') return `${key}: ${val.value}`;
            if (val.type === 'string') return `${key}: ${val.value}`;
            return `${key}: ${JSON.stringify(val)}`;
          })
          .join(', ');
        this.response.set(`Executing: ${toolCall.toolName}(${argsStr})`);
        console.log('Function called:', toolCall.toolName, toolCall.arguments, this.inputText());
      } else {
        // No function call, show the text response
        this.response.set(result.text);
      }
    } catch (error) {
      console.error('Error:', error);
      this.response.set('Sorry, an error occurred while processing your request.');
    } finally {
      this.isGenerating.set(false);
    }
  }
}
