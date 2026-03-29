import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Appointment, Doctor } from './models';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);
  public appointments$ = this.appointmentsSubject.asObservable();

  private appointmentStorageKey = 'medibook_appointments';
  private doctorsStorageKey = 'medibook_doctors';

  constructor() {
    this.loadAppointmentsFromStorage();
  }

  private loadAppointmentsFromStorage(): void {
    const stored = localStorage.getItem(this.appointmentStorageKey);
    if (stored) {
      this.appointmentsSubject.next(JSON.parse(stored));
    } else {
      // Mock data
      const mockAppointments = this.getMockAppointments();
      localStorage.setItem(this.appointmentStorageKey, JSON.stringify(mockAppointments));
      this.appointmentsSubject.next(mockAppointments);
    }
  }

  private getMockAppointments(): Appointment[] {
    return [
      { id: '1', patientId: 'p1', patientName: 'John Doe', doctorId: 'd1', doctorName: 'Dr. Priya Sharma', specialization: 'Cardiology', date: '2026-03-29', time: '9:00 AM', status: 'confirmed', reason: 'Check-up' },
      { id: '2', patientId: 'p1', patientName: 'Jane Smith', doctorId: 'd2', doctorName: 'Dr. Rahul Mehta', specialization: 'Neurology', date: '2026-04-03', time: '10:00 AM', status: 'confirmed', reason: 'Follow-up' }
    ];
  }

  getAppointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  getAppointmentById(id: string): Appointment | undefined {
    return this.appointmentsSubject.value.find(a => a.id === id);
  }

  getAppointmentsByPatient(patientId: string): Appointment[] {
    return this.appointmentsSubject.value.filter(a => a.patientId === patientId);
  }

  getAppointmentsByDoctor(doctorId: string): Appointment[] {
    return this.appointmentsSubject.value.filter(a => a.doctorId === doctorId);
  }

  // Check if slot is available
  isSlotAvailable(doctorId: string, date: string, time: string): boolean {
    return !this.appointmentsSubject.value.some(
      a => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== 'cancelled'
    );
  }

  // Get booked slots for a doctor on a specific date
  getBookedSlots(doctorId: string, date: string): string[] {
    return this.appointmentsSubject.value
      .filter(a => a.doctorId === doctorId && a.date === date && a.status !== 'cancelled')
      .map(a => a.time);
  }

  // Book appointment
  bookAppointment(appointment: Appointment): { success: boolean; message: string; appointment?: Appointment } {
    const conflictingAppointment = this.appointmentsSubject.value.find(
      a => a.doctorId === appointment.doctorId && 
           a.date === appointment.date && 
           a.time === appointment.time && 
           a.status !== 'cancelled'
    );

    if (conflictingAppointment) {
      return { success: false, message: `❌ Slot ${appointment.time} on ${appointment.date} is already booked!` };
    }

    const newAppointment = {
      ...appointment,
      id: Math.random().toString(36).substring(7)
    };

    const updated = [...this.appointmentsSubject.value, newAppointment];
    this.appointmentsSubject.next(updated);
    localStorage.setItem(this.appointmentStorageKey, JSON.stringify(updated));

    return { success: true, message: '✅ Appointment booked successfully!', appointment: newAppointment };
  }

  // Cancel appointment
  cancelAppointment(appointmentId: string): boolean {
    const updated = this.appointmentsSubject.value.map(a => 
      a.id === appointmentId ? { ...a, status: 'cancelled' as const } : a
    );
    this.appointmentsSubject.next(updated);
    localStorage.setItem(this.appointmentStorageKey, JSON.stringify(updated));
    return true;
  }

  // Reschedule appointment
  rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): { success: boolean; message: string } {
    const appointment = this.appointmentsSubject.value.find(a => a.id === appointmentId);
    if (!appointment) {
      return { success: false, message: 'Appointment not found' };
    }

    if (this.getBookedSlots(appointment.doctorId, newDate).includes(newTime)) {
      return { success: false, message: 'New slot is not available' };
    }

    const updated = this.appointmentsSubject.value.map(a => 
      a.id === appointmentId ? { ...a, date: newDate, time: newTime } : a
    );
    this.appointmentsSubject.next(updated);
    localStorage.setItem(this.appointmentStorageKey, JSON.stringify(updated));

    return { success: true, message: 'Appointment rescheduled successfully' };
  }

  // Get available slots
  getAvailableSlots(doctorId: string, date: string): string[] {
    const allSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
    ];
    const bookedSlots = this.getBookedSlots(doctorId, date);
    return allSlots.filter(slot => !bookedSlots.includes(slot));
  }

  // Get mock doctors
  getDoctors(): Doctor[] {
    return [
      { id: 'd1', name: 'Dr. Priya Sharma', specialization: 'Cardiology', avatar: 'PS', availableSlots: 4, rating: 4.9, isAvailable: true },
      { id: 'd2', name: 'Dr. Rahul Mehta', specialization: 'Neurology', avatar: 'RM', availableSlots: 2, rating: 4.6, isAvailable: false },
      { id: 'd3', name: 'Dr. Sneha Iyer', specialization: 'Dermatology', avatar: 'SI', availableSlots: 6, rating: 4.8, isAvailable: true },
      { id: 'd4', name: 'Dr. Arjun Nair', specialization: 'Orthopedic', avatar: 'AN', availableSlots: 2, rating: 4.7, isAvailable: true }
    ];
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.getDoctors().find(d => d.id === id);
  }

  getDoctorsBySpecialization(specialization: string): Doctor[] {
    return this.getDoctors().filter(d => d.specialization === specialization);
  }

  // Get all appointments (for admin dashboard)
  getAllAppointments(): Appointment[] {
    return this.appointmentsSubject.value;
  }

  // Get unique specializations
  getDoctorSpecializations(): string[] {
    const doctors = this.getDoctors();
    const specializations = [...new Set(doctors.map(d => d.specialization))];
    return specializations;
  }

  // Get doctor specialization by ID
  getDoctorSpecialization(doctorId: string): string {
    const doctor = this.getDoctors().find(d => d.id === doctorId);
    return doctor?.specialization || 'Unknown';
  }
}
