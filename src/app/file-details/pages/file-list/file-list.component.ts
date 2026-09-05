import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from 'app/shared/components/breadcrumb/breadcrumb.component';

import { DataTablesModule } from 'angular-datatables'; // Módulo necesario para usar DataTables en Angular
import { DatatablesComponent } from 'app/shared/components/datatables/datatables.component'; // Componente de DataTable personalizado
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { initFlowbite } from 'flowbite';
import { Config } from 'datatables.net';
import { Subject, Subscription } from 'rxjs';
import { FeatherModule } from 'angular-feather';
import feather from 'feather-icons';
import {
  StepperComponent,
  StepperData,
} from 'app/shared/components/stepper/stepper.component';
import { FileDetailService } from 'app/file-details/services/file-detail.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IFileDetail,
  Status,
} from 'app/file-details/interfaces/file-detail.interface';

export interface ITable {
  id: string;
  closeNumber: string;
  closeDate: Date;
  typeOfVoucher: number;
  firstVoucher: number;
  lastVoucher: number;
  totalAmount: string;
  totalRecorded: string;
  totalNoRecorded: string;
  totalExecption: string;
}

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    DataTablesModule, // Importación del módulo de DataTables
    DatatablesComponent, // Componente personalizado para la tabla de datos
    FeatherModule,
    StepperComponent,
  ],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css',
})
export class FileListComponent implements OnInit, OnDestroy, AfterViewInit {
  //Breadcrumb Component Start------------------------------------------------------------

  breadcrumb: BreadcrumbItem[] = [
    { text: 'Archivos', isLink: true, routerLink: '/dashboard-list' },
    {
      text: 'Listado de archivos',
      isLink: true,
      routerLink: '/dashboard-list',
    },
    { text: 'Detalle del archivo y estado', isLink: false, routerLink: '' },
  ];

  //Breadcrumb Component End--------------------------------------------------------------

  titlesList = [];

  // Configuración de la tabla de datos con DataTable
  dtOptions: Config = {}; // Opciones de configuración de la DataTable
  dtTrigger: Subject<any> = new Subject<any>(); // Controla el renderizado de la DataTable
  @ViewChild(DatatablesComponent) dataTable!: DatatablesComponent; // Referencia al componente de DataTable

  private readonly subscriptions: Subscription[] = []; // Manejo de suscripciones a observables

  private readonly _fileDetailService = inject(FileDetailService);
  private readonly _loadingService = inject(LoadingService);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  fileDetailData = signal<IFileDetail | null>(null);
  id = signal<string>('');
  stepStatus = signal<Status[]>([]);
  dataList = signal<ITable[]>([]);

  // stepStatus: StepperData = {
  //   status: 99,
  //   error: {
  //     title: 'Se produjo un error inesperado!',
  //     message: 'Ocurrio un error en el envio',
  //   },
  //   statusDate: '2024/10/01 04:00:00',
  // };

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id') ?? '';
      this.id.set(id ?? '');
      this._loadingService.show();

      this._fileDetailService.getFileDetail(id).subscribe({
        next: (data) => {
          this.fileDetailData.set(data);

          this.stepStatus.set(data.status);

          const dataTable: ITable[] =
            data.audit.f8011.fiscalDetails.dayDetails.map((item, index) => {
              return {
                id: index.toString(),
                closeNumber: item.number,
                closeDate: item.date,
                typeOfVoucher: item.type,
                firstVoucher: item.firstReceipt,
                lastVoucher: item.lastReceipt,
                totalAmount: item.totalAmount,
                totalRecorded: item.taxedAmount,
                totalNoRecorded: item.untaxedAmount,
                totalExecption: item.exemptAmount,
              };
            });

          this.dataList.set(dataTable);
          this.buildAjaxDatatable();
          this._loadingService.hide();
        },
        error: (err) => {
          this._loadingService.hide();
          this._router.navigate(['/500']);
        },
        complete: () => {
          this._loadingService.hide();
        },
      });
    });

    setTimeout(() => {
      initFlowbite();
    }, 600);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next(null);
      feather.replace();
    }, 200);
  }

  private buildAjaxDatatable() {
    // Configuración de opciones de la DataTable
    this._loadingService.show(); // Muestra un indicador de carga

    this.dtOptions = {
      data: this.dataList(), // Usa dataList como fuente de datos
      columns: [
        {
          data: 'closeNumber',
          title: 'Nro. de cierre',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'closeDate',
          title: 'Fecha cierre de Z',
          orderable: true,
          render: (data) =>
            `<span class="text-sm font-medium">${new Date(
              data
            ).toLocaleDateString()}</span>`,
        },
        {
          data: 'typeOfVoucher',
          title: 'Tipo de comprobante',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'firstVoucher',
          title: 'Primer comprobante ',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'lastVoucher',
          title: 'Último comprobante',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'totalAmount',
          title: 'Importe total',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'totalRecorded',
          title: 'Total gravado',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'totalNoRecorded',
          title: 'Total no gravado',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
        {
          data: 'totalExecption',
          title: 'Total exento',
          orderable: true,
          render: (data) => `<span class="text-sm font-medium">${data}</span>`,
        },
      ],
      paging: true,
      searching: false,
      lengthChange: false,
      info: false,
      ordering: true,
    };

    this._loadingService.hide();
  }

  ngOnDestroy(): void {
    // Limpieza de suscripciones al destruir el componente
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
    this.dtTrigger.unsubscribe();
  }

  //Data Table Component End------------------------------------------------------------
}
