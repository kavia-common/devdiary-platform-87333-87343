/* eslint-env jasmine */
/* global describe, beforeEach, it, expect, jasmine */
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IntegrationsComponent } from './integrations.component';
import { ApiService, IntegrationConfig } from '../../shared/api.service';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class ApiMock {
  getIntegrations = jasmine.createSpy().and.returnValue(of<IntegrationConfig[]>([
    { id: 'gh', name: 'GitHub', connected: false },
    { id: 'jira', name: 'Jira', connected: true },
  ]));
  connectIntegration = jasmine.createSpy().and.returnValue(of({ id: 'gh', name: 'GitHub', connected: true }));
}

describe('IntegrationsComponent', () => {
  let fixture: ComponentFixture<IntegrationsComponent>;
  let component: IntegrationsComponent;
  let api: ApiMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegrationsComponent],
      providers: [{ provide: ApiService, useClass: ApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(IntegrationsComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiMock;
    fixture.detectChanges();
  });

  it('should load integrations on init and render tiles', () => {
    expect(api.getIntegrations).toHaveBeenCalled();
    fixture.detectChanges();
    const tiles = fixture.debugElement.queryAll(By.css('.tile'));
    expect(tiles.length).toBe(2);
  });

  it('select should set selected and reset form', () => {
    const integ: IntegrationConfig = { id: 'gh', name: 'GitHub', connected: false };
    component.form = { token: 't', project: 'p' };
    component.select(integ);
    expect(component.selected).toEqual(integ);
    expect(component.form).toEqual({ token: '', project: '' });
  });

  it('connect should call ApiService and reload on success', fakeAsync(() => {
    const listSubject = new Subject<IntegrationConfig[]>();
    api.getIntegrations.and.returnValue(listSubject.asObservable());

    component.select({ id: 'gh', name: 'GitHub', connected: false });
    component.form = { token: 'abc', project: '' };
    component.connect();
    expect(api.connectIntegration).toHaveBeenCalledWith('gh', { token: 'abc', project: '' });

    // After connect, reload is called which triggers getIntegrations
    listSubject.next([{ id: 'gh', name: 'GitHub', connected: true }]);
    listSubject.complete();
    tick();
    expect(component.list.length).toBe(1);
  }));

  it('connect should set error when Api fails', fakeAsync(() => {
    component.select({ id: 'gh', name: 'GitHub', connected: false });
    api.connectIntegration.and.returnValue(throwError(() => new Error('fail')));
    component.connect();
    tick();
    expect(component.error).toContain('Failed to connect integration');
  }));
});
