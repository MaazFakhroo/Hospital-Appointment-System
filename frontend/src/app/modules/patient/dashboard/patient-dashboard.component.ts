import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AppointmentService } from '../../../core/appointment.service';
import { Appointment, User } from '../../../core/models';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './patient-dashboard.component.html',
  styleUrls: ['./patient-dashboard.component.scss']
})
export class PatientDashboardComponent implements OnInit {
  currentUser: User | null = null;
  upcomingAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadAppointments();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  private loadAppointments(): void {
    if (this.currentUser) {
      const allAppointments = this.appointmentService.getAppointments();
      this.upcomingAppointments = allAppointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed');
      this.pastAppointments = allAppointments.filter(a => a.status === 'completed');
    }
  }

  bookAppointment(): void {
    this.router.navigate(['/patient/book-appointment']);
  }

  cancelAppointment(appointmentId: string): void {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      this.appointmentService.cancelAppointment(appointmentId);
      this.loadAppointments();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
