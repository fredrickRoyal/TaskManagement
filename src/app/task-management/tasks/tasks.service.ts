import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { Task, TaskStatus } from './task.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  BASE_URL = environment.BASE_URL
  http:HttpClient = inject(HttpClient)


  // tasks: Task[] = [
  //   {
  //     id:1,
  //     name: 'Task A',
  //     description: 'Task A description',
  //     status: TaskStatus.Pending,
  //     createdDateTime: new Date(),
  //     updatedDateTime: new Date(),
  //     user: null
  //   },
  //   {
  //     id:2,
  //     name: 'Task B',
  //     description: 'Task B description',
  //     status: TaskStatus.InProgress,
  //     createdDateTime: new Date(),
  //     updatedDateTime: new Date(),
  //     user: null
  //   },
  //   {
  //     id:3,
  //     name: 'Task C',
  //     description: 'Task C description',
  //     status: TaskStatus.Completed,
  //     createdDateTime: new Date(),
  //     updatedDateTime: new Date(),
  //     user: null
  //   }

  // ]

  searchList(params: HttpParams): Observable<Task[]> {

    console.log(params)

    if(params.get("user")){
      const userId = params.get("user") as string;
      return this.http.get<Task[]>(`${this.BASE_URL}/tasks`). pipe(switchMap(tasks => of(tasks.filter(task => (task.user && task.user.id == userId)))))
      // subscribe(tasks => userTasks = tasks.filter(task => (task.user && task.user.id == +userId) ))
    }
    return this.http.get<Task[]>(`${this.BASE_URL}/tasks`)
  }


  createTask(task: Task):Observable<string> {
    // this.http.get<Task[]>(`${this.BASE_URL}/tasks`).subscribe(tasks =>     task.id =tasks.length+1)
  //  this.tasks.push({... task , id:(this.tasks.length+1) , createdDateTime:new Date() , updatedDateTime:new Date() , user:null});
    return this.http.post<any>(`${this.BASE_URL}/tasks` , task)
  }

  updateTask(id:string ,  task: Task):Observable<string> {
    // const updateTaskIndex:number = this.tasks.findIndex(task => task.id === id)
    // if(updateTaskIndex != -1){
    //   this.tasks[updateTaskIndex] = {... task , updatedDateTime:new Date()};
    //   return of("success");
    // }else{
    //   return of("task not found");
    // }
    return this.http.put<any>(`${this.BASE_URL}/tasks/${id}` , task)

   }


   deleteTask(id:string):Observable<string> {
    // const updateTaskIndex:number = this.tasks.findIndex(task => task.id === id)
    // if(updateTaskIndex != -1){
    //   this.tasks.splice(updateTaskIndex, 1)
    //   return of("successfully deleted");
    // }else{
    //   return of("task not found");
    // }

    return this.http.delete<any>(`${this.BASE_URL}/tasks/${id}`)
   }

 

}
