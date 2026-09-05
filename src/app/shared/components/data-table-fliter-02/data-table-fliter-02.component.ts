import { CommonModule, DatePipe,  } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { IFilters } from 'app/dashboard/interface/filters.interface';
import { FilterService } from 'app/shared/services/filter/filter.service';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DatepickerEs02Component } from '../datepicker-es-02/datepicker-es-02.component';

@Component({
  selector: 'app-data-table-fliter-02',
  standalone: true,
  imports: [
    FeatherModule,
    CommonModule,
    ReactiveFormsModule,
    DatepickerEs02Component,
  ],
  providers: [DatePipe],
  templateUrl: './data-table-fliter-02.component.html',
  styleUrl: './data-table-fliter-02.component.css',
})
export class DataTableFliter02Component {
  @Input() statusList: string[] = [];
  @Output() filterEmmiter = new EventEmitter<IFilters>();

  fb = inject(FormBuilder);
  _companyServices = inject(FilterService);

  datePickerErrorMessage = signal<string | null>(null);

  public filterForm: FormGroup = this.fb.group({
    Name: '',
    dateFrom: 'dd/mm/aaaa',
    dateTo: 'dd/mm/aaaa',
  });

  isExpanded = false;

  toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }

  // evento para cambiar el valor del filtro de fecha de fin
  onEndDateValueChange = (event: string) => {
    this.filterForm.controls['dateTo'].setValue(event);
  };

  // evento para cambiar el valor del filtro de fecha de inicio
  onStartDateValueChange = (event: string) => {
    this.filterForm.controls['dateFrom'].setValue(event);
  };

  // evento para recibir el mensaje de error del componente datepicker
  onErrorMessageChange(message: string) {
    this.datePickerErrorMessage.set(message);
    console.log('Mensaje de error recibido del hijo:', message);
  }

  // clear all filters
  clearFilters() {
    const endInput = document.getElementById(
      'datePickerEnd'
    ) as HTMLInputElement;
    endInput.value = 'dd/mm/aaaa';
    const startInput = document.getElementById(
      'datePickerStart'
    ) as HTMLInputElement;
    startInput.value = 'dd/mm/aaaa';

    this.filterForm.reset({
      Name: '',
      dateFrom: 'dd/mm/aaaa',
      dateTo: 'dd/mm/aaaa',
    });

    this.filterEmmiter.emit(this.filterForm.value);
  }

  // onSubmit method
  onSave(): void {
    const dateFrom = this.filterForm.controls['dateFrom'].value;
    const dateTo = this.filterForm.controls['dateTo'].value;
    if (dateFrom !== 'dd/mm/aaaa' && dateTo !== 'dd/mm/aaaa') {
      if (!this.validateDateRange(dateFrom, dateTo)) {
        this.datePickerErrorMessage.set(
          'La fecha de inicio debe ser menor o igual que la fecha de fin'
        );
        return;
      } else {
        this.datePickerErrorMessage.set(null);
      }
    }
  this.filterEmmiter.emit(this.filterForm.value);
  }

  validateDateRange(startDate: string, endDate: string): boolean {
    // Convertir las fechas a objetos Date
    const [mounthStart, dayStart, yearStart] = startDate.split('/').map(Number);
    const [mounthEnd, datEnd, yearEnd] = endDate.split('/').map(Number);

    const dateInicio = new Date(yearStart, mounthStart - 1, dayStart);
    const dateFin = new Date(yearEnd, mounthEnd - 1, datEnd);

    // Verificar si la fecha de inicio es menor que la fecha de fin
    if (dateInicio > dateFin) {
      console.log(
        'La fecha de inicio debe ser menor o igual que la fecha de fin'
      );
      return false;
    }

    return true;
  }
}
