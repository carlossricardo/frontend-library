import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCategoryClientComponent } from './book-category-client.component';

describe('BookCategoryClientComponent', () => {
  let component: BookCategoryClientComponent;
  let fixture: ComponentFixture<BookCategoryClientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookCategoryClientComponent]
    });
    fixture = TestBed.createComponent(BookCategoryClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
