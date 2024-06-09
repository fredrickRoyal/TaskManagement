import { Component, OnInit, inject, signal } from '@angular/core';
import { User } from '../user.dto';
import { UsersService } from '../users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TaskStatus } from '../../tasks/task.dto';
import { switchMap, of } from 'rxjs';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit{
  public dialogRef: MatDialogRef<AddEditUserComponent> = inject(MatDialogRef)
  public data: User | null = inject(MAT_DIALOG_DATA)
  public dialog: MatDialog = inject(MatDialog)
  public fb: FormBuilder = inject(FormBuilder)
  toastr: ToastrService = inject(ToastrService)
  usersService: UsersService = inject(UsersService)
  loading = signal(false)
  
  public isEdit = signal(this.data != null)
  
  taskStatus:string[] = [TaskStatus.Pending , TaskStatus.InProgress , TaskStatus.Completed]
  
  formGroup: FormGroup = this.fb.group({
    firstname: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    email: ['', [Validators.required , Validators.email]],
  })
  
  control(key: string) {
    return this.formGroup.get(key) as FormControl
  }
  
  
  ngOnInit(): void {
    if (this.isEdit()) {
      this.formGroup.setValue({
        firstname: this.data?.firstname,
        lastname: this.data?.lastname,
        email: this.data?.email
      })
    } 
  
  }
  
  
  
  submit() {
    if (this.isEdit()) {
      const user: User = {...(this.data!) , firstname: this.control('firstname').value, lastname: this.control('lastname').value }
      this.edit(user)
    } else {
      const user: User = {email:this.control('email').value ,  firstname: this.control('firstname').value, lastname: this.control('lastname').value  }
      this.save(user)
    }
  }
  
  save(user: User) {
    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to create new  user` })
    confirm.afterClosed()
      .pipe(switchMap(result => {
        if (result) {
          return  this.usersService.createUser(user)
        } else {
          return of(null)
        }
      })).subscribe({
      next: response => {
        if (response) {
          this.loading.update(() => false)
          this.toastr.success('User created successfully')
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
  
  edit(user: User) {
    const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to edit this user` })
    confirm.afterClosed()
      .pipe(switchMap(result => {
        if (result) {
          return  this.usersService.updateUser(this.data?.id! ,  user)
        } else {
          return of(null)
        }
      })).subscribe({
      next: response => {
        if (response) {
          this.loading.update(() => false)
          this.toastr.success('User created successfully')
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
  }
  