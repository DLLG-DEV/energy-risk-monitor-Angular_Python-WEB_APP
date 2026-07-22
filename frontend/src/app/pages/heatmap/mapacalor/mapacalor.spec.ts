import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mapacalor } from './mapacalor';

describe('Mapacalor', () => {
  let component: Mapacalor;
  let fixture: ComponentFixture<Mapacalor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mapacalor],
    }).compileComponents();

    fixture = TestBed.createComponent(Mapacalor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
