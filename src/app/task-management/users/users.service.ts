import { Injectable, inject } from '@angular/core';
import { User } from './user.dto';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  BASE_URL = environment.BASE_URL
  http:HttpClient = inject(HttpClient)
  
  // users: User[] = [
  //   {
  //     id:1,
  //     firstname: 'FirstName A',
  //     lastname: 'Lastname A',
  //     email: 'A@gmail.com',
  //   },
  //   {
  //     id:2,
  //     firstname: 'FirstName B',
  //     lastname: 'Lastname B',
  //     email: 'B@gmail.com',
  //   },
  //   {
  //     id:3,
  //     firstname: 'FirstName C',
  //     lastname: 'Lastname C',
  //     email: 'C@gmail.com',
  //   }

  // ]


  searchList(params: HttpParams): Observable<User[]> {
    // return of([... this.users])
    return this.http.get<User[]>(`${this.BASE_URL}/users`)
  }


  createUser(user: User):Observable<string> {
    // this.users.push({... user , id:(this.users.length+1)});
    //  return of("success")

    // let users:User[] = [];
    // user.id = users.length
    // this.http.get<User[]>(`${this.BASE_URL}/users`).subscribe(users => users = users)
    this.http.post<any>(`${this.BASE_URL}/auths` , {email:user.email , password:"password"})
    return this.http.post<any>(`${this.BASE_URL}/users` , user)
   }
 
   updateUser(id:string ,  user: User):Observable<string> {
    //  const updateUserIndex:number = this.users.findIndex(user => user.id === id)
    //  if(updateUserIndex != -1){
    //    this.users[updateUserIndex] = user
    //    return of("success");
    //  }else{
    //    return of("task not found");
    //  }
    return this.http.put<any>(`${this.BASE_URL}/users/${id}` , user)
    }

}
