import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDheaderComponent } from './admin-dheader.component';

describe('AdminDheaderComponent', () => {
  let component: AdminDheaderComponent;
  let fixture: ComponentFixture<AdminDheaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDheaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
