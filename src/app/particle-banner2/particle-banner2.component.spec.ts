import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticleBanner2Component } from './particle-banner2.component';

describe('ParticleBanner2Component', () => {
  let component: ParticleBanner2Component;
  let fixture: ComponentFixture<ParticleBanner2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticleBanner2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticleBanner2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
