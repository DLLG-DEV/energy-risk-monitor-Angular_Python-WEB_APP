import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enviados } from './enviados';

describe('Enviados', () => {
  let component: Enviados;
  let fixture: ComponentFixture<Enviados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enviados],
    }).compileComponents();

    fixture = TestBed.createComponent(Enviados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
