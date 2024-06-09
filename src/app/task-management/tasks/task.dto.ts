import { User } from "../users/user.dto"

export interface Task{
    id?:string
    name:string
    description:string
    status:TaskStatus
    createdDateTime?:string|Date
    updatedDateTime?:string|Date
    user:User|null
}

export enum TaskStatus{
    Pending = "Pending",
    Completed = "Completed",
    InProgress = 'In Progress'
}

