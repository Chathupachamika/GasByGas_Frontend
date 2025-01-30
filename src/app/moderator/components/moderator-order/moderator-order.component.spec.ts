import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorOrderComponent } from './moderator-order.component';

describe('ModeratorOrderComponent', () => {
  let component: ModeratorOrderComponent;
  let fixture: ComponentFixture<ModeratorOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModeratorOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModeratorOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
