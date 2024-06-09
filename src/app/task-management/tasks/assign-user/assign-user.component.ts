import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { User } from '../../users/user.dto';
import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { TasksService } from '../tasks.service';
import { Task } from '../task.dto';
import { UsersService } from '../../users/users.service';
import { switchMap, of } from 'rxjs';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.scss']
})
export class AssignUserComponent implements OnInit, AfterViewInit {
  public dialog: MatDialog = inject(MatDialog)
  toastr: ToastrService = inject(ToastrService)
  tasksService: TasksService = inject(TasksService)
  usersService: UsersService = inject(UsersService)

  public dialogRef: MatDialogRef<AssignUserComponent> = inject(MatDialogRef)
  public data: Task | null = inject(MAT_DIALOG_DATA)


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = signal(false)

  dataSource = new MatTableDataSource<User>([]);
  users = signal<User[]>([])

  displayedColumns = ['position', 'firstname', 'lastname', 'email', 'action'];


  ngOnInit(): void {
    this.searchList(new HttpParams())
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource = this.dataSource;
  }

  search(searchText: string) {
    this.dataSource.data = [... this.users()].filter(user => user.email.toLowerCase().includes(searchText.toLowerCase()))
  }


  searchList(params: HttpParams) {
    this.loading.update(() => true)
    this.usersService.searchList(params).subscribe({
      next: (response) => {
        this.loading.update(() => false)
        this.users.set(response)
        this.dataSource.data = this.users()
      },
      error: (error: HttpErrorResponse) => {
        this.loading.update(() => false)
        this.toastr.warning(error.error.detail)
        // console.log(error.error)
      }
    })
  }



  assignUser(user: User) {

    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to assign ${user.firstname} to ${this.data?.name}` })
    confirm.afterClosed()
      .pipe(switchMap(result => {
        if (result) {
          const task = this.data as Task
          task.user = user
          return this.tasksService.updateTask(task?.id!, task)
        } else {
          return of(null)
        }
      })).subscribe({
        next: (_response) => {
          this.loading.update(() => false)
          this.dialogRef.close(true)
        },
        error: (error: HttpErrorResponse) => {
          this.loading.update(() => false)
          this.toastr.warning(error.error.detail)
          // console.log(error.error)
        }
      })
  }



}