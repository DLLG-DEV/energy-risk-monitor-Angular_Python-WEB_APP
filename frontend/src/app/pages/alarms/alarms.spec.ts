import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Alarms } from './alarms';

describe('Alarms', () => {
  let component: Alarms;
  let fixture: ComponentFixture<Alarms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Alarms],
    }).compileComponents();

    fixture = TestBed.createComponent(Alarms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
