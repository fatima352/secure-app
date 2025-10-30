import { Routes } from '@angular/router';
import { Login } from './shared/auth/components/login/login';
import { Register } from './shared/auth/components/register/register';
import { Home } from './pages/home/home';
import { NotFound } from './pages/not-found/not-found';


export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'login',
        pathMatch: 'full' 
    }, 
    {
        path: 'home', 
        component: Home,
        title: 'Home'
    },
    {
        path: 'login',
        component: Login,
        title : 'Login'
    }, 
    // {
    //     path:'/register',
    //     component: Register,
    //     title : 'Register'
    // },
    // {
    //     path:'/logout',
    //     component: Logout
    // },

    { 
        path: '**', 
        component: NotFound
    }



];
