import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-detail.component.html'
})
export class StudentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private studentService = inject(StudentService);

  student?: Student;
  loading = false;
  error?: string;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loading = true;
      this.studentService.getById(id).subscribe({
        next: s => {
          this.student = s;
          this.loading = false;
        },
        error: err => {
          this.error = 'Erreur lors du chargement de l’étudiant';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  back(): void {
    this.router.navigate(['/students']);
  }
}
