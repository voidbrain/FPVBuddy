import { Routes } from '@angular/router';
import { Batteries } from './pages/batteries/batteries';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/batteries',
    pathMatch: 'full',
  },
  {
    path: 'batteries',
    component: Batteries,
  },
];
