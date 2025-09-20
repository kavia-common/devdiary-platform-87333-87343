import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ApiService, ActivityItem } from '../api.service';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './activity-feed.component.html',
  styleUrls: ['./activity-feed.component.css']
})
export class ActivityFeedComponent implements OnInit {
  private api = inject(ApiService);
  loading = true;
  items: ActivityItem[] = [];
  error?: string;

  ngOnInit(): void {
    this.api.getActivityFeed(20).subscribe({
      next: (data) => { this.items = data; this.loading = false; },
      error: () => { this.error = 'Failed to load activity.'; this.loading = false; }
    });
  }
}
