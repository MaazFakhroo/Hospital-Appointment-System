// Models for the application
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  specialization?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  reason?: string;
  room?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  avatar: string;
  availableSlots: number;
  rating: number;
  isAvailable: boolean;
  bio?: string;
  experience?: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: string;
  medicalHistory?: string[];
}

export interface Notification {
  id: string;
  type: 'email' | 'sms';
  appointmentId: string;
  recipientId: string;
  message: string;
  scheduledTime: string;
  sent: boolean;
}
