import { Component, Input } from '@angular/core';
import { ModalService } from '../../../services/modal/modal.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-modal-error-import',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './modal-error-import.component.html',
})
export class ModalErrorImportComponent {
  @Input() idModal = 'modalErrorImport';
  @Input() checksErrors?: string[];
  @Input() paymentOrdersErrors?: string[];

  constructor(private readonly modalService: ModalService) {}

  closeModal() {
    this.modalService.close(this.idModal);
  }
}
