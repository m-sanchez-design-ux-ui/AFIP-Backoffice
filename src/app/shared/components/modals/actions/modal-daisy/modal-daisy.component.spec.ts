import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDaisyComponent } from './modal-daisy.component';

describe('ModalDaisyComponent', () => {
  let component: ModalDaisyComponent;
  let fixture: ComponentFixture<ModalDaisyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDaisyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDaisyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
