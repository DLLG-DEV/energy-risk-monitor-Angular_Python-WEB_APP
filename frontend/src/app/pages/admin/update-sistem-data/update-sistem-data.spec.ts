import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSistemData } from './update-sistem-data';

describe('UpdateSistemData', () => {
  let component: UpdateSistemData;
  let fixture: ComponentFixture<UpdateSistemData>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSistemData],
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateSistemData);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
