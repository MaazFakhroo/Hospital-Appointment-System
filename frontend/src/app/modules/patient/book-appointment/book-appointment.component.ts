import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../../core/appointment.service';
import { Appointment, Doctor } from '../../../core/models';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.scss']
})
export class BookAppointmentComponent implements OnInit {
  bookingForm!: FormGroup;
  doctors: Doctor[] = [];
  availableSlots: string[] = [];
  selectedSlot: string | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDoctors();
    this.setMinDate();
  }

  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      doctor: ['', [Validators.required]],
      date: ['', [Validators.required]],
      reason: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  private loadDoctors(): void {
    this.doctors = this.appointmentService.getDoctors();
  }

  private setMinDate(): void {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    const minDate = today.toISOString().split('T')[0];
    this.bookingForm.get('date')?.setValidators([Validators.required]);
    const dateControl = this.bookingForm.get('date');
    const dateInput = document.querySelector('input[type="date"]') as HTMLInputElement;
    if (dateInput) {
      dateInput.min = minDate;
    }
  }

  onDoctorSelect(): void {
    this.updateAvailableSlots();
  }

  onDateSelect(): void {
    this.updateAvailableSlots();
  }

  private updateAvailableSlots(): void {
    const doctor = this.bookingForm.get('doctor')?.value;
    const date = this.bookingForm.get('date')?.value;

    if (doctor && date) {
      this.availableSlots = this.appointmentService.getAvailableSlots(doctor, date);
      this.selectedSlot = null;
    }
  }

  selectSlot(slot: string): void {
    this.selectedSlot = slot;
  }

  onSubmit(): void {
    if (this.bookingForm.invalid || !this.selectedSlot) {
      alert('Please fill all fields and select a time slot');
      return;
    }

    this.isLoading = true;
    const formData = this.bookingForm.value;

    const appointment: Appointment = {
      id: '',
      patientId: 'p1',
      patientName: 'Aisha Patel',
      doctorId: formData.doctor,
      doctorName: this.doctors.find(d => d.id === formData.doctor)?.name || '',
      specialization: this.doctors.find(d => d.id === formData.doctor)?.specialization || '',
      date: formData.date,
      time: this.selectedSlot,
      status: 'confirmed',
      reason: formData.reason
    };

    const result = this.appointmentService.bookAppointment(appointment);

    if (result.success) {
      alert('✅ Appointment booked successfully!');
      this.router.navigate(['/patient']);
    } else {
      alert(result.message);
    }

    this.isLoading = false;
  }
}
