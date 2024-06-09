import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authenticationGuard, isLoggedInGuard } from './authentication/authentication.guard';

const routes: Routes = [
  { path: '' ,redirectTo:"auth" , pathMatch:"full"},
  { path: 'auth' , loadChildren:() => import('./authentication/authentication.module').then((m) => m.AuthenticationModule) , canActivate:[isLoggedInGuard]},
  { path: 'Task Management' , loadChildren:() => import('./task-management/task-management.module').then((m) => m.TaskManagementModule) , canActivate:[authenticationGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
