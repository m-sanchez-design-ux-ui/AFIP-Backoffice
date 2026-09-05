import { Component, inject, Input } from '@angular/core';

import { ModalService } from 'app/shared/services/modal/modal.service';

@Component({
  selector: 'app-modal-cancel',
  standalone: true,
  imports: [],
  templateUrl: './modal-cancel.component.html',
})
export class ModalCancelComponent {
  @Input() modalCancelText = '';
  @Input() modalCancelTitle = '';
  @Input() idModal = '';

  private readonly modalService = inject(ModalService);

  closeModal() {
    this.modalService.close(this.idModal);
  }
}
