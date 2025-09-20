import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService, DiaryEntry } from '../../shared/api.service';

@Component({
  standalone: true,
  selector: 'app-diary',
  imports: [CommonModule, FormsModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent {
  private api = inject(ApiService);

  today = new Date().toISOString().slice(0, 10);
  text = '';
  tags = '';
  mood = '';
  saving = false;
  entries: DiaryEntry[] = [];
  error?: string;

  constructor() {
    this.refresh();
  }

  // PUBLIC_INTERFACE
  addEntry(): void {
    /** Create a new diary entry for today. */
    const entry: DiaryEntry = {
      date: this.today,
      text: this.text.trim(),
      tags: this.tags ? this.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      mood: this.mood || undefined
    };
    if (!entry.text) return;
    this.saving = true;
    this.api.createEntry(entry).subscribe({
      next: () => {
        this.text = ''; this.tags = ''; this.mood = '';
        this.refresh();
      },
      error: () => { this.error = 'Failed to save entry'; this.saving = false; },
      complete: () => (this.saving = false)
    });
  }

  // PUBLIC_INTERFACE
  refresh(): void {
    /** Load entries for selected date. */
    this.api.listEntries(this.today).subscribe({
      next: (data) => (this.entries = data ?? []),
      error: () => (this.error = 'Failed to load entries')
    });
  }
}
