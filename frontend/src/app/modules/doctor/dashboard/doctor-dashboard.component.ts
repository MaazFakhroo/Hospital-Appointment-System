import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AppointmentService } from '../../../core/appointment.service';
import { User, Appointment } from '../../../core/models';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <a class="logo" href="/doctor">Medi<span>Book</span></a>
        <div class="header-actions">
          <span class="badge">🏥 City General Hospital</span>
          <button class="btn-outline" (click)="logout()">Logout</button>
          <div class="user-chip">
            <div class="user-avatar" [style.background]="'#6b3fa0'">{{ currentUser?.avatar }}</div>
            <span class="user-name">{{ currentUser?.name }}</span>
          </div>
        </div>
      </header>

      <div class="app" style="display: flex; flex: 1;">
        <nav class="app-sidebar">
          <div class="nav-section-label">Doctor Portal</div>
          <a class="nav-item active" href="/doctor"><span class="icon">📊</span> My Dashboard</a>
          <a class="nav-item" href="#"><span class="icon">📅</span> My Schedule</a>
          <a class="nav-item" href="#"><span class="icon">🩺</span> Patient Queue</a>
          <div class="nav-spacer"></div>
          <a class="nav-item" (click)="logout()"><span class="icon">🚪</span> Logout</a>
        </nav>

        <main>
          <div class="page-header">
            <div>
              <div class="page-title">Good morning, {{ currentUser?.name?.split(' ')[1] }} 👋</div>
              <div class="page-subtitle">{{ currentUser?.specialization }} · Today's Schedule</div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon">🩺</div>
              <div class="stat-value">{{ todayAppointments.length }}</div>
              <div class="stat-label">Today's Patients</div>
              <div class="stat-change up">On schedule</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-value">{{ weeklyAppointments.length }}</div>
              <div class="stat-label">This Week</div>
              <div class="stat-change up">Scheduled</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⭐</div>
              <div class="stat-value">4.9</div>
              <div class="stat-label">Patient Rating</div>
              <div class="stat-change up">↑ 0.1 this month</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value">{{ completedAppointments.length }}</div>
              <div class="stat-label">Completed</div>
              <div class="stat-change up">This month</div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Today's Appointments</div>
            </div>
            <div *ngIf="todayAppointments.length > 0; else noAppointments">
              <div *ngFor="let appt of todayAppointments" style="padding: 12px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 16px;">
                <span style="font-weight: 700; font-size: 14px; color: var(--accent); width: 68px;">{{ appt.time }}</span>
                <div style="flex: 1;">
                  <div style="font-weight: 600;">{{ appt.patientName }}</div>
                  <div style="font-size: 12px; color: var(--text2); margin-top: 2px;">{{ appt.reason }}</div>
                </div>
                <span [ngClass]="appt.status === 'confirmed' ? 'pill pill-green' : 'pill pill-gold'">{{ appt.status }}</span>
              </div>
            </div>
            <ng-template #noAppointments>
              <div style="padding: 32px; text-align: center; color: var(--text3);">
                ✅ No appointments scheduled for today
              </div>
            </ng-template>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .app {
      flex: 1;
      overflow: hidden;
    }
  `]
})
export class DoctorDashboardComponent implements OnInit {
  currentUser: User | null = null;
  todayAppointments: Appointment[] = [];
  weeklyAppointments: Appointment[] = [];
  completedAppointments: Appointment[] = [];

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
      const allAppointments = this.appointmentService.getAppointmentsByDoctor(this.currentUser.id);
      const today = new Date().toISOString().split('T')[0];
      this.todayAppointments = allAppointments.filter(a => a.date === today && a.status !== 'cancelled');
      this.weeklyAppointments = allAppointments.filter(a => a.status !== 'cancelled');
      this.completedAppointments = allAppointments.filter(a => a.status === 'completed');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
