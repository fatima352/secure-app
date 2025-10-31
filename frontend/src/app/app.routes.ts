import { Routes } from '@angular/router';
import { Login } from './shared/auth/components/login/login';
import { Home } from './pages/home/home';
import { authGuard } from './shared/auth/auth-guard';
import { AdminComponent } from './admin/admin/admin';
import { adminGuard } from './admin/admin-guard';
import { Register } from './shared/auth/components/register/register';
// import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'login', component: Login, title: 'Login' },
  
  { path: 'home', component: Home, title: 'Home' },
  
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard], title: "admin"},
  
  { path: 'register', component: Register, title: 'Register' },

];
