import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { TaskStatus, TaskPriority } from '../../../models/task.model';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.component.html'
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  taskId?: number;
  loading = false;
  saving = false;
  error = '';
  projects: Project[] = [];

  statusOptions = Object.values(TaskStatus);
  priorityOptions = Object.values(TaskPriority);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProjects();

    this.taskId = this.route.snapshot.params['id']
      ? Number(this.route.snapshot.params['id'])
      : undefined;

    this.isEdit = !!this.taskId;

    if (this.isEdit && this.taskId) {
      this.loading = true;
      this.taskService.getById(this.taskId).subscribe({
        next: (task: { title: string; description: string; status: TaskStatus; priority: TaskPriority; projectId: number; dueDate?: string }) => {
          const dueDate = task.dueDate
            ? new Date(task.dueDate).toISOString().substring(0, 10)
            : '';
          this.form.patchValue({
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            projectId: task.projectId,
            dueDate: dueDate
          });
          this.loading = false;
        },
        error: (err: unknown) => {
          this.error = 'Failed to load task data.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      status: [TaskStatus.Pending, [Validators.required]],
      priority: [TaskPriority.Medium, [Validators.required]],
      projectId: [null, [Validators.required]],
      dueDate: ['']
    });
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
      },
      error: (err: unknown) => {
        console.error('Failed to load projects', err);
      }
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';

    const formValue = this.form.value;
    const payload = {
      title: formValue.title,
      description: formValue.description || '',
      status: formValue.status,
      priority: formValue.priority,
      projectId: Number(formValue.projectId),
      dueDate: formValue.dueDate
        ? new Date(formValue.dueDate).toISOString()
        : undefined
    };

    if (this.isEdit && this.taskId) {
      this.taskService.update(this.taskId, payload).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err: unknown) => {
          this.error = 'Failed to update task.';
          this.saving = false;
          console.error(err);
        }
      });
    } else {
      this.taskService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/tasks']);
        },
        error: (err: unknown) => {
          this.error = 'Failed to create task.';
          this.saving = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/tasks']);
  }
}
