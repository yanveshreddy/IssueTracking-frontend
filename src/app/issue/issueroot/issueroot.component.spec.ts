import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuerootComponent } from './issueroot.component';

describe('IssuerootComponent', () => {
  let component: IssuerootComponent;
  let fixture: ComponentFixture<IssuerootComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuerootComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuerootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
