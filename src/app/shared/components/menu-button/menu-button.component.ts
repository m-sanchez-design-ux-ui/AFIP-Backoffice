import { Component, input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FeatherModule } from 'angular-feather';

import { Dropdown } from 'flowbite';

import { Globals, ScreenSize } from 'app/globals';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-menu-button',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FeatherModule, CommonModule],
  templateUrl: './menu-button.component.html',
})
export class MenuButtonComponent implements OnInit {
  button = input<any>();
  public isCollapsed: boolean = true;
  public isSubCollapsed: boolean = true;

  constructor(public globals: Globals) {}

  ngOnInit(): void {
    //initFlowbite();
  }

  public onModuleClick() {
    if (this.globals.screenSize === ScreenSize.Small) {
      this.globals.collapseMenu();
    }
  }

  openMenu(idTitle: string) {
    if (this.button().collapse) {
      const $targetEl = document.getElementById('dropdown-' + idTitle);
      const $triggerEl = document.getElementById('dropdownButton-' + idTitle);
      const dropdown = new Dropdown($targetEl, $triggerEl);

      if (this.globals.menuCollapsed && idTitle == 'Lotes') {
        this.globals.collapseMenu(!this.globals.menuCollapsed);

        if (!dropdown.isVisible()) {
          dropdown.show();
          $targetEl?.classList.add('!block');
        }
        dropdown.show();
      }
    }
  }
}
