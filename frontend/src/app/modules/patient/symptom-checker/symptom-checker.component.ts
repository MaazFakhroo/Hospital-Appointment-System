import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-symptom-checker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <a class="logo" href="/patient">Medi<span>Book</span></a>
        <div class="header-actions">
          <span class="badge">🤖 GenAI Powered</span>
        </div>
      </header>
      <main>
        <div class="page-header">
          <div>
            <div class="page-title">AI Symptom Checker</div>
            <div class="page-subtitle">Describe your symptoms and get doctor recommendations</div>
          </div>
        </div>
        <div class="card">
          <p>🚀 AI Symptom Checker feature coming soon...</p>
          <button class="btn-primary" onclick="window.history.back()" style="margin-top: 20px;">← Go Back</button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    main {
      flex: 1;
      overflow: auto;
      padding: 32px;
    }
  `]
})
export class SymptomCheckerComponent {}
