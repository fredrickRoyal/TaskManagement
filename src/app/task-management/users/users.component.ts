import { HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AssignUserComponent } from '../tasks/assign-user/assign-user.component';
import { Task } from '../tasks/task.dto';
import { User } from './user.dto';
import { UsersService } from './users.service';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { Subscription } from 'rxjs';
import { ViewUserTasksComponent } from './view-user-tasks/view-user-tasks.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, AfterViewInit {


  public dialog: MatDialog = inject(MatDialog)
  toastr: ToastrService = inject(ToastrService)
  usersService: UsersService = inject(UsersService)


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

  addEdit(user: User | undefined) {
    const d = this.dialog.open(AddEditUserComponent, { disableClose: true, width: "40%", height: "50%", data: user });
    const _$: Subscription = d.afterClosed().subscribe({
      next: (result: boolean) => {
        if (result) {
          this.searchList(new HttpParams())
        }
      },
      complete: () => _$.unsubscribe()
    })
  }


  viewTasks(user: User) {
    this.dialog.open(ViewUserTasksComponent, { disableClose: true, width: "80%", height: "50%", data: user });
  }



}