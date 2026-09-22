import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationBandCalendario } from './illustration-band-calendario';

describe('IllustrationBandCalendario', () => {
  let component: IllustrationBandCalendario;
  let fixture: ComponentFixture<IllustrationBandCalendario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustrationBandCalendario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustrationBandCalendario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
