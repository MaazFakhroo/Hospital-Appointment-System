import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from './models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private tokenKey = 'medibook_token';
  private userKey = 'medibook_user';

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const storedUser = localStorage.getItem(this.userKey);
    const token = localStorage.getItem(this.tokenKey);
    if (storedUser && token) {
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string, role: 'patient' | 'doctor' | 'admin'): Observable<{ user: User; token: string }> {
    // Mock login - replace with actual API call
    return new Observable(observer => {
      setTimeout(() => {
        const mockUsers: { [key: string]: User } = {
          patient: {
            id: 'p1',
            name: 'Aisha Patel',
            email: 'aisha@email.com',
            phone: '9876543210',
            role: 'patient',
            avatar: 'AP'
          },
          doctor: {
            id: 'd1',
            name: 'Dr. Sneha Iyer',
            email: 'sneha@hospital.com',
            phone: '9876543211',
            role: 'doctor',
            specialization: 'Dermatology',
            avatar: 'SI'
          },
          admin: {
            id: 'a1',
            name: 'Admin User',
            email: 'admin@hospital.com',
            phone: '9876543212',
            role: 'admin',
            avatar: 'AD'
          }
        };

        const user = mockUsers[role];
        const token = 'mock_jwt_token_' + Math.random().toString(36).substring(7);

        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));

        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);

        observer.next({ user, token });
        observer.complete();
      }, 500);
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  hasRole(requiredRole: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === requiredRole;
  }
}
