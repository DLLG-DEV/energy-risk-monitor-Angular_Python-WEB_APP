import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMap } from './risk-map';

describe('RiskMap', () => {
  let component: RiskMap;
  let fixture: ComponentFixture<RiskMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskMap],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
