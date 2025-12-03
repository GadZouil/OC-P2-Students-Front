import { Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';

import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

import { StudentListComponent } from './pages/students/student-list/student-list.component';
import { StudentDetailComponent } from './pages/students/student-detail/student-detail.component';
import { StudentFormComponent } from './pages/students/student-form/student-form.component';

export const routes: Routes = [

  {
    path: '',
    component: AppComponent,
    pathMatch: 'full'
  },

  // Auth
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },

  // ---------------------------
  //      ROUTES ETUDIANTS
  // ---------------------------
  {
    path: 'students',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: StudentListComponent
      },
      {
        path: 'new',
        component: StudentFormComponent
      },
      {
        path: ':id',
        component: StudentDetailComponent
      },
      {
        path: ':id/edit',
        component: StudentFormComponent
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'students'
  }
];
