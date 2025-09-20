/* eslint-env jasmine */
/* global describe, beforeEach, it, expect, jasmine */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ActivityFeedComponent } from './activity-feed.component';
import { ApiService, ActivityItem } from '../api.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class ApiMock {
  getActivityFeed = jasmine.createSpy().and.returnValue(of<ActivityItem[]>([
    { id: '1', source: 'GitHub', time: new Date().toISOString(), text: 'PR opened' },
  ]));
}

describe('ActivityFeedComponent', () => {
  let fixture: ComponentFixture<ActivityFeedComponent>;
  let component: ActivityFeedComponent;
  let api: ApiMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFeedComponent],
      providers: [{ provide: ApiService, useClass: ApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityFeedComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiMock;
  });

  it('should load and render items', fakeAsync(() => {
    fixture.detectChanges(); // triggers ngOnInit
    tick();
    expect(api.getActivityFeed).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.items.length).toBe(1);

    fixture.detectChanges();
    const items = fixture.debugElement.queryAll(By.css('.item'));
    expect(items.length).toBe(1);
  }));

  it('should show error if api fails', fakeAsync(() => {
    api.getActivityFeed.and.returnValue(throwError(() => new Error('fail')));
    fixture.detectChanges(); // ngOnInit
    tick();
    expect(component.error).toContain('Failed to load activity.');
  }));
});
