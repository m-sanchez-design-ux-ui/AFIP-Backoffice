import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FeatherModule } from 'angular-feather';
import flatpickr from 'flatpickr';
import { Spanish } from 'flatpickr/dist/l10n/es';

@Component({
  selector: 'app-datepicker-es-02',
  standalone: true,
  imports: [CommonModule, FeatherModule],
  providers: [DatePipe],
  templateUrl: './datepicker-es-02.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerEs02Component implements OnInit {
  startDateValueChange = output<string>();
  endDateValueChange = output<string>();
  errorMessages = output<string | null>();

  endDate = signal<string>('dd/mm/aaaa');
  startDate = signal<string>('dd/mm/aaaa');

  // Inicializa los datepickers
  ngOnInit(): void {
    flatpickr('#datePickerStart', {
      locale: Spanish,
      mode: 'single',
      animate: true,
      dateFormat: 'd-m-Y',
      maxDate: 'today',
      defaultDate: 'dd/mm/aaaa',
      onChange: (selectedDates) => {
        const datePipe = new DatePipe('en-US');
        const dateStart = datePipe.transform(selectedDates[0], 'dd-MM-yyyy');
        const dateStartSend = datePipe.transform(
          selectedDates[0],
          'yyyy-MM-dd'
        );
        const endInput = document.getElementById(
          'datePickerEnd'
        ) as HTMLInputElement;

        this.startDateValueChange.emit(dateStartSend ?? '');
        this.startDate.set(dateStart ?? '');

        if (this.endDate() !== 'dd/mm/aaaa') {
          const isStartDateBeforeEndDate = this.isStartDateBeforeEndDate(
            dateStart!,
            this.endDate()
          );
          if (!isStartDateBeforeEndDate) {
            endInput.value = 'dd/mm/aaaa';
            this.endDate.set('dd/mm/aaaa');
          }
        }

        flatpickr('#datePickerEnd', {
          locale: Spanish,
          mode: 'single',
          animate: true,
          dateFormat: 'd-m-Y',
          maxDate: 'today',
          minDate: dateStart!,
          defaultDate: 'dd/mm/aaaa',
          onChange: (selectedDates) => {
            const datePipe = new DatePipe('en-US');
            const dateEndSend = datePipe.transform(
              selectedDates[0],
              'yyyy-MM-dd'
            );
            const dateEnd = datePipe.transform(selectedDates[0], 'dd-MM-yyyy');
            this.endDateValueChange.emit(dateEndSend ?? '');
            this.endDate.set(dateEnd ?? '');
          },
        });
      },
    });

    flatpickr('#datePickerEnd', {
      locale: Spanish,
      mode: 'single',
      animate: true,
      dateFormat: 'd-m-Y',
      maxDate: 'today',
      defaultDate: 'dd/mm/aaaa',
      onChange: (selectedDates) => {
        const datePipe = new DatePipe('en-US');
        const dateEndSend = datePipe.transform(selectedDates[0], 'yyyy-MM-dd');
        const dateEnd = datePipe.transform(selectedDates[0], 'dd-MM-yyyy');
        this.endDateValueChange.emit(dateEndSend ?? '');
        this.endDate.set(dateEnd ?? '');
      },
    });
  }

  isStartDateBeforeEndDate(startDate: string, endDate: string): boolean {
    // Convierte las fechas de dd-MM-yyyy a Date
    const parseDate = (dateStr: string) => {
      const [day, month, year] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // `month - 1` porque los meses son base 0
    };

    const start = parseDate(startDate);
    const end = parseDate(endDate);
    console.log({ start });
    console.log({ end });
    // Retorna true si la fecha de inicio es menor o igual que la de fin
    return start <= end;
  }
}
