import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, Summary } from '../../shared/api.service';

@Component({
  standalone: true,
  selector: 'app-summaries',
  imports: [CommonModule, FormsModule],
  templateUrl: './summaries.component.html',
  styleUrls: ['./summaries.component.css']
})
export class SummariesComponent {
  private api = inject(ApiService);

  from = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  to = new Date().toISOString().slice(0, 10);
  loading = false;
  summary?: Summary;
  error?: string;

  // PUBLIC_INTERFACE
  generate(): void {
    /** Generate a stand-up summary for the date range. */
    this.loading = true; this.error = undefined; this.summary = undefined;
    this.api.generateStandupSummary({ from: this.from, to: this.to }).subscribe({
      next: (s) => this.summary = s,
      error: () => this.error = 'Failed to generate summary',
      complete: () => this.loading = false
    });
  }
}
