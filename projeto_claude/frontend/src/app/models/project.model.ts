export enum ProjectStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Completed = 'Completed'
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface CreateProject {
  name: string;
  description: string;
  startDate: string;
  status: ProjectStatus;
}

export interface UpdateProject {
  name: string;
  description: string;
  startDate: string;
  status: ProjectStatus;
}
