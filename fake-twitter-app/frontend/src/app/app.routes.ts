import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./auth/signup/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'feed',
    loadComponent: () => import('./tweets/feed/feed.component').then(m => m.FeedComponent),
    canActivate: [authGuard]
  },
  {
    path: 'feed/:id/comments',
    loadComponent: () => import('./comments/comment-list/comment-list.component')
      .then(m => m.CommentListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./users/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile/:id',
    loadComponent: () => import('./users/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./users/user-management/user-management.component')
      .then(m => m.UserManagementComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'feed' }
];
