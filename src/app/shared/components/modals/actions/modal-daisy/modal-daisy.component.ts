import { Component, inject, Input } from '@angular/core';
import { ModalService } from 'app/shared/services/modal/modal.service';

@Component({
  selector: 'app-modal-daisy',
  standalone: true,
  imports: [],
  templateUrl: './modal-daisy.component.html',
})
export class ModalDaisyComponent {
  modalService = inject(ModalService);

  @Input() idModal = '';

  closeModal() {
    this.modalService.close(this.idModal);
  }
}
