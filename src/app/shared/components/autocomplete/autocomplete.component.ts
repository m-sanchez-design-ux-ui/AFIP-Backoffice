import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import {
  ICompanyCuil,
  ResultCuit,
} from 'app/shared/interfaces/filters/company-cuil.interface';
import {
  Select2Data,
  Select2Module,
  Select2UpdateEvent,
} from 'ng-select2-component';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, Select2Module],
  templateUrl: './autocomplete.component.html',
})
export class AutocompleteComponent {
  items = input.required<ICompanyCuil>();
  inputValueChange = output<string>();

  data = signal<Select2Data>([]);

  filteredItems = signal<ResultCuit[]>([]);
  selectedItem = signal<string>('');
  isDropdownVisible = signal<boolean>(false);

  itemsFiltered = computed(() => this.filteredItems());

  ngOnInit(): void {
    this.data.set(
      this.items().results.map((item) => ({ value: item.cuit, label: item.cuit }))
    );
    this.filteredItems.set(this.items().results);
  }

  onUpdate(event: Select2UpdateEvent): void {
    this.inputValueChange.emit(event.value as string);
  }
}
