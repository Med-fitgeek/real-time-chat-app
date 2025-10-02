import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ChatLayoutComponent } from './components/chat-layout-component/chat-layout-component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'chat', component: ChatLayoutComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' } // ← DERNIER
];

