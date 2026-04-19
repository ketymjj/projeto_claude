import { Routes } from '@angular/router';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';
import { ProjectFormComponent } from './components/projects/project-form/project-form.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';
import { TaskHistoryComponent } from './components/tasks/task-history/task-history.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/projects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'projects', component: ProjectListComponent, canActivate: [authGuard] },
  { path: 'projects/new', component: ProjectFormComponent, canActivate: [authGuard] },
  { path: 'projects/:id/edit', component: ProjectFormComponent, canActivate: [authGuard] },
  { path: 'tasks', component: TaskListComponent, canActivate: [authGuard] },
  { path: 'tasks/new', component: TaskFormComponent, canActivate: [authGuard] },
  { path: 'tasks/:id/edit', component: TaskFormComponent, canActivate: [authGuard] },
  { path: 'tasks/:id/history', component: TaskHistoryComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '/projects' }
];
