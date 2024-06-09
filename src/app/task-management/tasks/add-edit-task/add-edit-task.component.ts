import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { switchMap, of } from 'rxjs';
import { Task, TaskStatus } from '../task.dto';
import { TasksService } from '../tasks.service';
import { ConfirmComponent } from 'src/app/shared/dialog/confirm/confirm.component';

@Component({
  selector: 'app-add-edit-task',
  templateUrl: './add-edit-task.component.html',
  styleUrls: ['./add-edit-task.component.scss']
})
export class AddEditTaskComponent implements OnInit{
public dialogRef: MatDialogRef<AddEditTaskComponent> = inject(MatDialogRef)
public data: Task | null = inject(MAT_DIALOG_DATA)
public dialog: MatDialog = inject(MatDialog)
public fb: FormBuilder = inject(FormBuilder)
toastr: ToastrService = inject(ToastrService)
tasksService: TasksService = inject(TasksService)
loading = signal(false)

public isEdit = signal(this.data != null)

taskStatus:string[] = [TaskStatus.Pending , TaskStatus.InProgress , TaskStatus.Completed]

formGroup: FormGroup = this.fb.group({
  name: ['', [Validators.required]],
  status: [TaskStatus.Pending, [Validators.required]],
  description: [''],
})

control(key: string) {
  return this.formGroup.get(key) as FormControl
}


ngOnInit(): void {
  if (this.isEdit()) {
    this.formGroup.setValue({
      name: this.data?.name,
      status: this.data?.status,
      description: this.data?.description
    })
  } 

}



submit() {
  if (this.isEdit()) {
    const task: Task = {...(this.data!) , name: this.control('name').value, status: this.control('status').value, description: this.control('description').value }
    this.edit(task)
  } else {
    const task: Task = { name: this.control("name").value, status: this.control('status').value, description: this.control('description').value , createdDateTime:new Date() , updatedDateTime:new Date() , user:null }
    this.save(task)
  }
}

save(task: Task) {

  const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to create this task` })
  confirm.afterClosed()
    .pipe(switchMap(result => {
      if (result) {
        return this.tasksService.createTask(task)
      } else {
        return of(null)
      }
    })).subscribe({
    next: response => {
      if (response) {
        console.log(response);
        this.loading.update(() => false)
        this.toastr.success('Task created successfully')
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

edit(task: Task) {
  const confirm = this.dialog.open(ConfirmComponent, { disableClose: true, data: `Are you sure you want to edit this task` })
  confirm.afterClosed()
    .pipe(switchMap(result => {
      if (result) {
        task.updatedDateTime = new Date()
        return  this.tasksService.updateTask(this.data?.id! ,  task)
      } else {
        return of(null)
      }
    })).subscribe({
    next: response => {
      if (response) {
        this.loading.update(() => false)
        this.toastr.success('Task created successfully')
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
