/* eslint-env jasmine */
/* global describe, beforeEach, afterEach, it, expect */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiService, DiaryEntry, Summary, IntegrationConfig, ActivityItem } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  const base = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('createEntry should POST to /entries', () => {
    const entry: DiaryEntry = { date: '2025-01-01', text: 'did work' };
    let resp: DiaryEntry | undefined;
    service.createEntry(entry).subscribe(r => resp = r);

    const req = httpMock.expectOne(`${base}/entries`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(entry);
    const mock: DiaryEntry = { ...entry, id: '1' };
    req.flush(mock);
    expect(resp).toEqual(mock);
  });

  it('listEntries should GET /entries with date param', () => {
    let resp: DiaryEntry[] | undefined;
    service.listEntries('2025-01-02').subscribe(r => resp = r);

    const req = httpMock.expectOne(r => r.url === `${base}/entries` && r.params.get('date') === '2025-01-02');
    expect(req.request.method).toBe('GET');
    const mock: DiaryEntry[] = [{ id: '1', date: '2025-01-02', text: 'x' }];
    req.flush(mock);
    expect(resp).toEqual(mock);
  });

  it('generateStandupSummary should POST to /summaries/standup', () => {
    let resp: Summary | undefined;
    service.generateStandupSummary({ from: '2025-01-01', to: '2025-01-07' }).subscribe(r => resp = r);

    const req = httpMock.expectOne(`${base}/summaries/standup`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ from: '2025-01-01', to: '2025-01-07' });
    const mock: Summary = {
      dateRange: { from: '2025-01-01', to: '2025-01-07' },
      highlights: ['a'], blockers: [], plans: []
    };
    req.flush(mock);
    expect(resp).toEqual(mock);
  });

  it('getIntegrations should GET /integrations', () => {
    let resp: IntegrationConfig[] | undefined;
    service.getIntegrations().subscribe(r => resp = r);

    const req = httpMock.expectOne(`${base}/integrations`);
    expect(req.request.method).toBe('GET');
    const mock: IntegrationConfig[] = [{ id: 'gh', name: 'GitHub', connected: true }];
    req.flush(mock);
    expect(resp).toEqual(mock);
  });

  it('connectIntegration should POST to /integrations/:id/connect', () => {
    let resp: IntegrationConfig | undefined;
    service.connectIntegration('gh', { token: 'abc' }).subscribe(r => resp = r);

    const req = httpMock.expectOne(`${base}/integrations/gh/connect`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ token: 'abc' });
    const mock: IntegrationConfig = { id: 'gh', name: 'GitHub', connected: true };
    req.flush(mock);
    expect(resp).toEqual(mock);
  });

  it('getActivityFeed should GET /activity with limit param and default to [] if null', () => {
    let resp: ActivityItem[] | undefined;
    service.getActivityFeed(20).subscribe(r => resp = r);

    const req = httpMock.expectOne(r => r.url === `${base}/activity` && r.params.get('limit') === '20');
    expect(req.request.method).toBe('GET');
    // Simulate backend returning null/undefined -> API maps to []
    req.flush(null);
    expect(resp).toEqual([]);
  });

  it('getDashboardStats should GET /dashboard/stats', () => {
    let resp: Record<string, unknown> | undefined;
    service.getDashboardStats().subscribe(r => resp = r);

    const req = httpMock.expectOne(`${base}/dashboard/stats`);
    expect(req.request.method).toBe('GET');
    const mock = { entries7d: 5, activeDays30d: 10, topTag: 'infra' };
    req.flush(mock);
    expect(resp).toEqual(mock);
  });
});
