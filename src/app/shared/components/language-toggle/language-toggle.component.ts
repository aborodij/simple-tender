import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AbstractTenderComponent } from '../abstract-tender/abstract-tender.component';
import { TenderService } from '../../../services/tender.service';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'st-language-toggle',
  templateUrl: './language-toggle.component.html',
  styleUrls: ['./language-toggle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageToggleComponent extends AbstractTenderComponent {

  constructor(protected translateService: TranslateService,
              protected tenderService: TenderService,
              protected authService: AuthService,
              protected title: Title,
              protected meta: Meta,
              protected router: Router) {
    super(translateService, tenderService, authService, title, meta);
  }


  selectionChange(language: string): void {
    this.currentLocale = language;
    this.translateService.use(language);
    this.translateService.setDefaultLang(language);
    localStorage.setItem('locale', language);

    const currentUrl: string = this.router.url;
    this.router.navigate([currentUrl, '#']).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
