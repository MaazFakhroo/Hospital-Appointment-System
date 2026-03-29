# Hospital Appointment System - Frontend Setup Guide

## Overview
This is the Angular 17+ frontend for the Hospital Appointment System, a comprehensive appointment booking platform with role-based access for patients, doctors, and administrators.

## Tech Stack
- **Framework**: Angular 17+ (Standalone Components)
- **Language**: TypeScript 5.2
- **Styling**: SCSS with CSS custom properties
- **Forms**: Reactive Forms with custom validators
- **State Management**: RxJS Observables
- **Build Tool**: Angular CLI
- **Package Manager**: npm

## Project Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models.ts              # TypeScript interfaces
│   │   │   ├── auth.service.ts        # Authentication service
│   │   │   ├── appointment.service.ts # Appointment management
│   │   │   └── auth.guard.ts          # Route guards
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   └── login/             # Login page with role selection
│   │   │   ├── patient/
│   │   │   │   ├── dashboard/         # Patient dashboard
│   │   │   │   ├── book-appointment/  # Appointment booking form
│   │   │   │   └── symptom-checker/   # AI symptom checker (placeholder)
│   │   │   ├── doctor/
│   │   │   │   └── dashboard/         # Doctor's appointment queue
│   │   │   └── admin/
│   │   │       └── dashboard/         # System statistics & reporting
│   │   ├── shared/                    # Shared components (future)
│   │   ├── app.routes.ts              # Route configuration
│   │   ├── app.config.ts              # Application configuration
│   │   ├── app.component.ts           # Root component
│   │   └── main.ts                    # Entry point
│   ├── styles.scss                    # Global styles and design system
│   └── index.html                     # Root HTML template
├── package.json                       # Dependencies
├── angular.json                       # Build configuration
└── tsconfig.json                      # TypeScript configuration
```

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm installed
- Git configured with GitHub credentials

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Development Server
```bash
npm start
# or
ng serve
```

The application will be available at `http://localhost:4200`

### Step 3: Build for Production
```bash
ng build --configuration production
```

## Features Implemented

### ✅ Authentication & Authorization
- **Role-based login** with three roles: Patient, Doctor, Admin
- **JWT mock tokens** with localStorage persistence
- **Route guards** enforcing authentication and role-based access
- **Demo login buttons** for quick testing
  - Patient: aisha@email.com / password
  - Doctor: sneha@hospital.com / password
  - Admin: admin@hospital.com / password

### ✅ Patient Module
- **Dashboard**: View upcoming appointments and appointment history
- **Book Appointment**: 
  - Select doctor by specialization
  - Pick available date and time slots
  - Automatic conflict detection (prevents double-booking)
  - Form validation with error messages
- **Symptom Checker**: Placeholder for future AI integration

### ✅ Doctor Module
- **Dashboard**: View today's appointment queue
- **Patient Details**: Patient name, reason for visit, appointment time
- **Statistics**: Today's patient count, weekly appointments, completion rate

### ✅ Admin Module
- **System Statistics**:
  - Total bookings, confirmed/cancelled appointments
  - Specialization breakdown with visual charts
  - Monthly performance metrics
  - Doctor utilization rates
- **Appointment Management**: View all appointments across the system
- **Patient Queue**: Monitor patient flow

### ✅ Data Persistence
- **LocalStorage Mock Backend**: All data persists across page refreshes
- **Appointment Conflict Detection**: Prevents duplicate bookings
- **Doctor Specializations**: 
  - Cardiology (Dr. Priya Sharma)
  - Neurology (Dr. Rahul Mehta)
  - Dermatology (Dr. Sneha Iyer)
  - Orthopedic (Dr. Arjun Nair)

### ✅ Design System
- **Color Scheme**: Professional healthcare color palette
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Components**:
  - Header with branding and user profile
  - Sidebar navigation
  - Stat cards with metrics
  - Time slot picker
  - Appointment cards with status indicators
  - Forms with reactive validation

## Key Services

### AuthService (`core/auth.service.ts`)
Handles authentication and user sessions:
- `login(email, password, role)`: Authenticate user
- `logout()`: Clear session
- `getCurrentUser()`: Get current user data
- `hasRole(role)`: Check user permission
- `isAuthenticated()`: Check if logged in

### AppointmentService (`core/appointment.service.ts`)
Manages all appointment operations:
- `bookAppointment(appointment)`: Create new appointment with conflict detection
- `cancelAppointment(id)`: Cancel existing appointment
- `rescheduleAppointment(id, newDate, newTime)`: Reschedule appointment
- `getAvailableSlots(doctorId, date)`: Get available time slots
- `isSlotAvailable(doctorId, date, time)`: Check slot availability
- `getAppointmentsByPatient(patientId)`: Get patient appointments
- `getAppointmentsByDoctor(doctorId)`: Get doctor appointments
- `getAllAppointments()`: Get all appointments (admin only)

## Configuration

### Environment Variables
Create `.env` file in `/frontend` (future):
```env
API_BASE_URL=http://localhost:5000
API_VERSION=v1
```

### TypeScript Configuration
- **Strict Mode**: Enabled for enhanced type safety
- **Target**: ES2022
- **Module**: ES2022

## Testing (Upcoming)
```bash
ng test                    # Run unit tests with Karma/Jasmine
ng test --code-coverage   # Generate coverage report
```

## Development Workflow

### Create a New Component
```bash
ng generate component modules/patient/new-component
```

### Create a New Service
```bash
ng generate service core/new-service
```

### Run Linter
```bash
ng lint
```

### Format Code
```bash
npm run format  # (requires prettier)
```

## API Integration (Future)
Currently using localStorage for mock data. To integrate the .NET backend:

1. **Create HTTP Interceptor** for JWT token injection:
   ```typescript
   ng generate interceptor core/interceptors/jwt
   ```

2. **Update AppointmentService** to use HttpClient:
   ```typescript
   constructor(private http: HttpClient) {}
   
   bookAppointment(appointment: Appointment): Observable<BookingResponse> {
     return this.http.post('/api/appointments', appointment);
   }
   ```

3. **Configure base URL** in `environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:5000/api'
   };
   ```

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimization
- **OnPush Change Detection**: Ready for implementation
- **Lazy Loading**: Routes are lazy-loaded by module
- **Tree Shaking**: Unused code is removed during build

## Troubleshooting

### Port 4200 Already in Use
```bash
ng serve --port 4300
```

### Clear Node Modules
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build Cache Issues
```bash
ng cache clean
ng build
```

## Team Collaboration

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
```

## Resources
- [Angular Documentation](https://angular.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [RxJS Documentation](https://rxjs.dev/docs)
- [Angular Material](https://material.angular.io/)

## Support
For issues or questions, contact the development team or check the project GitHub repository.

## License
This project is part of a digital engineering capstone program.
