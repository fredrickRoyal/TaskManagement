import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasksComponent } from './tasks/tasks.component';
import { AddEditTaskComponent } from './tasks/add-edit-task/add-edit-task.component';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { AssignUserComponent } from './tasks/assign-user/assign-user.component';
import { UsersComponent } from './users/users.component';
import { AddEditUserComponent } from './users/add-edit-user/add-edit-user.component';
import { ViewUserTasksComponent } from './users/view-user-tasks/view-user-tasks.component';
import { TaskManagementComponent } from './task-management.component';



@NgModule({
  declarations: [
    TasksComponent,
    AddEditTaskComponent,
    HeaderComponent,
    AssignUserComponent,
    UsersComponent,
    AddEditUserComponent,
    ViewUserTasksComponent,
    TaskManagementComponent
  ],
  imports: [
    CommonModule,
    TaskManagementRoutingModule,
    SharedModule
  ]
})
export class TaskManagementModule { }
