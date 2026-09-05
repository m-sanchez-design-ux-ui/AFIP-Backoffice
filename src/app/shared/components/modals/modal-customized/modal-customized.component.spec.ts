import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCustomizedComponent } from './modal-customized.component';

describe('ModalCustomizedComponent', () => {
  let component: ModalCustomizedComponent;
  let fixture: ComponentFixture<ModalCustomizedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCustomizedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCustomizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
