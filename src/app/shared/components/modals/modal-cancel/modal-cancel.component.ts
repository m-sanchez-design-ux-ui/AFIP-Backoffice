import { Component, input, output } from '@angular/core';
import { ModalsFrameComponent } from '../modals-frame/modals-frame.component';
import { FeatherModule } from 'angular-feather';

@Component({
  selector: 'app-modal-cancel',
  standalone: true,
  imports: [ModalsFrameComponent, FeatherModule],
  templateUrl: './modal-cancel.component.html',
  styleUrl: './modal-cancel.component.css',
})
export class ModalCancelComponent {
  cancel = output<any>();

  modalCancelText = input<any>();
  modalCancelTitle = input<any>();

  public onCancel() {
    this.cancel.emit(true);
    // TODO: implementar Tailwind para los modals

    // (<any>$('#ModalCancel')).modal('hide');
  }
}
