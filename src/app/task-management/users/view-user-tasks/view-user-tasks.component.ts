import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { User } from '../user.dto';
import { Task, TaskStatus } from '../../tasks/task.dto';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AssignUserComponent } from '../../tasks/assign-user/assign-user.component';
import { TasksService } from '../../tasks/tasks.service';
import { MatSelectChange } from '@angular/material/select';
import { switchMap, of } from 'rxjs';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';

@Component({
  selector: 'app-view-user-tasks',
  templateUrl: './view-user-tasks.component.html',
  styleUrls: ['./view-user-tasks.component.scss']
})
export class ViewUserTasksComponent implements OnInit, AfterViewInit {

  public dialog: MatDialog = inject(MatDialog)
  toastr: ToastrService = inject(ToastrService)
  tasksService: TasksService = inject(TasksService)

  public dialogRef: MatDialogRef<AssignUserComponent> = inject(MatDialogRef)
  public data: User | null = inject(MAT_DIALOG_DATA)

  taskStatus: string[] = [TaskStatus.Pending, TaskStatus.InProgress, TaskStatus.Completed]


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = signal(false)

  dataSource = new MatTableDataSource<Task>([]);
  tasks = signal<Task[]>([])

  displayedColumns = ['position', 'name', 'status', 'description', 'createdAt', 'action'];


  ngOnInit(): void {
    this.searchList(new HttpParams().set("user", this.data?.id!))
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource = this.dataSource;
  }

  search(searchText: string) {
    this.dataSource.data = [... this.tasks()].filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()))
  }


  searchList(params: HttpParams) {
    this.loading.update(() => true)
    this.tasksService.searchList(params).subscribe({
      next: (response) => {
        this.loading.update(() => false)
        this.tasks.set(response)
        this.dataSource.data = this.tasks()

        console.log("user ", response)

      },
      error: (error: HttpErrorResponse) => {
        this.loading.update(() => false)
        this.toastr.warning(error.error.detail)
        // console.log(error.error)
      }
    })
  }

  removeUser(task: Task) {
    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to remove ${this.data?.email} from ${task.name}` })
    confirm.afterClosed()
      .pipe(switchMap(result => {
        if (result) {
          return this.tasksService.updateTask(task?.id!, task)
        } else {
          return of(null)
        }
      })).subscribe({
        next: (response) => {
          if (response) {
            this.loading.update(() => false)
            this.toastr.success(`${this.data?.email} successfully removed from ${task.name}`)
            this.dialogRef.close(true)
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading.update(() => false)
          this.toastr.warning(error.error.detail)
          // console.log(error.error)
        }
      })
  }


  selectedTaskStatus($event: MatSelectChange, task: Task) {
    const value = $event.value
    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to update task status` })
    confirm.afterClosed().subscribe(result => {
      if (result) {
        task.status = value
      } 
    })

  }



}