/* eslint-env jasmine */
/* global describe, beforeEach, it, expect */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-dummy',
  template: '<div>dummy</div>'
})
class DummyComponent {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent, DummyComponent],
      providers: [provideRouter([{ path: 'dummy', component: DummyComponent }])]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should toggle full screen and hide rightbar', () => {
    // Initially rightbar visible
    expect(component.isFullScreen).toBeFalse();
    expect(fixture.nativeElement.querySelector('.rightbar')).toBeTruthy();

    component.toggleFullScreen();
    fixture.detectChanges();

    expect(component.isFullScreen).toBeTrue();
    expect(fixture.nativeElement.querySelector('.rightbar')).toBeNull();

    component.toggleFullScreen();
    fixture.detectChanges();

    expect(component.isFullScreen).toBeFalse();
    expect(fixture.nativeElement.querySelector('.rightbar')).toBeTruthy();
  });
});
