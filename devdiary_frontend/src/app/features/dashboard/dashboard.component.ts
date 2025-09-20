import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  loading = true;
  error?: string;
  stats: Record<string, any> = {};

  ngOnInit(): void {
    this.api.getDashboardStats().subscribe({
      next: (s) => { this.stats = s || {}; this.loading = false; },
      error: () => { this.error = 'Failed to load dashboard'; this.loading = false; }
    });
  }
}
