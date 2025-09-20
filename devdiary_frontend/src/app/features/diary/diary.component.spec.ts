/* eslint-env jasmine */
/* global describe, beforeEach, it, expect, jasmine */
/// <reference lib="dom" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DiaryComponent } from './diary.component';
import { ApiService, DiaryEntry } from '../../shared/api.service';
import { of, Subject, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

class ApiMock {
  createEntry = jasmine.createSpy().and.returnValue(of({ id: '1' }));
  listEntries = jasmine.createSpy().and.returnValue(of<DiaryEntry[]>([]));
}

describe('DiaryComponent', () => {
  let fixture: ComponentFixture<DiaryComponent>;
  let component: DiaryComponent;
  let api: ApiMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiaryComponent],
      providers: [{ provide: ApiService, useClass: ApiMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(DiaryComponent);
    component = fixture.componentInstance;
    api = TestBed.inject(ApiService) as unknown as ApiMock;
    fixture.detectChanges();
  });

  it('should create and load entries on init', () => {
    expect(component).toBeTruthy();
    expect(api.listEntries).toHaveBeenCalled();
  });

  it('should disable Add Entry button when text is empty or whitespace', () => {
    component.text = '   ';
    fixture.detectChanges();
    const btnEl: HTMLElement = fixture.debugElement.query(By.css('.actions .btn-primary')).nativeElement as HTMLElement;
    // Disabled property exists on buttons; cast to any to avoid DOM lib type requirement in linter
    expect((btnEl as any).disabled).toBeTrue();
  });

  it('addEntry should call ApiService and clear fields on success', fakeAsync(() => {
    component.text = 'Worked on feature';
    component.tags = 'feat, ui';
    component.mood = 'happy';
    const listSubject = new Subject<DiaryEntry[]>();
    api.listEntries.and.returnValue(listSubject.asObservable());

    component.addEntry();
    expect(api.createEntry).toHaveBeenCalledWith(jasmine.objectContaining({
      text: 'Worked on feature',
      tags: ['feat', 'ui'],
      mood: 'happy'
    }));
    // After createEntry success, refresh is called -> listEntries subscription resolves
    expect(component.saving).toBeTrue();
    listSubject.next([{ id: '2', date: component.today, text: 'ex' }]);
    listSubject.complete();
    tick();
    expect(component.text).toBe('');
    expect(component.tags).toBe('');
    expect(component.mood).toBe('');
    expect(component.saving).toBeFalse();
    expect(component.entries.length).toBe(1);
  }));

  it('addEntry should set error on failure and stop saving', fakeAsync(() => {
    api.createEntry.and.returnValue(throwError(() => new Error('fail')));

    component.text = 'X';
    component.addEntry();
    tick();
    expect(component.error).toContain('Failed to save entry');
    expect(component.saving).toBeFalse();
  }));

  it('refresh should set entries and handle error', fakeAsync(() => {
    api.listEntries.and.returnValue(of([{ id: '1', date: component.today, text: 'a' }]));
    component.refresh();
    tick();
    expect(component.entries.length).toBe(1);

    api.listEntries.and.returnValue(throwError(() => new Error('err')));
    component.refresh();
    tick();
    expect(component.error).toContain('Failed to load entries');
  }));
});
