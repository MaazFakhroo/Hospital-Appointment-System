// ──────────────────────────────────────────────────────
// MEDIBOOK FRONTEND UTILITIES
// Date validation, form validation, booking conflict detection
// ──────────────────────────────────────────────────────

// APPOINTMENT STORAGE (Local Storage Simulation)
class AppointmentManager {
  constructor() {
    this.storageKey = 'medibook_appointments';
    this.loadAppointments();
  }

  loadAppointments() {
    const stored = localStorage.getItem(this.storageKey);
    this.appointments = stored ? JSON.parse(stored) : this.getDefaultAppointments();
  }

  saveAppointments() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.appointments));
  }

  getDefaultAppointments() {
    return [
      { id: 1, patient: 'John Doe', doctor: 'Dr. Priya Sharma', date: '2026-03-29', time: '9:00 AM', specialist: 'Cardiology', status: 'confirmed' },
      { id: 2, patient: 'Jane Smith', doctor: 'Dr. Rahul Mehta', date: '2026-03-29', time: '9:30 AM', specialist: 'Neurology', status: 'pending' },
      { id: 3, patient: 'Bob Wilson', doctor: 'Dr. Sneha Iyer', date: '2026-03-29', time: '10:00 AM', specialist: 'Dermatology', status: 'confirmed' },
      { id: 4, patient: 'Alice Brown', doctor: 'Dr. Arjun Nair', date: '2026-03-29', time: '11:00 AM', specialist: 'Orthopedic', status: 'confirmed' },
      { id: 5, patient: 'Charlie Davis', doctor: 'Dr. Priya Sharma', date: '2026-04-03', time: '10:00 AM', specialist: 'Cardiology', status: 'confirmed' },
      { id: 6, patient: 'Eve Martinez', doctor: 'Dr. Rahul Mehta', date: '2026-04-15', time: '2:30 PM', specialist: 'Neurology', status: 'confirmed' },
    ];
  }

  // Check if slot is available (not booked)
  isSlotAvailable(doctor, date, time) {
    return !this.appointments.some(apt => 
      apt.doctor === doctor && 
      apt.date === date && 
      apt.time === time &&
      apt.status !== 'cancelled'
    );
  }

  // Get booked slots for a doctor on a specific date
  getBookedSlotsForDate(doctor, date) {
    return this.appointments
      .filter(apt => apt.doctor === doctor && apt.date === date && apt.status !== 'cancelled')
      .map(apt => apt.time);
  }

  // Add new appointment
  addAppointment(patient, doctor, date, time, specialist, reason = '') {
    if (!this.isSlotAvailable(doctor, date, time)) {
      return { success: false, message: `❌ Slot ${time} on ${date} with ${doctor} is already booked!` };
    }
    
    const newAppt = {
      id: Math.max(...this.appointments.map(a => a.id), 0) + 1,
      patient,
      doctor,
      date,
      time,
      specialist,
      status: 'confirmed',
      reason: reason || 'General visit'
    };
    
    this.appointments.push(newAppt);
    this.saveAppointments();
    return { success: true, message: `✅ Appointment booked successfully!`, appointment: newAppt };
  }

  // Get all appointments for a doctor
  getDoctorAppointments(doctor) {
    return this.appointments.filter(apt => apt.doctor === doctor && apt.status !== 'cancelled');
  }

  // Cancel appointment
  cancelAppointment(id) {
    const apt = this.appointments.find(a => a.id === id);
    if (apt) {
      apt.status = 'cancelled';
      this.saveAppointments();
      return true;
    }
    return false;
  }
}

// Initialize global appointment manager
window.appointmentManager = new AppointmentManager();

// ──────────────────────────────────────────────────────
// DATE VALIDATION UTILITIES
// ──────────────────────────────────────────────────────

class DateValidator {
  constructor() {
    this.today = new Date();
    this.minDate = this.getMinDate();
    this.maxDate = this.getMaxDate();
  }

  getMinDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Minimum 1 day from today
    return this.formatDate(date);
  }

  getMaxDate() {
    const date = new Date();
    date.setDate(date.getDate() + 60); // Maximum 60 days from today
    return this.formatDate(date);
  }

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Check if date is valid for booking
  isValidBookingDate(dateString) {
    const bookingDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 1);
    
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 60);
    
    // Check if date is within range
    if (bookingDate < minDate) return { valid: false, message: '❌ Cannot book appointments in the past.' };
    if (bookingDate > maxDate) return { valid: false, message: '❌ Cannot book appointments more than 60 days in advance.' };
    
    // Check if it's a weekend (optional - based on hospital policy)
    const dayOfWeek = bookingDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { valid: false, message: '❌ Hospital is closed on weekends. Please choose a weekday.' };
    }
    
    return { valid: true, message: 'Date is valid' };
  }

  // Get available dates for date picker
  setDateInputLimits(inputElement) {
    inputElement.min = this.getMinDate();
    inputElement.max = this.getMaxDate();
  }

  // Format date for display
  formatDateDisplay(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
}

window.dateValidator = new DateValidator();

// ──────────────────────────────────────────────────────
// FORM VALIDATION UTILITIES
// ──────────────────────────────────────────────────────

class FormValidator {
  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhone(phone) {
    // Indian phone number format (10 digits)
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  }

  static validateName(name) {
    return name.trim().length >= 3 && name.trim().length <= 50;
  }

  static validateField(fieldName, value) {
    const errors = {};

    switch(fieldName.toLowerCase()) {
      case 'email':
        if (!value) errors.email = '❌ Email is required';
        else if (!this.validateEmail(value)) errors.email = '❌ Invalid email format';
        break;
      case 'phone':
        if (!value) errors.phone = '❌ Phone number is required';
        else if (!this.validatePhone(value)) errors.phone = '❌ Invalid phone number (10 digits required)';
        break;
      case 'name':
        if (!value) errors.name = '❌ Name is required';
        else if (!this.validateName(value)) errors.name = '❌ Name must be 3-50 characters';
        break;
      case 'date':
        if (!value) errors.date = '❌ Date is required';
        else {
          const validation = window.dateValidator.isValidBookingDate(value);
          if (!validation.valid) errors.date = validation.message;
        }
        break;
      case 'time':
        if (!value) errors.time = '❌ Time slot is required';
        break;
      case 'doctor':
        if (!value) errors.doctor = '❌ Please select a doctor';
        break;
      case 'reason':
        if (!value) errors.reason = '❌ Reason for visit is required';
        else if (value.trim().length < 5) errors.reason = '❌ Please provide more details (min 5 characters)';
        break;
    }

    return errors;
  }

  static showValidationError(fieldElement, errorMessage) {
    fieldElement.style.borderColor = 'var(--red)';
    fieldElement.style.boxShadow = '0 0 0 3px rgba(192, 57, 43, 0.1)';
    
    // Remove existing error message
    const existingError = fieldElement.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: var(--red); font-size: 12px; margin-top: 4px; font-weight: 600;';
    errorDiv.textContent = errorMessage;
    fieldElement.parentElement.appendChild(errorDiv);
  }

  static clearValidationError(fieldElement) {
    fieldElement.style.borderColor = 'var(--border)';
    fieldElement.style.boxShadow = '';
    const existingError = fieldElement.parentElement.querySelector('.error-message');
    if (existingError) existingError.remove();
  }
}

window.FormValidator = FormValidator;

// ──────────────────────────────────────────────────────
// TIME SLOT UTILITIES
// ──────────────────────────────────────────────────────

class TimeSlotManager {
  constructor() {
    this.allSlots = [
      '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
    ];
    this.blockedSlots = ['9:30 AM', '10:00 AM']; // Example blocked slots
  }

  // Get available slots for a doctor on a specific date
  getAvailableSlots(doctor, date) {
    const bookedSlots = window.appointmentManager.getBookedSlotsForDate(doctor, date);
    return this.allSlots.filter(slot => 
      !bookedSlots.includes(slot) && 
      !this.blockedSlots.includes(slot)
    );
  }

  // Render time slot picker
  renderSlotPicker(containerId, doctor, date, onSlotSelect) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const availableSlots = this.getAvailableSlots(doctor, date);
    const bookedSlots = window.appointmentManager.getBookedSlotsForDate(doctor, date);

    container.innerHTML = availableSlots.length ? availableSlots.map(slot => `
      <button class="time-slot-btn" onclick="selectTimeSlot(this, '${slot}')" data-time="${slot}">
        ${slot}
      </button>
    `).join('') : '<div style="padding: 12px; color: var(--text3); text-align: center;">❌ No slots available</div>';

    // Show booked slots for reference
    if (bookedSlots.length) {
      const bookedDiv = document.createElement('div');
      bookedDiv.style.cssText = 'margin-top: 12px; padding: 12px; background: var(--gold-light); border-radius: 8px; font-size: 12px; color: var(--gold);';
      bookedDiv.innerHTML = `<strong>⏰ Booked slots:</strong> ${bookedSlots.join(', ')}`;
      container.appendChild(bookedDiv);
    }
  }

  // Get slot availability percentage for a date
  getAvailabilityPercentage(doctor, date) {
    const available = this.getAvailableSlots(doctor, date).length;
    return Math.round((available / this.allSlots.length) * 100);
  }
}

window.timeSlotManager = new TimeSlotManager();

// ──────────────────────────────────────────────────────
// UI HELPER UTILITIES
// ──────────────────────────────────────────────────────

function showToast(message, bgColor = 'var(--accent)', duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  
  const msgSpan = document.getElementById('toastMsg');
  msgSpan.textContent = message;
  toast.style.background = bgColor;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, duration - 500);
}

function selectTimeSlot(btn, time) {
  // Remove previous selection
  document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  window.selectedTimeSlot = time;
}

// Add CSS for time slot buttons and toast
const style = document.createElement('style');
style.textContent = `
.time-slot-btn {
  padding: 8px 12px;
  border: 1.5px solid var(--border);
  border-radius: 8px;
  background: var(--surface2);
  color: var(--text2);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'DM Sans', sans-serif;
}

.time-slot-btn:hover {
  border-color: var(--accent);
  background: var(--accent2);
  color: var(--accent);
}

.time-slot-btn.selected {
  background: var(--accent);
  color: #fff;
  border-color: var(--accent);
  font-weight: 700;
}

.time-slots {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.modal-title {
  font-family: 'Playfair Display', serif;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
  color: var(--text);
}

.modal-sub {
  font-size: 13px;
  color: var(--text2);
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.btn-cancel {
  padding: 9px 20px;
  border: 1.5px solid var(--border);
  background: var(--surface);
  color: var(--text);
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: var(--surface2);
  border-color: var(--text3);
}

#toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--accent);
  color: #fff;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s ease;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

#toast span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-message {
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;
document.head.appendChild(style);

// Log initialization
console.log('✅ MediBook Utilities Loaded - Date Validation, Form Validation, Booking Conflicts Enabled');
