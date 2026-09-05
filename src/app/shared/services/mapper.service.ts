import { Injectable } from '@angular/core';

import { CustomDateStruct } from 'app/shared/interfaces/datepicker/CustomDateFormat.model';

// import { NgbDatepickerI18n, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
/*Definición en DateFormatterTwoService*/

const I18N_VALUES: any = {
  es: {
    weekdays: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'],
    months: [
      'ENE',
      'FEB',
      'MAR',
      'ABR',
      'MAY',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DIC',
    ],
  },
  // other languages you would support
};

@Injectable()
export class I18n {
  language = 'es';
}

// Define custom service providing the months and weekdays translations
@Injectable({
  providedIn: 'root',
})
export class CustomDatepickerI18n {
  /*export class CustomDatepickerI18n extends AbstractDatepickerI18n {
      constructor(private _i18n: I18n) {
          super();
        }*/
  constructor(private readonly _i18n: I18n) {}

  getWeekdayLabel(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }

  getWeekdayShortName(weekday: number): string {
    return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
  }
  getMonthShortName(month: number): string {
    return I18N_VALUES[this._i18n.language].months[month - 1];
  }
  getMonthFullName(month: number): string {
    return this.getMonthShortName(month);
  }

  getDayAriaLabel(date: CustomDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`;
  }
}

@Injectable({
  providedIn: 'root',
})
export class MapperService {
  private ref: string | undefined;

  monthMapper() {
    return [
      { id: 1, name: 'Enero' },
      { id: 2, name: 'Febrero' },
      { id: 3, name: 'Marzo' },
      { id: 4, name: 'Abril' },
      { id: 5, name: 'Mayo' },
      { id: 6, name: 'Junio' },
      { id: 7, name: 'Julio' },
      { id: 8, name: 'Agosto' },
      { id: 9, name: 'Septiembre' },
      { id: 10, name: 'Octubre' },
      { id: 11, name: 'Noviembre' },
      { id: 12, name: 'Diciembre' },
    ];
  }

  monthNameMapper() {
    return {
      '01': 'Enero',
      '02': 'Febrero',
      '03': 'Marzo',
      '04': 'Abril',
      '05': 'Mayo',
      '06': 'Junio',
      '07': 'Julio',
      '08': 'Agosto',
      '09': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre',
    };
  }

  setDownloadFrom(ref: string) {
    this.ref = ref;
  }

  getDownloadFrom() {
    if (this.ref) {
      return this.ref;
    }
    return this.ref;
  }

  notificationsMapper() {
    return [
      {
        id: 1,
        name: 'Nueva solicitud de creación de contacto.',
        class: 'bg-circle--primary',
      },
      {
        id: 2,
        name: 'Nueva solicitud de actualización de contacto.',
        class: 'bg-circle--primary',
      },
      {
        id: 3,
        name: 'Nueva solicitud de eliminación de contacto.',
        class: 'bg-circle--danger',
      },
      {
        id: 4,
        name: 'Nueva solicitud de actualización de cliente.',
        class: 'bg-circle--primary',
      },
    ];
  }

  retentionClaimsMapper() {
    return {
      '1': 'Pendiente',
      '2': 'Resuelto',
      '3': 'Anulado',
    };
  }

  retentionClaimsStatusMapper() {
    return [
      { id: 1, name: 'Pendiente' },
      { id: 2, name: 'Resuelto' },
      { id: 3, name: 'Anulado' },
    ];
  }

  retentionClaimsFilterMapper() {
    return {
      issueDateFrom: 'Fecha del Reclamo | Desde',
      issueDateTo: 'Fecha del Reclamo | Hasta',
      retentionTypesNames: 'Tipo de retencion',
      retentionStatus: 'Estado del reclamo',
      amountFrom: 'Importe Retenido | Min',
      amountTo: 'Importe Retenido | Max',
    };
  }

  latePaymentClassMapper() {
    return {
      'Sin morosidad': '<span class="text-success mr--2">●</span>',
      '1 a 30 días': '<span class="text-gray mr--2">●</span>',
      '31 a 60 días': '<span class="text-info mr--2">●</span>',
      '61 a 90 días': '<span class="text-warning mr--2">●</span>',
      '91 a 120 días': '<span class="text-secondary mr--2">●</span>',
      '+120 días': '<span class="text-danger mr--2">●</span>',
      'Deuda Total': '',
    };
  }

  latePaymentBadgeClassMapper() {
    return {
      'Sin morosidad': 'class="badge bg-success"',
      '1 a 30 días': 'class="badge bg-secondary"',
      '31 a 60 días': 'class="badge bg-info"',
      '61 a 90 días': 'class="badge bg-warning"',
      '91 a 120 días': 'class="badge bg-secondary"',
      '+120 días': 'class="badge bg-danger"',
    };
  }

  periodsMapper() {
    return [
      'Sin morosidad',
      '1 a 30 días',
      '31 a 60 días',
      '61 a 90 días',
      '91 a 120 días',
      '+120 días',
    ];
  }

  latePaymentFilterMapper() {
    return {
      periodNames: 'Período de vencimiento',
      providingFrom: 'Provisión | Desde',
      providingTo: 'Provisión | Hasta',
      exchangeRateFrom: 'Diferencia de cambio | Desde',
      exchangeRateTo: 'Diferencia de cambio | Hasta',
      interestFrom: 'Intereses | Min',
      interestTo: 'Intereses | Max',
      othersFrom: 'Otros | Min',
      othersTo: 'Otros | Max',
    };
  }

  clientsStatusClassMapper() {
    return {
      true: '<span class="badge bg-success">Activo</span>',
      false: '<span class="badge bg-warning">Inactivo</span>',
    };
  }

  clientsBlockedClassMapper() {
    return {
      true: 'Sí',
      false: 'No',
    };
  }

  clientsFilterMapper() {
    return {
      clientNames: 'Nombre del cliente',
      clientStatus: 'Estado del cliente',
      clientBlocked: 'Cliente bloqueado',
    };
  }

  reportFilterMapper() {
    return {
      dateFrom: 'Fecha | Desde',
      dateTo: 'Fecha | Hasta',
      selectedClient: 'Nombre del cliente',
      templatesNames: 'Nombre del template',
      eventsNames: 'Estado del correo',
    };
  }

  eventClassMapper() {
    return {
      Solicitado: 'badge badge-warning',
      Entregado: 'badge badge-info',
      HizoClick: 'badge badge-secondary',
      Fallido: 'badge badge-danger',
      Abierto: 'badge badge-success',
    };
  }

  clientDocmentsFilterMapper() {
    return {
      creationDateFrom: 'Fecha de Emisión | Desde',
      creationDateTo: 'Fecha de Emisión | Hasta',
      documentType: 'Tipo de Documento',
      totalFrom: 'Total | Desde',
      totalTo: 'Total | Hasta',
      periodNames: 'Rango de Morosidad',
    };
  }

  contactStatusClassMapper() {
    return {
      '1': '<span class="badge badge-warning">Pendiente de carga</span>',
      '2': '<span class="badge badge-success">Sincronizado</span>',
      '3': '<span class="badge badge-danger">Inconsistente</span>',
    };
  }

  filterDaysMapper() {
    return [
      { name: 'Hoy', value: 1 },
      { name: 'Últimos 15 días', value: 15 },
      { name: 'Últimos 30 días', value: 30 },
    ];
  }

  pieColorsMapper() {
    return {
      Entregados: '#337de6',
      Abiertos: '#47CCAB',
      Fallidos: '#e62e3d',
      HizoClick: '#F97B16',
    };
  }
}
