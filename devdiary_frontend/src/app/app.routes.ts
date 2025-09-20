import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'diary' },
      {
        path: 'diary',
        loadComponent: () => import('./features/diary/diary.component').then(m => m.DiaryComponent),
        title: 'DevDiary • Daily Log',
      },
      {
        path: 'summaries',
        loadComponent: () => import('./features/summaries/summaries.component').then(m => m.SummariesComponent),
        title: 'DevDiary • Summaries',
      },
      {
        path: 'integrations',
        loadComponent: () => import('./features/integrations/integrations.component').then(m => m.IntegrationsComponent),
        title: 'DevDiary • Integrations',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'DevDiary • Dashboard',
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
