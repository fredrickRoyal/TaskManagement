import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from '../authentication.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/task-management/users/user.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {

  fb: FormBuilder = inject(FormBuilder)
  authenticationService: AuthenticationService = inject(AuthenticationService)
  router: Router = inject(Router)
  toastr:ToastrService = inject(ToastrService)


  loading = signal<boolean>(false)
  showCPasswordText = false

  formGroup: FormGroup = this.fb.group({
    email: ['', [Validators.required , Validators.email]],
    password: ['', Validators.required],
  })

  control(key: string) {
    return this.formGroup.get(key) as FormControl
  }


  submit() {

    const data:LoginRequest = {email: this.control('email').value, password: this.control('password').value}

    this.loading.update(() => true)
    this.authenticationService.login(data)
      .subscribe({
        next: (response:User|null) => {
          // console.log(response)
          this.loading.update(() => false)
          if(response){
         
          this.toastr.info(`${response.email} Welcome Back`)
          this.router.navigate(["Task Management"])
          }
        },
        error: (error:HttpErrorResponse) => {
          this.loading.update(() => false)
          localStorage.clear()
          this.toastr.error('Invalid username or password')

          console.log(error)

        }
      })
  }

}
