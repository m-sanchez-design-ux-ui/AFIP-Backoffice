import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalsFrameComponent } from './modals-frame.component';

describe('ModalsFrameComponent', () => {
  let component: ModalsFrameComponent;
  let fixture: ComponentFixture<ModalsFrameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalsFrameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalsFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
