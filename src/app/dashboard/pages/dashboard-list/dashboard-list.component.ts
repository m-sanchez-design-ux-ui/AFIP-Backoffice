import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FeatherModule } from 'angular-feather';
import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

import { Subject, Subscription } from 'rxjs';

import { Config } from 'datatables.net';
import { DataTablesModule } from 'angular-datatables';
import feather from 'feather-icons';
import { initFlowbite, Drawer } from 'flowbite';

import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from 'app/shared/components/breadcrumb/breadcrumb.component';
import { DashboardService } from 'app/dashboard/services/dashboard.service';
import { DatatablesComponent } from 'app/shared/components/datatables/datatables.component';
import { DatatablesResponse } from 'app/shared/components/datatables/models/dataTableResponse.model';
import { DatatablesService } from 'app/shared/components/datatables/services/datatables.service';
import { FilterComponent } from 'app/shared/components/dataTable-filter/filter.component';
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { RightDrawerComponent } from 'app/shared/components/drawers/right-drawer/right-drawer.component';
import { IFileResponse } from 'app/dashboard/interface/file.interface';
import { IFilters } from 'app/dashboard/interface/filters.interface';
import { IFileByIDResponse } from 'app/dashboard/interface/file-by-id.interface';
import { transformDataFormat } from 'app/shared/utils';
export interface ITable {
  id: string;
  cuit: string;
  salePoint: string;
  fileName: string;
  period: string;
  status: number;
  createdAt: Date;
}

@Component({
  selector: 'app-dashboard-list',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    DataTablesModule,
    FeatherModule,
    FormsModule,
    NgSelectModule,
    CommonModule,
    FilterComponent,
    DatatablesComponent,
    RouterLink,
  ],
  templateUrl: './dashboard-list.component.html',
})
//Renderizado de la tabla mediante ajax
export class DashboardListComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  breadcrumb: BreadcrumbItem[] = [
    { text: 'Archivos', isLink: true, routerLink: '/dashboard-list' },
    { text: 'Listado de archivos', isLink: false, routerLink: '' },
  ];

  private readonly subscriptions: Subscription[] = [];

  statusList = ['Creado', 'En la nube', 'Presentado', 'Error'];

  titlesList: string[] = [
    'CUIT',
    'Nro. punto de venta',
    'Nro. de serie',
    'Nombre del archivo',
    'Periodo de Presentación',
    'Estado',
    'Acciones',
  ];

  dtOptions: Config = {};
  dtTrigger: Subject<any> = new Subject<any>();
  today: number = Date.now();
  @ViewChild(DatatablesComponent) dataTable!: DatatablesComponent;
  private readonly interval: any;
  httpParams = new HttpParams();

  isSsr = true;

  file?: IFileByIDResponse;

  constructor(
    private readonly _dataTableService: DatatablesService,
    private readonly loadingService: LoadingService,
    private readonly router: Router,
    private readonly _dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    this.buildAjaxDatatable();

    setTimeout(() => {
      initFlowbite();
    }, 300);

    // this.interval = setInterval(() => {
    //   this.dataTable.reloadTable();
    // }, 60000);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next(null);
      feather.replace();
    }, 200);
  }

  private buildAjaxDatatable() {
    this.loadingService.show();
    this.dtOptions = this._dataTableService.buildOptions({
      ajax: (params: any, callback) => {
        this.loadingService.show();

        this.subscriptions.push(
          this._dataTableService
            .getData<DatatablesResponse<IFileResponse>>(
              this._dashboardService.getFilesUrl(),
              params,
              this.httpParams
            )
            .subscribe((resp: any) => {
              callback({
                recordsTotal: resp.results.total,
                recordsFiltered: resp.results.total,
                data: resp.results.results,
              });
              feather.replace();
            })
        );

        this.loadingService.hide();
      },
      pageLength: 5,
      searching: false,
      info: false,
      lengthChange: true, // Permitir cambiar la cantidad de filas
      lengthMenu: [5, 10, 25, 50], // Opciones de filas por página
      serverSide: this.isSsr,
      order: [[0, 'desc']],
      columns: [
        {
          name: 'cuit',
          data: 'cuit',
          orderable: true,
          render: (data) => {
            return `<span class="text-sm font-medium">` + data + `</span>`;
          },
        },
        {
          name: 'pos',
          data: 'pos',
          orderable: true,
          render: (data) => {
            return `<span class="text-sm font-medium">` + data + `</span>`;
          },
        },
        //New column start
        {
          // DEMO NOTE: in the original app this column was hardcoded to
          // "000000" for every row (`defaultContent`), since it was added
          // to the UI before the backend exposed real serial numbers.
          // For this demo it reads the mocked `serialNumber` field so the
          // table looks representative of real data.
          name: 'serialNumber',
          data: 'serialNumber',
          orderable: false,
          render: (data) => {
            return `<span class="text-sm font-medium">` + data + `</span>`;
          },
        },
        //New column end
        {
          name: 'filename',
          data: 'filename',
          orderable: true,
          render: (data, type: any, rest2: any) => {
            return (
              `<span data-tooltip-target="${rest2.filename}-tooltip" class="text-sm font-medium !w-24 block !truncate">` +
              data +
              `</span>` +
              `<div id="${rest2.filename}-tooltip" role="tooltip" class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm opacity-0 tooltip">
                ${data}     
                <div class="tooltip-arrow" data-popper-arrow></div>        
              </div>`
            );
          },
        },
        {
          name: 'endDate',
          data: 'endDate',
          orderable: true,
          render: (data: any, type: any, rest2: any) => {
            return (
              `<span class="text-sm font-medium">` +
              transformDataFormat(rest2.startDate) +
              ' ' +
              transformDataFormat(data) +
              `</span>`
            );
          },
        },
        {
          name: 'status',
          data: 'status',
          orderable: false,
          render: (data: number) => {
            switch (data) {
              case 1:
                return '<span class="rounded-full px-2 py-0.5 bg-yellow-100 text-xs text-yellow-700 font-medium !h-[19px] !w-[90px] flex justify-center"> Creado <span>';
              case 2:
                return '<span class="rounded-full px-2 py-0.5 bg-sky-100 text-xs text-sky-600 font-medium !h-[19px] !w-[90px] flex justify-center"> En la nube <span>';
              case 3:
                return '<span class="rounded-full px-2 py-0.5 bg-green-100 text-xs text-green-600 font-medium !h-[19px] !w-[90px] flex justify-center"> Presentado <span>';
              case 99:
                return `<span class="rounded-full px-2 py-0.5 bg-red-100 text-xs text-red-600 font-medium !h-[19px] !w-[90px] flex justify-center"> Error <span>`;
              default:
                return `<span class="rounded-full px-2 py-0.5 bg-red-100 text-xs text-red-600 font-medium !h-[19px] !w-[90px] flex justify-center"> Error <span>`;
            }
          },
        },
        {
          name: 'actions',
          data: 'fileId',
          orderable: false,
          defaultContent: '',
          render: (data: any, type: any, rest2: any) => {
            return `<a href="/file-list/${data}" class="text-blue-600 hover:[color:#233876_!important] text-sm font-semibold hover:underline hover:cursor-pointer routerLink">Ver detalles</a>`;
          },
        },
      ],
      drawCallback: () => {
        feather.replace();
        initFlowbite();
      },
      rowCallback: (row: Node, data: any) => {
        initFlowbite();
      },
    }, `<h4>No se han encontrado resultados</h4><p class="mb-0"> Si ha utilizado filtros límpielos e inténtelo nuevamente.</p>`);
    this.loadingService.hide();
  }

  saveFilters(filters: IFilters) {
    this.httpParams = new HttpParams();

    const { CUIT, pointOfSaleNo, state, dateFrom, dateTo } = filters;

    let stateId = -1;
    switch (state) {
      case 'Creado':
        stateId = 1;
        break;
      case 'En la nube':
        stateId = 2;
        break;
      case 'Presentado':
        stateId = 3;
        break;
      case 'Error':
        stateId = 99;
        break;

      default:
        break;
    }

    if (CUIT && CUIT !== '') {
      this.httpParams = this.httpParams.set('Cuit', CUIT);
    }
    if (pointOfSaleNo && pointOfSaleNo.toString() !== '-1') {
      this.httpParams = this.httpParams.set('PosId', pointOfSaleNo);
    }
    if (stateId && stateId !== -1) {
      this.httpParams = this.httpParams.set('Status', stateId);
    }
    if (dateFrom && dateFrom !== 'dd/mm/aaaa') {
      this.httpParams = this.httpParams.set('StartDate', dateFrom);
    }
    if (dateTo && dateTo !== 'dd/mm/aaaa') {
      this.httpParams = this.httpParams.set('EndDate', dateTo);
    }

    this.dataTable.reloadTableFilters();
    initFlowbite();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
    this.dtTrigger.unsubscribe();

    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
