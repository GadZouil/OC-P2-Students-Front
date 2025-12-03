import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.component.html'
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  form: FormGroup;
  submitted = false;
  isEdit = false;
  studentId?: number;
  error?: string;

  constructor() {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.studentId = Number(id);
      this.studentService.getById(this.studentId).subscribe({
        next: (s) => this.form.patchValue(s),
        error: (err) => {
          this.error = 'Erreur lors du chargement de l’étudiant';
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    const payload: Student = this.form.value;

    const obs = this.isEdit && this.studentId
      ? this.studentService.update(this.studentId, payload)
      : this.studentService.create(payload);

    obs.subscribe({
      next: () => this.router.navigate(['/students']),
      error: (err) => {
        this.error = 'Erreur lors de l’enregistrement';
        console.error(err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/students']);
  }
}
