import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  AfterViewInit,
} from '@angular/core';
import {
  BreadcrumbComponent,
  BreadcrumbItem,
} from 'app/shared/components/breadcrumb/breadcrumb.component';
import { DataTablesModule } from 'angular-datatables';
import feather from 'feather-icons';
import { FeatherModule } from 'angular-feather';
import { DatatablesComponent } from 'app/shared/components/datatables/datatables.component';
import { DatatablesService } from 'app/shared/components/datatables/services/datatables.service';
import { LoadingService } from 'app/shared/services/loading/loading.service';
import { Config } from 'datatables.net';
import { Subject, Subscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { IFileByIDResponse } from 'app/dashboard/interface/file-by-id.interface';
import { initFlowbite } from 'flowbite';
import { transformDataFormat } from 'app/shared/utils';
import { Router } from '@angular/router';
import { DatatablesResponse } from 'app/shared/components/datatables/models/dataTableResponse.model';

import { IFilters } from 'app/dashboard/interface/filters.interface';
import { DataTableFliter02Component } from 'app/shared/components/data-table-fliter-02/data-table-fliter-02.component';
import { IFilesConsolidatedList } from 'app/consolidated-files/interfaces/files-consolidated-list.interface';
import { ConsolidatedFilesService } from 'app/consolidated-files/services/consolidated-files.service';

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
  selector: 'app-consolidated-files',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    DataTablesModule,
    FeatherModule,
    DatatablesComponent,
    DataTableFliter02Component,
  ],
  templateUrl: './consolidated-files.component.html',
  styleUrls: ['./consolidated-files.component.css'],
})
export class ConsolidatedFilesComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  statusList = ['Creado', 'En la nube', 'Presentado', 'Error'];

  saveFilters(filters: any) {
    this.httpParams = new HttpParams();
    
    const { Name, dateFrom, dateTo } = filters;

    if (Name && Name !== '') {
      this.httpParams = this.httpParams.set('Name', Name);
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

  //Breadcrumb Component Start------------------------------------------------------------
  breadcrumb: BreadcrumbItem[] = [
    { text: 'Archivos', isLink: true, routerLink: '/dashboard-list' },
    { text: 'Listado de archivos consolidados', isLink: false, routerLink: '' },
  ];
  //Breadcrumb Component End--------------------------------------------------------------
  //Table Component Start------------------------------------------------------------
  private readonly subscriptions: Subscription[] = [];

  titlesList: string[] = [
    'Nombre del archivo',
    'Fecha de consolidación',
    'Período asociado',
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
    private readonly _consolidatedFilesService: ConsolidatedFilesService
  ) {}

  ngOnInit(): void {
    this.buildAjaxDatatable();

    setTimeout(() => {
      initFlowbite();
    }, 300);
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
            .getData<DatatablesResponse<IFilesConsolidatedList>>(
              this._consolidatedFilesService.getFilesConsolidatedUrl(),
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
      lengthChange: true, // Permitir cambiar la cantidad de filas
      lengthMenu: [5, 10, 25, 50], // Opciones de filas por página
      info: false,
      serverSide: this.isSsr,
      order: [[0, 'desc']],
      columns: [
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
          render: (data: any) => {
            return (
              `<span class="text-sm font-medium">` +
              transformDataFormat(data) +
              `</span>`
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
          name: 'actions',
          data: 'url',
          orderable: false,
          defaultContent: '',
          render: (data: any, type: any, rest2: any) => {
            return `
            <a 
              href="${data}" 
              target="_blank" 
              download 
              class="text-blue-600 hover:[color:#233876_!important] text-sm font-semibold hover:underline hover:cursor-pointer">
              Descargar Archivo
            </a>`;
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
  //Table Component End------------------------------------------------------------
}
