import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { AppointmentService } from '../../../core/appointment.service';
import { User, Appointment } from '../../../core/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <a class="logo" href="/admin">Medi<span>Book</span></a>
        <div class="header-actions">
          <span class="badge">🏥 Administrator</span>
          <button class="btn-outline" (click)="logout()">Logout</button>
          <div class="user-chip">
            <div class="user-avatar" [style.background]="'#cc3333'">{{ currentUser?.avatar }}</div>
            <span class="user-name">{{ currentUser?.name }}</span>
          </div>
        </div>
      </header>

      <div class="app" style="display: flex; flex: 1;">
        <nav class="app-sidebar">
          <div class="nav-section-label">Admin Portal</div>
          <a class="nav-item active" href="/admin"><span class="icon">📊</span> Dashboard</a>
          <a class="nav-item" href="#"><span class="icon">📋</span> Reports</a>
          <a class="nav-item" href="#"><span class="icon">👥</span> Doctors</a>
          <a class="nav-item" href="#"><span class="icon">👤</span> Patients</a>
          <a class="nav-item" href="#"><span class="icon">📅</span> Appointments</a>
          <div class="nav-spacer"></div>
          <a class="nav-item" (click)="logout()"><span class="icon">🚪</span> Logout</a>
        </nav>

        <main>
          <div class="page-header">
            <div>
              <div class="page-title">Dashboard</div>
              <div class="page-subtitle">System overview and statistics</div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-value">{{ totalAppointments }}</div>
              <div class="stat-label">Total Bookings</div>
              <div class="stat-change">All time</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-value">{{ confirmedAppointments }}</div>
              <div class="stat-label">Confirmed</div>
              <div class="stat-change">{{ confirmedPercentage }}% of total</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❌</div>
              <div class="stat-value">{{ cancelledAppointments }}</div>
              <div class="stat-label">Cancelled</div>
              <div class="stat-change">{{ cancelledPercentage }}% of total</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🏆</div>
              <div class="stat-value">{{ activeDoctors }}</div>
              <div class="stat-label">Active Doctors</div>
              <div class="stat-change">Practicing</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <div class="card-header">
                <div class="card-title">Recent Appointments</div>
              </div>
              <div *ngIf="recentAppointments.length > 0; else noRecentAppointments">
                <div *ngFor="let appt of recentAppointments" style="padding: 12px 0; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <div style="font-weight: 600;">{{ appt.patientName }}</div>
                    <div style="font-size: 12px; color: var(--text2); margin-top: 2px;">Dr. {{ appt.doctorName }} · {{ appt.date }}</div>
                  </div>
                  <span [ngClass]="appt.status === 'confirmed' ? 'pill pill-green' : appt.status === 'completed' ? 'pill pill-blue' : 'pill pill-red'">{{ appt.status }}</span>
                </div>
              </div>
              <ng-template #noRecentAppointments>
                <div style="padding: 32px; text-align: center; color: var(--text3);">
                  No appointments yet
                </div>
              </ng-template>
            </div>

            <div class="card">
              <div class="card-header">
                <div class="card-title">Specialization Breakdown</div>
              </div>
              <div style="padding: 16px;">
                <div *ngFor="let spec of specializationStats" style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                    <span style="font-size: 14px; font-weight: 500;">{{ spec.name }}</span>
                    <span style="color: var(--accent); font-weight: 600;">{{ spec.count }}</span>
                  </div>
                  <div style="background: var(--border); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: var(--accent); height: 100%; width: {{ (spec.count / totalAppointments) * 100 }}%; border-radius: 4px;"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title">Monthly Performance</div>
            </div>
            <div style="padding: 16px;">
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 12px;">
                <div style="text-align: center; padding: 12px; background: var(--bg2); border-radius: var(--radius); border: 1px solid var(--border);">
                  <div style="font-size: 20px; font-weight: 700; color: var(--accent);">{{ currentMonthAppointments }}</div>
                  <div style="font-size: 12px; color: var(--text2); margin-top: 4px;">This Month</div>
                </div>
                <div style="text-align: center; padding: 12px; background: var(--bg2); border-radius: var(--radius); border: 1px solid var(--border);">
                  <div style="font-size: 20px; font-weight: 700; color: #4caf50;">{{ avgAppointmentsPerDoctor.toFixed(1) }}</div>
                  <div style="font-size: 12px; color: var(--text2); margin-top: 4px;">Avg per Doctor</div>
                </div>
                <div style="text-align: center; padding: 12px; background: var(--border); border-radius: var(--radius); border: 1px solid var(--bg2);">
                  <div style="font-size: 20px; font-weight: 700; color: var(--text);">{{ occupancyRate }}%</div>
                  <div style="font-size: 12px; color: var(--text2); margin-top: 4px;">Occupancy Rate</div>
                </div>
              </div>
            </div>
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
export class AdminDashboardComponent implements OnInit {
  currentUser: User | null = null;
  allAppointments: Appointment[] = [];
  recentAppointments: Appointment[] = [];
  specializationStats: { name: string; count: number }[] = [];

  totalAppointments = 0;
  confirmedAppointments = 0;
  cancelledAppointments = 0;
  activeDoctors = 0;
  currentMonthAppointments = 0;
  avgAppointmentsPerDoctor = 0;
  occupancyRate = 0;
  confirmedPercentage = 0;
  cancelledPercentage = 0;

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadStatistics();
  }

  private loadUserData(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
    }
  }

  private loadStatistics(): void {
    // Get all appointments
    this.allAppointments = this.appointmentService.getAllAppointments();
    this.totalAppointments = this.allAppointments.length;

    // Status-based counts
    this.confirmedAppointments = this.allAppointments.filter(a => a.status === 'confirmed').length;
    this.cancelledAppointments = this.allAppointments.filter(a => a.status === 'cancelled').length;

    // Percentages
    this.confirmedPercentage = this.totalAppointments > 0 ? Math.round((this.confirmedAppointments / this.totalAppointments) * 100) : 0;
    this.cancelledPercentage = this.totalAppointments > 0 ? Math.round((this.cancelledAppointments / this.totalAppointments) * 100) : 0;

    // Recent appointments (last 5)
    this.recentAppointments = this.allAppointments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

    // Doctor count
    this.activeDoctors = new Set(this.allAppointments.map(a => a.doctorId)).size;

    // Current month appointments
    const currentMonth = new Date().toISOString().substring(0, 7);
    this.currentMonthAppointments = this.allAppointments.filter(a => a.date.startsWith(currentMonth)).length;

    // Average per doctor
    this.avgAppointmentsPerDoctor = this.activeDoctors > 0 ? this.totalAppointments / this.activeDoctors : 0;

    // Occupancy rate (confirmed / total)
    this.occupancyRate = this.totalAppointments > 0 ? Math.round((this.confirmedAppointments / this.totalAppointments) * 100) : 0;

    // Specialization breakdown
    const docSpecializations = this.appointmentService.getDoctorSpecializations();
    this.specializationStats = docSpecializations.map(spec => ({
      name: spec,
      count: this.allAppointments.filter(a => this.appointmentService.getDoctorSpecialization(a.doctorId) === spec).length
    })).sort((a, b) => b.count - a.count);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
