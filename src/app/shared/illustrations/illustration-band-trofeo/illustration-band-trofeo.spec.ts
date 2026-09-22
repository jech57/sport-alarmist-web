import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IllustrationBandTrofeo } from './illustration-band-trofeo';

describe('IllustrationBandTrofeo', () => {
  let component: IllustrationBandTrofeo;
  let fixture: ComponentFixture<IllustrationBandTrofeo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IllustrationBandTrofeo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IllustrationBandTrofeo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
