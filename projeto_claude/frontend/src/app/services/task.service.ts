import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTask, UpdateTask, TaskHistoryItem } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:5000/api/tasks';

  constructor(private http: HttpClient) {}

  getAll(projectId?: number): Observable<Task[]> {
    let params = new HttpParams();
    if (projectId !== undefined) {
      params = params.set('projectId', projectId.toString());
    }
    return this.http.get<Task[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  create(task: CreateTask): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  update(id: number, task: UpdateTask): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getHistory(id: number): Observable<TaskHistoryItem[]> {
    return this.http.get<TaskHistoryItem[]>(`${this.apiUrl}/${id}/history`);
  }
}
