/* eslint-env jasmine */
/* global describe, beforeEach, it, expect */
import { TestBed } from '@angular/core/testing';
import { routes } from './app.routes';
import { provideRouter, Router } from '@angular/router';

describe('App Routes', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)]
    }).compileComponents();
    router = TestBed.inject(Router);
  });

  it('should redirect empty path to /diary', async () => {
    const nav = await router.navigateByUrl('');
    expect(nav).toBeTrue();
    expect(router.url).toBe('/diary');
  });
});
