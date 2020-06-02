import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticleBannerComponent } from './particle-banner.component';

describe('ParticleBannerComponent', () => {
  let component: ParticleBannerComponent;
  let fixture: ComponentFixture<ParticleBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticleBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticleBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
