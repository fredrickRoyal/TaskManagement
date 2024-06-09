import { Injectable, inject } from '@angular/core';
import { LoginRequest } from './authentication.dto';
import { Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../task-management/users/user.dto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  BASE_URL = environment.BASE_URL
  http:HttpClient = inject(HttpClient)


  login(data: LoginRequest):Observable<User|null> {
   return this.http.get<LoginRequest[]>(`${this.BASE_URL}/auths`).pipe(
    switchMap(auths => {
    let auth = auths.find(u => (u.email == data.email && data.password == u.password))
    if(auth){
      localStorage.setItem(environment.AUTH_TOKEN, data.email)
      return this.http.get<User[]>(`${this.BASE_URL}/users`)
    }else{
      return of(null)
    }
   }) , 
  switchMap(response => {
    if(response){
     let user = response.find(u => u.email == data.email)
     if(user){
      localStorage.setItem(environment.LOGGED_IN_USER_PROFILE , JSON.stringify(user))
      return of(user)
     }else{
      return of(null)
     }
    }else{
      return of(null)
    }
  }))
  }


  logOut() {
    localStorage.clear();
  }

}
