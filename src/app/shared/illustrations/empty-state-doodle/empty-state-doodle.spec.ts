import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateDoodle } from './empty-state-doodle';

describe('EmptyStateDoodle', () => {
  let component: EmptyStateDoodle;
  let fixture: ComponentFixture<EmptyStateDoodle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateDoodle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyStateDoodle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
