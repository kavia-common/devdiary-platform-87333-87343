/* eslint-env jasmine */
/* global describe, beforeEach, it, expect, jasmine */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SummariesComponent } from './summaries.component';
import { ApiService, Summary } from '../../shared/api.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class ApiMock {
  generateStandupSummary = jasmine.createSpy().and.callFake(({ from, to }: { from: string; to: string; }) => {
    const mock: Summary = {
      dateRange: { from, to },
      highlights: ['did A'],
      blockers: ['B'],
      plans: ['C'],
    };
    return of(mock);
  });
}

describe('SummariesComponent', () => {
  let fixture: ComponentFixture<SummariesComponent>;
  let component: SummariesComponent;
  let api: ApiMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummariesComponent],
      providers: [{ provide: ApiService, useClass: ApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(SummariesComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiMock;
    fixture.detectChanges();
  });

  it('should generate summary and render sections', fakeAsync(() => {
    component.generate();
    tick();
    expect(api.generateStandupSummary).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.summary).toBeTruthy();

    fixture.detectChanges();
    const highlights = fixture.debugElement.queryAll(By.css('.summary-grid li'));
    expect(highlights.length).toBeGreaterThan(0);
  }));

  it('should set error when generation fails', fakeAsync(() => {
    api.generateStandupSummary.and.returnValue(throwError(() => new Error('fail')));
    component.generate();
    tick();
    expect(component.error).toContain('Failed to generate summary');
    expect(component.loading).toBeFalse();
    expect(component.summary).toBeUndefined();
  }));
});
