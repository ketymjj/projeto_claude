import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Params } from '@angular/router';
import { Task, TaskStatus, TaskPriority } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.component.html'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  error = '';
  successMessage = '';
  filterProjectId?: number;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      this.filterProjectId = params['projectId'] ? Number(params['projectId']) : undefined;
      this.loadTasks();
    });
  }

  loadTasks(): void {
    this.loading = true;
    this.error = '';
    this.taskService.getAll(this.filterProjectId).subscribe({
      next: (data: Task[]) => {
        this.tasks = data;
        this.loading = false;
      },
      error: (err: unknown) => {
        this.error = 'Falha ao carregar tarefas. Verifique se o backend está rodando.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  deleteTask(id: number, title: string): void {
    if (!confirm(`Tem certeza que deseja excluir a tarefa "${title}"?`)) {
      return;
    }
    this.taskService.delete(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.successMessage = `Tarefa "${title}" excluída com sucesso.`;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: unknown) => {
        this.error = 'Falha ao excluir tarefa.';
        console.error(err);
      }
    });
  }

  getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      'Criação':    'Criação',
      'Título':     'Título',
      'Descrição':  'Descrição',
      'Status':     'Status',
      'Prioridade': 'Prioridade',
      'Projeto':    'Projeto',
      'Vencimento': 'Vencimento',
      // legados (inglês)
      Title:       'Título',
      Description: 'Descrição',
      Priority:    'Prioridade',
      ProjectId:   'Projeto',
      DueDate:     'Vencimento'
    };
    return labels[field] ?? field;
  }

  getFieldIcon(field: string): string {
    const icons: Record<string, string> = {
      'Criação':    'bi-plus-circle-fill',
      'Título':     'bi-fonts',
      'Descrição':  'bi-text-paragraph',
      'Status':     'bi-arrow-repeat',
      'Prioridade': 'bi-flag-fill',
      'Projeto':    'bi-folder-fill',
      'Vencimento': 'bi-calendar-event',
      // legados (inglês)
      Title:       'bi-fonts',
      Description: 'bi-text-paragraph',
      Priority:    'bi-flag-fill',
      ProjectId:   'bi-folder-fill',
      DueDate:     'bi-calendar-event'
    };
    return icons[field] ?? 'bi-pencil';
  }

  getPostitClass(task: Task): string {
    if (!task.dueDate) return 'postit--yellow';
    const due = new Date(task.dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
    if (dueDay < today) return 'postit--red';      // vencida
    if (dueDay.getTime() === today.getTime()) return 'postit--orange';  // vence hoje
    return 'postit--green';                         // dentro do prazo
  }

  getStatusLabel(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending:    return 'Pendente';
      case TaskStatus.InProgress: return 'Em Andamento';
      case TaskStatus.Done:       return 'Concluído';
      default: return status;
    }
  }

  getPriorityLabel(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.High:   return 'Alta';
      case TaskPriority.Medium: return 'Média';
      case TaskPriority.Low:    return 'Baixa';
      default: return priority;
    }
  }

  getStatusBadgeClass(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.Pending: return 'bg-warning text-dark';
      case TaskStatus.InProgress: return 'bg-info text-dark';
      case TaskStatus.Done: return 'bg-success';
      default: return 'bg-secondary';
    }
  }

  getPriorityBadgeClass(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.High: return 'bg-danger';
      case TaskPriority.Medium: return 'bg-warning text-dark';
      case TaskPriority.Low: return 'bg-secondary';
      default: return 'bg-secondary';
    }
  }

  getPriorityIcon(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.High: return 'bi-arrow-up-circle-fill';
      case TaskPriority.Medium: return 'bi-dash-circle-fill';
      case TaskPriority.Low: return 'bi-arrow-down-circle-fill';
      default: return 'bi-circle';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  isOverdue(dateStr: string): boolean {
    return new Date(dateStr) < new Date();
  }

  clearFilter(): void {
    this.filterProjectId = undefined;
    this.loadTasks();
  }
}
