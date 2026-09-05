import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [],
  templateUrl: './progress.component.html',
})
export class ProgressComponent {
  progress = input<number>(0);
}
