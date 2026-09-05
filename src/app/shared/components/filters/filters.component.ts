import { Component, output } from '@angular/core';

import { ModalsFrameComponent } from 'app/shared/components/modals/modals-frame/modals-frame.component';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [ModalsFrameComponent],
  templateUrl: './filters.component.html',
})
export class FiltersComponent{
  OnClear = output<any>();

  OnSearch = output<any>();

  clear() {
    this.OnClear.emit(true);
  }

  search() {
    this.OnSearch.emit(true);
  }
}
