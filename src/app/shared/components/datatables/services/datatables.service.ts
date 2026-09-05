import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Config } from 'datatables.net';

import { PageParams } from 'app/shared/models/pageparams.model';
import { SortParams } from 'app/shared/models/sortparams.model';
import { ConfigService } from 'app/shared/services/config.service';

@Injectable({
  providedIn: 'root',
})
export class DatatablesService {
  private readonly pageParams!: PageParams;
  private readonly sortParams!: SortParams;
  private readonly search!: string;

  _configService = inject(ConfigService);
  _httpClient = inject(HttpClient);

  getData<Type>(
    url: string,
    params: any,
    httpParams: HttpParams
  ): Observable<Type> {
    const pageParams = this.buildPageParams(params);
    const sortParams = this.buildSortParams(params);
    const search = params.search.value;

    let queryParams = '';

    if (pageParams) {
      queryParams += `PageParams.PageNumber=${pageParams.page}&PageParams.PageSize=${pageParams.pageSize}&`;
    }

    if (sortParams) {
      const sortByValue = sortParams.sortBy!.toString().trim();
      const sortBy = sortParams.ascending ? '1' : '0';
      if (sortByValue !== '') {
        queryParams += `SortParams[${sortByValue}]=${sortBy}&`;
      }
      queryParams += `sortParams.ascending=${sortBy}&`;
    }

    if (httpParams['updates']) {
      httpParams['updates'].map((update: any) => {
        const sortByValue = update.param!.toString().trim().toLowerCase();
        const sortValue = update.value;
        queryParams += `${sortByValue}=${sortValue}&`;
      });
    }

    if (search) {
      queryParams += `search=${search}&`;
    }

    // Eliminar el último ampersand (&)
    queryParams = queryParams.slice(0, -1);

    return this._httpClient.get<Type>(`${url}?${queryParams}`);
  }

  buildOptions(settings: Config, emptyTabletText: string = "No existe información dentro del controlador fiscal en el periodo extraído"): Config {
    return Object.assign(
      {
        serverSide: false, //set to true when data is obtained from an API
        processing: true,
        dom:
          "<'datatable__header'f<il>>" +
          "<'datatable__body overflow-x-auto'<'table table-striped table-responsive't>> " +
          "<'datatable__footer'p>",
        paging: true,
        responsive: false,
        pagingType: 'simple_numbers',
        pageLength: 5,
        info: true,
        searching: true,
        // ordering: true,
        lengthChange: true,
        searchDelay: 800,
        lengthMenu: [5, 10],
        language: {
          searchPlaceholder: 'Buscar...',
          search: '',
          info: '_START_ - _END_ / _TOTAL_',
          infoEmpty: 'No hay registros',
          lengthMenu: '_MENU_',
          emptyTable:
            `<div class="flex flex-col justify-center items-center"><img src="images/noResults.svg" alt="No results" class="img-fluid">${emptyTabletText}</div>`,
          zeroRecords:
            '<div class="flex flex-col justify-center items-center"><img src="images/noRecords.svg" alt="No results" class="img-fluid"><h4>En este momento no hay registros.</h4></div>',
          paginate: {
            // first: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-left"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>',
            previous:
              '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><polyline points="15 18 9 12 15 6"></polyline></svg>', // points to a custom font
            next: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>', // points to a custom font
            // last: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>'
          },
          loadingRecords:
            //'<div class="spinner-border spinner-border-sm text-white mr--2" role="status"><span class="sr-only">Loading...</span></div> Cargando...',
            '<div class="spinner-border spinner-border-sm text-white mr--2" role="status"><span class="sr-only">Loading...</span></div>',
          processing:
            '<div class="spinner-border spinner-border-sm text-white mr--2" role="status"><span class="sr-only">Loading...</span></div> Procesando...',
        },
      },
      settings,
      {
        initComplete: (initSettings: any, json: any) => {
          if (settings.initComplete) {
            settings.initComplete(initSettings, json);
          }
        },
        drawCallback: (drawSettings: any) => {
          if (settings.drawCallback) {
            settings.drawCallback(drawSettings);
          }
        },
      }
    );
  }

  buildPageParams(params: any): PageParams {
    return { page: params.start / params.length + 1, pageSize: params.length };
  }

  buildSortParams(params: any): SortParams {
    const sortParams: SortParams = {
      ascending: false,
      sortBy: '',
    };
    for (const element of params.order) {
      const order = element;
      sortParams.ascending = order.dir === 'asc';
      sortParams.sortBy = order.name ? order.name : false;
    }
    return sortParams;
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
