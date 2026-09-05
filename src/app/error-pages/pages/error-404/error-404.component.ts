import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-404',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './error-404.component.html',
})
export class Error404Component {}
