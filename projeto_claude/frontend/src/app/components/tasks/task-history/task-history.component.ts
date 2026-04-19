import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Task, TaskStatus, TaskPriority, TaskHistoryItem } from '../../../models/task.model';
import { TaskService } from '../../../services/task.service';

type FilterType = 'all' | 'status' | 'priority' | 'other';

@Component({
  selector: 'app-task-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './task-history.component.html'
})
export class TaskHistoryComponent implements OnInit {
  task?: Task;
  allHistory: TaskHistoryItem[] = [];
  filteredHistory: TaskHistoryItem[] = [];
  loading = true;
  error = '';
  activeFilter: FilterType = 'all';

  constructor(private route: ActivatedRoute, private taskService: TaskService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    forkJoin({
      task: this.taskService.getById(id),
      history: this.taskService.getHistory(id)
    }).subscribe({
      next: ({ task, history }) => {
        this.task = task;
        this.allHistory = history;
        this.applyFilter('all');
        this.loading = false;
      },
      error: () => {
        this.error = 'Falha ao carregar histórico. Verifique se o backend está rodando.';
        this.loading = false;
      }
    });
  }

  applyFilter(filter: FilterType): void {
    this.activeFilter = filter;
    if (filter === 'all') {
      this.filteredHistory = this.allHistory;
      return;
    }
    if (filter === 'status') {
      this.filteredHistory = this.allHistory.filter(h => h.fieldChanged === 'Status');
      return;
    }
    if (filter === 'priority') {
      this.filteredHistory = this.allHistory.filter(h => h.fieldChanged === 'Prioridade');
      return;
    }
    this.filteredHistory = this.allHistory.filter(
      h => h.fieldChanged !== 'Status' && h.fieldChanged !== 'Prioridade'
    );
  }

  countOf(field: string): number {
    return this.allHistory.filter(h => h.fieldChanged === field).length;
  }

  getStatusCount(): number { return this.countOf('Status'); }
  getPriorityCount(): number { return this.countOf('Prioridade'); }
  getOtherCount(): number {
    return this.allHistory.filter(h => h.fieldChanged !== 'Status' && h.fieldChanged !== 'Prioridade').length;
  }

  isStatusChange(item: TaskHistoryItem): boolean { return item.fieldChanged === 'Status'; }
  isCreation(item: TaskHistoryItem): boolean { return item.fieldChanged === 'Criação'; }

  getStatusBadgeClass(value?: string): string {
    switch (value) {
      case 'Pending':    return 'badge-status bg-warning text-dark';
      case 'InProgress': return 'badge-status bg-info text-dark';
      case 'Done':       return 'badge-status bg-success text-white';
      default:           return 'badge-status bg-secondary text-white';
    }
  }

  getStatusLabel(value?: string): string {
    switch (value) {
      case 'Pending':    return 'Pendente';
      case 'InProgress': return 'Em Andamento';
      case 'Done':       return 'Concluído';
      default:           return value ?? '(vazio)';
    }
  }

  getPriorityBadgeClass(value?: string): string {
    switch (value) {
      case 'High':   return 'badge-status bg-danger text-white';
      case 'Medium': return 'badge-status bg-warning text-dark';
      case 'Low':    return 'badge-status bg-secondary text-white';
      default:       return 'badge-status bg-secondary text-white';
    }
  }

  getPriorityLabel(value?: string): string {
    switch (value) {
      case 'High':   return 'Alta';
      case 'Medium': return 'Média';
      case 'Low':    return 'Baixa';
      default:       return value ?? '(vazio)';
    }
  }

  getCurrentStatusBadge(): string {
    return this.getStatusBadgeClass(this.task?.status as string);
  }

  getFieldLabel(field: string): string {
    const map: Record<string, string> = {
      'Criação': 'Criação', 'Título': 'Título', 'Descrição': 'Descrição',
      'Status': 'Status', 'Prioridade': 'Prioridade',
      'Projeto': 'Projeto', 'Vencimento': 'Vencimento'
    };
    return map[field] ?? field;
  }

  getFieldIcon(field: string): string {
    const map: Record<string, string> = {
      'Criação': 'bi-plus-circle-fill', 'Título': 'bi-fonts',
      'Descrição': 'bi-text-paragraph', 'Status': 'bi-arrow-repeat',
      'Prioridade': 'bi-flag-fill', 'Projeto': 'bi-folder-fill',
      'Vencimento': 'bi-calendar-event'
    };
    return map[field] ?? 'bi-pencil';
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }
}
