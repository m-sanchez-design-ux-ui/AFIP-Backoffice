import { CommonModule, DatePipe, formatDate } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { IFilters } from 'app/dashboard/interface/filters.interface';
import { ICompanyCuil } from 'app/shared/interfaces/filters/company-cuil.interface';
import { FilterService } from 'app/shared/services/filter/filter.service';
import { ICompanyPos } from 'app/shared/interfaces/filters/company-pos.interface';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DatepickerEsComponent } from '../datepicker-es/datepicker-es.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [
    FeatherModule,
    CommonModule,
    ReactiveFormsModule,
    AutocompleteComponent,
    DatepickerEsComponent,
  ],
  providers: [DatePipe],
  templateUrl: './filter.component.html',
})
export class FilterComponent implements OnInit {
  @Input() statusList: string[] = [];
  @Output() filterEmmiter = new EventEmitter<IFilters>();

  fb = inject(FormBuilder);
  _companyServices = inject(FilterService);

  cuit = signal<ICompanyCuil>({ results: [] });
  pos = signal<ICompanyPos>({ results: [] });
  datePickerErrorMessage = signal<string | null>(null);

  public filterForm: FormGroup = this.fb.group({
    CUIT: '',
    pointOfSaleNo: [{ value: '-1', disabled: true }],
    state: '-1',
    dateFrom: 'dd/mm/aaaa',
    dateTo: 'dd/mm/aaaa',
  });

  isExpanded = false;

  toggleAccordion() {
    this.isExpanded = !this.isExpanded;
  }

  statusFilter: number = 0;

  ngOnInit(): void {
    this._companyServices.getCompanyCuil().subscribe({
      next: (data) => {
        this.cuit.set(data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  cleanPosSelect = () => {
    this.pos.set({ results: [] });
    this.filterForm.controls['pointOfSaleNo'].disable();
    this.filterForm.controls['pointOfSaleNo'].setValue('-1');
    this.filterForm.controls['CUIT'].setValue('');
  };

  onCuitInputChange = (event: string) => {
    if (event === '') {
      this.cleanPosSelect();
      return;
    }
    const idCuil = this.cuit().results.find((cuit) => cuit.cuit === event);

    if (idCuil) {
      this.filterForm.controls['CUIT'].setValue(event);
      this._companyServices.getCompanyPos(idCuil.id).subscribe((data) => {
        if (data.results.length > 0) {
          this.filterForm.controls['pointOfSaleNo'].enable();
          this.filterForm.controls['pointOfSaleNo'].setValue('-1');
          this.pos.set(data);
        }
      });
    } else {
      this.cleanPosSelect();
    }
  };

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
    const buttonReset = document.querySelector('.select2-selection__reset') as HTMLButtonElement

    if (buttonReset) {
      buttonReset.click();
    }
    const endInput = document.getElementById(
      'datePickerEnd'
    ) as HTMLInputElement;
    endInput.value = 'dd/mm/aaaa';
    const startInput = document.getElementById(
      'datePickerStart'
    ) as HTMLInputElement;
    startInput.value = 'dd/mm/aaaa';
    
    this.filterForm.reset({
      CUIT: '',
      pointOfSaleNo: [{ value: -1, disabled: true }],
      state: -1,
      dateFrom: 'dd/mm/aaaa',
      dateTo: 'dd/mm/aaaa',
    });

    this.cleanPosSelect();

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
