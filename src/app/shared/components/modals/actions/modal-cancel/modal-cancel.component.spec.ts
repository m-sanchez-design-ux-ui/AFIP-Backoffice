import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCancelComponent } from 'app/shared/components/modals/actions/modal-cancel/modal-cancel.component';

describe('ModalCancelComponent', () => {
  let component: ModalCancelComponent;
  let fixture: ComponentFixture<ModalCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCancelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
