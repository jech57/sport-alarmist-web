import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Tournament } from './tournament';

describe('Tournament', () => {
  let component: Tournament;
  let fixture: ComponentFixture<Tournament>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tournament],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tournament);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
