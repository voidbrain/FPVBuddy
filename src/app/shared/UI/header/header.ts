import { Component } from '@angular/core';
import { BatteriesFilters } from '../batteries-filters/batteries-filters';

@Component({
  selector: 'app-header',
  imports: [
    BatteriesFilters
  ],
  templateUrl: './header.html',
})
export class Header  {
}
