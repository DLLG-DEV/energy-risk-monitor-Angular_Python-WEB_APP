import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TAbleEvents } from './table-events';

describe('TAbleEvents', () => {
  let component: TAbleEvents;
  let fixture: ComponentFixture<TAbleEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TAbleEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(TAbleEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
