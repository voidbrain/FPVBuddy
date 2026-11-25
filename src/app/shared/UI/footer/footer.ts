import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActionsBar } from '../actions-bar/actions-bar';
import { Nav } from '../nav/nav';
import { LlmUi } from '../llm-ui/llm-ui';
import { VisionUi } from '../vision-ui/vision-ui';

@Component({
  selector: 'app-footer',
  imports: [ActionsBar, Nav, LlmUi, VisionUi],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './footer.html',
})
export class Footer {}
