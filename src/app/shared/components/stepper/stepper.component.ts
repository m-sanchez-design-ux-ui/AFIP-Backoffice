import { AfterViewInit, Component, input, Input, OnInit } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import { CommonModule } from '@angular/common';
import { Status } from 'app/dashboard/interface/file-by-id.interface';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [FeatherModule, CommonModule],
  templateUrl: './stepper.component.html',
})
export class StepperComponent implements OnInit, AfterViewInit {
  ngAfterViewInit(): void {
    initFlowbite();
  }
  stepperData = input.required<Status[]>();

  steps: StepperItem[] = [
    { title: 'Creado', icon: 'file-plus', code: 1, color: 'primary' },
    { title: 'En la nube', icon: 'cloud', code: 2, color: 'sky-500' },
    { title: 'Presentado AFIP', icon: 'monitor', code: 3, color: 'green-500' },
    // {
    //   title: 'Presentado SAP',
    //   icon: 'bar-chart',
    //   code: 4,
    //   color: 'purple-500',
    // },
  ];

  actualIndex: number = 0;
  actualColor: string = '';

  // DEFAULT ITEMS
  stepError: StepperItem = {
    title: 'Error',
    icon: 'alert-triangle',
    code: 99,
    color: 'red-500',
  };

  lineGray = `w-full before:content-[''] before:w-full before:h-1 before:border-b before:border-gray-300 before:border-4 before:inline-block dark:before:border-gray-300`;

  ngOnInit(): void {
    this.stepperData().forEach((apiItem) => {
      const step = this.steps.find((s) => s.code === apiItem.id);
      if (step) {
        step.date = apiItem.date;
      }
    });
    this.actualIndex = this.steps.findIndex(
      (x) => x.code == this.stepperData()[this.stepperData().length - 1].id
    );
    this.actualColor = this.steps[this.actualIndex]?.color;
    initFlowbite();
  }

  isActual(item: StepperItem): boolean {
    return this.stepperData()[this.stepperData().length - 1].id == item.code;
  }

  getActualIndex() {
    return this.actualIndex;
  }

  getStep() {
    return this.steps[this.actualIndex];
  }

  getLineColor(index: number): { [key: string]: boolean } {
    let line = {
      flex: true,
      'items-center': true,
      'w-full': index != 0,
    };

    if (index !== 0) {
      if (index <= this.actualIndex) {
        return {
          ...line,
          [`before:content-['']`]: true,
          'before:w-full': true,
          'before:h-1': true,
          'before:border-b': true,
          [`before:border-${this.actualColor}`]: true,
          'before:border-4': true,
          'before:inline-block': true,
          [`dark:before:border-${this.actualColor}`]: true,
        };
      } else {
        return {
          ...line,
          [this.lineGray]: true,
        };
      }
    }
    return line;
  }

  getItemClasses(item: StepperItem, index: number): { [key: string]: boolean } {
    const stepRoundColor =
      index <= this.actualIndex ? `${this.actualColor}` : `gray-300`;

    return {
      'w-8 h-8 sm:h-12 sm:w-12': index >= this.getActualIndex(),
      'h-4 w-4 sm:h-6 sm:w-6': index < this.getActualIndex(),
      [`bg-${stepRoundColor}`]: true,
      [`dark:bg-${stepRoundColor}`]: true,
    };
  }

  formatDateToDDMMYYYY(isoDate: Date) {
    const date = new Date(isoDate);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
}

export interface StepperData {
  id: number;
  date: string;
}

export interface StepperItem {
  title: string;
  icon: string;
  code: number;
  color: string;
  date?: Date;
}

/*
  HOW TO USE:

  Import:

  import { StepperComponent, StepperData } from "../../../shared/components/stepper/stepper.component";

  on imports: [
    ...,
    StepperComponent
  ]

  HTML:

  <app-stepper [stepperData]="this.stepStatus"></app-stepper>

  Object Example

  stepStatus : StepperData = {
    status: 2,
    error: {
      title: "Se produjo un error inesperado!",
      message: "Ocurrio un error en el envio"
    },
    statusDate: '2024/10/01 04:00:00'
  }

*/
