import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { PatientDashboardComponent } from './modules/patient/dashboard/patient-dashboard.component';
import { BookAppointmentComponent } from './modules/patient/book-appointment/book-appointment.component';
import { SymptomCheckerComponent } from './modules/patient/symptom-checker/symptom-checker.component';
import { DoctorDashboardComponent } from './modules/doctor/dashboard/doctor-dashboard.component';
import { AdminDashboardComponent } from './modules/admin/dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Patient routes
  {
    path: 'patient',
    canActivate: [authGuard, roleGuard('patient')],
    children: [
      { path: 'dashboard', component: PatientDashboardComponent },
      { path: 'book-appointment', component: BookAppointmentComponent },
      { path: 'symptom-checker', component: SymptomCheckerComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Doctor routes
  {
    path: 'doctor',
    canActivate: [authGuard, roleGuard('doctor')],
    children: [
      { path: 'dashboard', component: DoctorDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // Admin routes
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard('admin')],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: '/login' }
];
