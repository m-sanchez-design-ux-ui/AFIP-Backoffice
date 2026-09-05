import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Subscription, Subject } from 'rxjs';
import { DataTableDirective, DataTablesModule } from 'angular-datatables';
import { Config } from 'datatables.net';
import feather from 'feather-icons';

import { LoadingService } from 'app/shared/services/loading/loading.service';
import { DatatablesService } from 'app/shared/components/datatables/services/datatables.service';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    CommonModule,
    DataTablesModule,
    FeatherModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './datatables.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatatablesComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly subscriptions: Subscription[] = [];

  titlesList = input.required<string[]>();
  @Input() dtOptions: Config = {};

  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;

  constructor(
    private readonly _filesDataTableService: DatatablesService,
    private readonly loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.buildAjaxDatatable();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dtTrigger.next(null);
      feather.replace();
    }, 200);
  }

  private buildAjaxDatatable(): void {
    this.dtOptions = this._filesDataTableService.buildOptions(this.dtOptions);
  }

  reloadTable() {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.ajax.reload(()=> {}, false);
    });
  }

  reloadTableFilters() {
    this.dtElement.dtInstance.then((dtInstance) => {
      dtInstance.ajax.reload();
    });
  }
  
  onChangeFilter(selectedOptions: string[]) {
    this.reloadTable();
  }

  public showLoading() {
    this.loadingService.show();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
