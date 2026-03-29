import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  selectedRole: 'patient' | 'doctor' | 'admin' = 'patient';
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onRoleSelect(role: 'patient' | 'doctor' | 'admin'): void {
    this.selectedRole = role;
    this.errorMessage = '';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password, this.selectedRole).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Navigate based on role
        this.router.navigate([`/${this.selectedRole}/dashboard`]);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
      }
    });
  }

  quickLogin(role: 'patient' | 'doctor' | 'admin'): void {
    this.selectedRole = role;
    // Set demo credentials based on role
    const demoEmails = {
      patient: 'aisha@email.com',
      doctor: 'sneha@hospital.com',
      admin: 'admin@hospital.com'
    };
    
    this.loginForm.patchValue({
      email: demoEmails[role],
      password: 'password123'
    });
    
    setTimeout(() => this.onSubmit(), 300);
  }
}
