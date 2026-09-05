import { Component } from '@angular/core';
import { FeatherModule } from 'angular-feather';

import { ModalsFrameComponent } from 'app/shared/components/modals/modals-frame/modals-frame.component';
import { ConfigService } from 'app/shared/services/config.service';

@Component({
  selector: 'app-modal-customized',
  standalone: true,
  imports: [ModalsFrameComponent, FeatherModule],
  templateUrl: './modal-customized.component.html',
})
export class ModalCustomizedComponent {
  constructor(public configService: ConfigService) {}
}
