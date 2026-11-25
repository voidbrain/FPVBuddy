import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BatteriesFilters } from '../batteries-filters/batteries-filters';

@Component({
  selector: 'app-header',
  imports: [BatteriesFilters],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './header.html',
})
export class Header {}
