import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, IntegrationConfig } from '../../shared/api.service';

@Component({
  standalone: true,
  selector: 'app-integrations',
  imports: [CommonModule, FormsModule],
  templateUrl: './integrations.component.html',
  styleUrls: ['./integrations.component.css']
})
export class IntegrationsComponent {
  private api = inject(ApiService);

  loading = true;
  error?: string;
  list: IntegrationConfig[] = [];

  form: Record<string, any> = { token: '', project: '' };
  selected?: IntegrationConfig;

  constructor() {
    this.reload();
  }

  // PUBLIC_INTERFACE
  reload(): void {
    /** Load integrations from backend. */
    this.loading = true;
    this.api.getIntegrations().subscribe({
      next: (l) => { this.list = l; this.loading = false; },
      error: () => { this.error = 'Failed to load integrations'; this.loading = false; }
    });
  }

  // PUBLIC_INTERFACE
  select(integ: IntegrationConfig): void {
    /** Select an integration for configuration. */
    this.selected = integ;
    this.form = { token: '', project: '' };
  }

  // PUBLIC_INTERFACE
  connect(): void {
    /** Connect or update selected integration. */
    if (!this.selected) return;
    this.api.connectIntegration(this.selected.id, this.form).subscribe({
      next: () => this.reload(),
      error: () => this.error = 'Failed to connect integration'
    });
  }
}
