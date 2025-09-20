import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

/**
 * API base URL is read from environment variable at runtime if provided via window object.
 * For deployment, ensure to define window.__DEV_DIARY_API__ in index.html or server injection.
 * Fallback to '/api' which can be proxied to devdiary_backend.
 */
function getApiBase(): string {
  // Use globalThis to be SSR-safe and guard for non-browser environments
  const g: any = (typeof globalThis !== 'undefined' ? (globalThis as any) : {});
  return (g && g.__DEV_DIARY_API__ as string) || '/api';
}

export interface DiaryEntry {
  id?: string;
  date: string;
  text: string;
  tags?: string[];
  mood?: string;
}

export interface Summary {
  dateRange: { from: string; to: string };
  highlights: string[];
  blockers: string[];
  plans: string[];
}

export interface IntegrationConfig {
  id: string;
  name: string;
  connected: boolean;
  details?: Record<string, unknown>;
}

export interface ActivityItem {
  id: string;
  time: string;
  source: string;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = getApiBase();

  // PUBLIC_INTERFACE
  createEntry(entry: DiaryEntry): Observable<DiaryEntry> {
    /** Create a diary entry. */
    return this.http.post<DiaryEntry>(`${this.base}/entries`, entry);
  }

  // PUBLIC_INTERFACE
  listEntries(date?: string): Observable<DiaryEntry[]> {
    /** List diary entries optionally filtered by date (YYYY-MM-DD). */
    let params = new HttpParams();
    if (date) params = params.set('date', date);
    return this.http.get<DiaryEntry[]>(`${this.base}/entries`, { params });
  }

  // PUBLIC_INTERFACE
  generateStandupSummary(range: { from: string; to: string }): Observable<Summary> {
    /** Request a stand-up style summary for a date range. */
    return this.http.post<Summary>(`${this.base}/summaries/standup`, range);
  }

  // PUBLIC_INTERFACE
  getIntegrations(): Observable<IntegrationConfig[]> {
    /** Retrieve configured integrations and their statuses. */
    return this.http.get<IntegrationConfig[]>(`${this.base}/integrations`);
  }

  // PUBLIC_INTERFACE
  connectIntegration(id: string, payload: Record<string, unknown>): Observable<IntegrationConfig> {
    /** Connect or update a specific integration. */
    return this.http.post<IntegrationConfig>(`${this.base}/integrations/${id}/connect`, payload);
  }

  // PUBLIC_INTERFACE
  getActivityFeed(limit = 20): Observable<ActivityItem[]> {
    /** Get latest activity items for the passive right sidebar feed. */
    return this.http.get<ActivityItem[]>(`${this.base}/activity`, { params: new HttpParams().set('limit', limit) })
      .pipe(map(items => items ?? []));
  }

  // PUBLIC_INTERFACE
  getDashboardStats(): Observable<Record<string, unknown>> {
    /** Get analytics data for dashboard charts. */
    return this.http.get<Record<string, unknown>>(`${this.base}/dashboard/stats`);
  }
}
