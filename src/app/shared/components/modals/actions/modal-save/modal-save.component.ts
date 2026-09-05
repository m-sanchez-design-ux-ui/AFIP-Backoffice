import { Component, inject, Input } from '@angular/core';
import { ModalService } from 'app/shared/services/modal/modal.service';

@Component({
  selector: 'app-modal-save',
  standalone: true,
  imports: [],
  templateUrl: './modal-save.component.html',
})
export class ModalSaveComponent {
  @Input() modalSaveText = '';
  @Input() modalSaveTitle = '';
  @Input() idModal = '';

  private readonly modalService = inject(ModalService);

  closeModal() {
    this.modalService.close(this.idModal);
  }
}
