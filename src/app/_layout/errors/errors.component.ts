import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.css'
})
export class ErrorsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
