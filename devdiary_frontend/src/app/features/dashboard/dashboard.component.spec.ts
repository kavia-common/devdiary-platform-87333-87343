/* eslint-env jasmine */
/* global describe, beforeEach, it, expect, jasmine */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { ApiService } from '../../shared/api.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class ApiMock {
  getDashboardStats = jasmine.createSpy().and.returnValue(of({ entries7d: 3, activeDays30d: 5, topTag: 'refactor' }));
}

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;
  let component: DashboardComponent;
  let api: ApiMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [{ provide: ApiService, useClass: ApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiMock;
  });

  it('should render stats on success', fakeAsync(() => {
    fixture.detectChanges(); // ngOnInit
    tick();
    expect(api.getDashboardStats).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    fixture.detectChanges();

    const values = fixture.debugElement.queryAll(By.css('.value'));
    const text = values.map(v => (v.nativeElement as HTMLElement).textContent?.trim());
    expect(text.join(' ')).toContain('3');
    expect(text.join(' ')).toContain('5');
    expect(text.join(' ')).toContain('refactor');
  }));

  it('should show error on failure', fakeAsync(() => {
    api.getDashboardStats.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges(); // ngOnInit
    tick();
    expect(component.error).toContain('Failed to load dashboard');
  }));
});
