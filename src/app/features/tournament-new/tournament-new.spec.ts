import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentNew } from './tournament-new';

describe('TournamentNew', () => {
  let component: TournamentNew;
  let fixture: ComponentFixture<TournamentNew>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentNew]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentNew);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
