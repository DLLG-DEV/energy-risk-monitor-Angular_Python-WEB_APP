import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchEvents } from './search-events';

describe('SearchEvents', () => {
  let component: SearchEvents;
  let fixture: ComponentFixture<SearchEvents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchEvents],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchEvents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
