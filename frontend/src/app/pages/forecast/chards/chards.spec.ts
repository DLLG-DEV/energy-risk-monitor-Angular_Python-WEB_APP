import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Chards } from './chards';

describe('Chards', () => {
  let component: Chards;
  let fixture: ComponentFixture<Chards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Chards],
    }).compileComponents();

    fixture = TestBed.createComponent(Chards);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
