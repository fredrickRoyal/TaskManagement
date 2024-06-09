import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, of, switchMap } from 'rxjs';
import { Task } from './task.dto';
import { TasksService } from './tasks.service';
import { AddEditTaskComponent } from './add-edit-task/add-edit-task.component';
import { AssignUserComponent } from './assign-user/assign-user.component';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit, AfterViewInit {

  activatedRoute: ActivatedRoute = inject(ActivatedRoute)
  public dialog: MatDialog = inject(MatDialog)
  toastr: ToastrService = inject(ToastrService)
  tasksService: TasksService = inject(TasksService)


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = signal(false)

  dataSource = new MatTableDataSource<Task>([]);
  tasks = signal<Task[]>([]);



  displayedColumns = ['position', 'name', 'status', 'description', 'createdAt', 'assignee', 'action'];


  ngOnInit(): void {
    this.searchList(new HttpParams())
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource = this.dataSource;
  }

  search(searchText: string) {
    this.dataSource.data = [... this.tasks()].filter(task => task.name.toLowerCase().includes(searchText.toLowerCase()))
  }


  searchList(params: HttpParams) {
    this.loading.update(() => true)
    this.tasksService.searchList(params).subscribe({
      next: (response) => {
        console.log(response)
        this.loading.update(() => false)
        this.tasks.set(response)
        this.dataSource.data = this.tasks()
      },
      error: (error: HttpErrorResponse) => {
        this.loading.update(() => false)
        this.toastr.warning(error.error.detail)
        // console.log(error.error)
      }
    })
  }


  addEdit(task: Task | undefined) {
    const d = this.dialog.open(AddEditTaskComponent, { disableClose: true, width: "40%", height: "50%", data: task });
    const _$: Subscription = d.afterClosed().subscribe({
      next: (result: boolean) => {
        if (result) {
          this.searchList(new HttpParams())
        }
      },
      complete: () => _$.unsubscribe()
    })
  }





  assignUser(task: Task) {
    const d = this.dialog.open(AssignUserComponent, { disableClose: true, width: "60%", height: "70%", data: task });
    const _$: Subscription = d.afterClosed().subscribe({
      next: (result: boolean) => {
        if (result) {
          this.searchList(new HttpParams())
        }
      },
      complete: () => _$.unsubscribe()
    })
  }

  removeUser(task: Task) {
    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to remove user from this task` })
    confirm.afterClosed()
      .pipe(switchMap(result => {
        if (result) {
          this.loading.update(() => true)
          task.updatedDateTime = new Date()
          task.user = null
          return this.tasksService.updateTask(task.id! , task)
        } else {
          return of(null)
        }
      })).subscribe({
        next: (response) => {
          if (response) {
            this.loading.update(() => false)
            this.dataSource.data = this.tasks()
            this.searchList(new HttpParams())
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading.update(() => false)
          this.toastr.warning(error.error.detail)
          // console.log(error.error)
        }
      })
  }


  deleteTask(task: Task) {
    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to delete this task` })
    confirm.afterClosed()
      .pipe(switchMap(result => {
        if (result) {
          this.loading.update(() => true)
          return this.tasksService.deleteTask(task?.id!)
        } else {
          return of(null)
        }
      })).subscribe({
        next: (response) => {
          if (response) {
            this.loading.update(() => false)
            this.dataSource.data = this.tasks()
            this.searchList(new HttpParams())
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading.update(() => false)
          this.toastr.warning(error.error.detail)
          // console.log(error.error)
        }
      })
  }


}
