import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'})export class LocaleService {
  getLocale(): string {
    return navigator.language || 'en-US'; // Retorna la cultura del navegador o 'en-US' por defecto
  }
}