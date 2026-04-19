import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { ProjectStatus } from '../../../models/project.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './project-form.component.html'
})
export class ProjectFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  projectId?: number;
  loading = false;
  saving = false;
  error = '';

  statusOptions = Object.values(ProjectStatus);

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();

    this.projectId = this.route.snapshot.params['id']
      ? Number(this.route.snapshot.params['id'])
      : undefined;

    this.isEdit = !!this.projectId;

    if (this.isEdit && this.projectId) {
      this.loading = true;
      this.projectService.getById(this.projectId).subscribe({
        next: (project: { name: string; description: string; startDate: string; status: ProjectStatus }) => {
          const startDate = project.startDate
            ? new Date(project.startDate).toISOString().substring(0, 10)
            : '';
          this.form.patchValue({
            name: project.name,
            description: project.description,
            startDate: startDate,
            status: project.status
          });
          this.loading = false;
        },
        error: (err: unknown) => {
          this.error = 'Failed to load project data.';
          this.loading = false;
          console.error(err);
        }
      });
    }
  }

  private initForm(): void {
    const today = new Date().toISOString().substring(0, 10);
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(200)]],
      description: ['', [Validators.maxLength(1000)]],
      startDate: [today, [Validators.required]],
      status: [ProjectStatus.Active, [Validators.required]]
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
      name: formValue.name,
      description: formValue.description || '',
      startDate: new Date(formValue.startDate).toISOString(),
      status: formValue.status
    };

    if (this.isEdit && this.projectId) {
      this.projectService.update(this.projectId, payload).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err: unknown) => {
          this.error = 'Failed to update project.';
          this.saving = false;
          console.error(err);
        }
      });
    } else {
      this.projectService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/projects']);
        },
        error: (err: unknown) => {
          this.error = 'Failed to create project.';
          this.saving = false;
          console.error(err);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/projects']);
  }
}
