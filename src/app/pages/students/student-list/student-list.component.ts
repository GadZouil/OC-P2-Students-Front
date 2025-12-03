import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/service/student.service';
import { Student } from '../../../core/models/Student';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  private studentService = inject(StudentService);
  private router = inject(Router);

  students: Student[] = [];
  loading = false;
  error?: string;

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des étudiants';
        console.error(err);
        this.loading = false;
      }
    });
  }

  goToDetail(id: number): void {
    this.router.navigate(['/students', id]);
  }

  goToEdit(id: number): void {
    this.router.navigate(['/students', id, 'edit']);
  }

  goToCreate(): void {
    this.router.navigate(['/students', 'new']);
  }

  delete(id: number): void {
    if (!confirm('Supprimer cet étudiant ?')) return;

    this.studentService.delete(id).subscribe({
      next: () => this.loadStudents(),
      error: (err) => {
        this.error = 'Erreur lors de la suppression';
        console.error(err);
      }
    });
  }
}
