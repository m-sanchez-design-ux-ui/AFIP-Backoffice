import { Component, inject, Input } from '@angular/core';
import { ModalService } from 'app/shared/services/modal/modal.service';

@Component({
  selector: 'app-modal-delete',
  standalone: true,
  imports: [],
  templateUrl: './modal-delete.component.html',
})
export class ModalDeleteComponent {
  @Input() modalDeleteText = '';
  @Input() modalDeleteTitle = '';
  @Input() idModal = '';

  private readonly modalService = inject(ModalService);

  closeModal() {
    this.modalService.close(this.idModal);
  }
}
