import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';
import { UserService } from '../../core/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  LoginForm!: FormGroup;
  submitted = false;
  loading = false; 
  token?: string;
  loginUsed?: string;
  errorMessage?: string;

  ngOnInit() {
    this.LoginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.LoginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = undefined;
    if (this.LoginForm.invalid) {
      return;
    }

    const credentials = {
      login: this.LoginForm.value.login,
      password: this.LoginForm.value.password
    };

    this.loading = true;

    this.userService.login(credentials)
      .pipe(takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (token: string) => {
          this.token = token;
          this.loginUsed = credentials.login;
          localStorage.setItem('token', token);
          this.router.navigate(['/students']);
        },
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Bad credentials';
          console.error('Erreur de connexion :', err);
        }
      });
  }

  onReset(): void {
    this.submitted = false;
    this.LoginForm.reset();
    this.errorMessage = undefined;
  }
}
