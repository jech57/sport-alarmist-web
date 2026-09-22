import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotTexture } from './dot-texture';

describe('DotTexture', () => {
  let component: DotTexture;
  let fixture: ComponentFixture<DotTexture>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotTexture]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotTexture);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
