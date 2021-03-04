import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerBeneficioComponent } from './ver-beneficio.component';

describe('VerBeneficioComponent', () => {
  let component: VerBeneficioComponent;
  let fixture: ComponentFixture<VerBeneficioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerBeneficioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerBeneficioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
