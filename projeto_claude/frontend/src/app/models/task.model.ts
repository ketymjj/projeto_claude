export enum TaskStatus {
  Pending = 'Pending',
  InProgress = 'InProgress',
  Done = 'Done'
}

export enum TaskPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  projectName?: string;
  dueDate?: string;
  createdAt: string;
}

export interface CreateTask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  dueDate?: string;
}

export interface TaskHistoryItem {
  id: number;
  taskId: number;
  fieldChanged: string;
  oldValue?: string;
  newValue?: string;
  changedAt: string;
}

export interface UpdateTask {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  dueDate?: string;
}
