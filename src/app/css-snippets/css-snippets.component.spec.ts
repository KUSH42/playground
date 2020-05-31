import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CssSnippetsComponent } from './css-snippets.component';

describe('CssSnippetsComponent', () => {
  let component: CssSnippetsComponent;
  let fixture: ComponentFixture<CssSnippetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CssSnippetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CssSnippetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
