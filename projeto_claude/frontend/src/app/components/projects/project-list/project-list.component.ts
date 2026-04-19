import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Project, ProjectStatus } from '../../../models/project.model';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.loading = true;
    this.error = '';
    this.projectService.getAll().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = 'Failed to load projects. Make sure the backend is running.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteProject(id: number, name: string): void {
    if (!confirm(`Are you sure you want to delete project "${name}"? All associated tasks will also be deleted.`)) {
      return;
    }

    this.projectService.delete(id).subscribe({
      next: () => {
        this.projects = this.projects.filter(p => p.id !== id);
        this.successMessage = `Project "${name}" deleted successfully.`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: unknown) => {
        this.error = 'Failed to delete project.';
        console.error(err);
      }
    });
  }

  getStatusBadgeClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Active: return 'bg-success';
      case ProjectStatus.Inactive: return 'bg-secondary';
      case ProjectStatus.Completed: return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  getStatusLabel(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Active: return 'Ativo';
      case ProjectStatus.Inactive: return 'Inativo';
      case ProjectStatus.Completed: return 'Concluído';
      default: return status;
    }
  }

  getPostitClass(status: ProjectStatus): string {
    switch (status) {
      case ProjectStatus.Active: return 'postit--green';
      case ProjectStatus.Inactive: return 'postit--gray';
      case ProjectStatus.Completed: return 'postit--blue';
      default: return '';
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }
}
