import { AfterContentInit, Component, input } from '@angular/core';
import { IFileByIDResponse } from 'app/dashboard/interface/file-by-id.interface';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-right-drawer',
  standalone: true,
  imports: [],
  templateUrl: './right-drawer.component.html',
})
export class RightDrawerComponent implements AfterContentInit {
  file = input.required<IFileByIDResponse>();
  drawerId = input.required<string>();
  
  ngAfterContentInit(): void {
    initFlowbite();
  }
}
