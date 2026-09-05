import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrorImportComponent } from './modal-error-import.component';

describe('ModalErrorImportComponent', () => {
  let component: ModalErrorImportComponent;
  let fixture: ComponentFixture<ModalErrorImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalErrorImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalErrorImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
