import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ActivityFeedComponent } from '../shared/activity-feed/activity-feed.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ActivityFeedComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isFullScreen = false;

  // PUBLIC_INTERFACE
  toggleFullScreen(): void {
    /** Toggle right sidebar visibility for focused presentation mode. */
    this.isFullScreen = !this.isFullScreen;
  }
}
