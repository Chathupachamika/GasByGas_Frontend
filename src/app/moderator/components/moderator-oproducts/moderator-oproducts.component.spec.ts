import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorOproductsComponent } from './moderator-oproducts.component';

describe('ModeratorOproductsComponent', () => {
  let component: ModeratorOproductsComponent;
  let fixture: ComponentFixture<ModeratorOproductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorOproductsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorOproductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
