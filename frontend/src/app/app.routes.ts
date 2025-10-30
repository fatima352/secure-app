import { Routes } from '@angular/router';
import { Login } from './shared/auth/components/login/login';
import { Home } from './pages/home/home';
import { authGuard } from './shared/auth/auth-guard';
import { AdminComponent } from './admin/admin/admin';
import { adminGuard } from './admin/admin-guard';
import { Register } from './shared/auth/components/register/register';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
//   { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login, title: 'Login' },
  
  { path: 'home', component: Home, canActivate: [authGuard], title: 'Home' },
  
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
  
  { path: 'register', component: Register, title: 'Register' },
  
//   { path: '**', component: NotFound }

];
