import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedCollapseArrowComponent } from './animated-collapse-arrow.component';

describe('AnimatedCollapseArrowComponent', () => {
  let component: AnimatedCollapseArrowComponent;
  let fixture: ComponentFixture<AnimatedCollapseArrowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedCollapseArrowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedCollapseArrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
