import { Injectable } from '@angular/core';
import { ModalInterface } from 'flowbite';
import { Modal } from 'flowbite';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor(){}

  private selectModal(idModal: string){
    const modalElement: HTMLElement | null = document.getElementById(idModal);
    const modal: ModalInterface = new Modal(modalElement); 
    return modal;
  }

  open(idModal: string){
    const modal = this.selectModal(idModal)
    modal.show();
  }

  close(idModal: string){
    const modal = this.selectModal(idModal)
    modal.hide();
  }

}
