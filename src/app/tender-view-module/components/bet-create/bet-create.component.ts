import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import cloneDeep from 'lodash/clonedeep';

import { AbstractTenderComponent } from '../../../shared/components/abstract-tender/abstract-tender.component';
import { TenderService } from '../../../services/tender.service';
import { AuthService } from '../../../services/auth.service';
import { Tender } from '../../../types/tender.type';
import { TenderBet } from '../../../types/tender-bet.type';
import { TenderUser } from '../../../types/tender-user.type';


@Component({
  selector: 'st-bet-create',
  templateUrl: './bet-create.component.html',
  styleUrls: ['./bet-create.component.scss']
})
export class BetCreateComponent extends AbstractTenderComponent {

  // a backup of the tender in case of an error on the server
  clonedSelectedTender: Tender = cloneDeep(this.selectedTender);

  isDisabled: boolean = false;

  readonly SPINNER_DIAMETER: number = 19;
  readonly SPINNER_STROKE_WIDTH: number = 1;

  get currencyCode(): string {
    return this.selectedTender ? this.selectedTender.currency.code : this.NEW_TENDER_DEFAULT_VALUE.CURRENCY.code;
  }

  get defaultBetValue(): number {
    if (this.selectedTender) {
      if (this.selectedTender.bestBet) {
        return this.selectedTender.bestBet.value + this.selectedTender.stepValue;
      } else {
        return this.selectedTender.stepValue;
      }
    } else {
      return this.BET_DEFAULT_VALUE.VALUE;
    }
  }


  betForm: FormGroup = new FormGroup({
    betValue: new FormControl(this.defaultBetValue, [
      Validators.required
    ]),
    comment: new FormControl(this.BET_DEFAULT_VALUE.COMMENT, [
      Validators.minLength(this.BET_DEFAULT_VALUE.MIN_COMMENT_LENGTH),
      Validators.maxLength(this.BET_DEFAULT_VALUE.MAX_COMMENT_LENGTH)
    ]),
  });


  constructor(protected translateService: TranslateService,
              protected tenderService: TenderService,
              protected authService: AuthService,
              protected title: Title,
              protected meta: Meta) {
    super(translateService, tenderService, authService, title, meta);
  }


  setBetValueValidationError(): void {
    const currentBetValue: number = this.betForm.value.betValue;

    if (this.selectedTender) {
      switch (true) {
        case currentBetValue == null:
          this.betForm.controls.betValue.setErrors({
            required: true,
          });
          break;

        case this.selectedTender.bestBet && currentBetValue < this.selectedTender.bestBet.value:
          this.betForm.controls.betValue.setErrors({
            lessBestBet: true,
          });
          break;

        case this.defaultBetValue > currentBetValue:
          this.betForm.controls.betValue.setErrors({
            lessStepValue: true,
          });
          break;

        case currentBetValue > this.BET_DEFAULT_VALUE.MAX_BET_VALUE:
          this.betForm.controls.betValue.setErrors({
            incorrectMaxValue: true,
          });
          break;
      }
    }
  }


  onSubmit(): void {
    this.isDisabled = true;

    this.subscriptions.add(
      this.saveBetInTender().subscribe(
        (editedTender: Tender) => {
          this.selectedTender = editedTender;

          if (this.selectedTender && this.selectedTender.bestBet) {
            this.betForm.controls.betValue.setValue(this.selectedTender.bestBet.value + this.selectedTender.stepValue);
          }
          this.tenderService.openSnackBar(this.translate('BET.BET_SAVED_SUCCESSFULLY'), this.SNACKBAR.SUCCESS);

          this.isDisabled = false;
        },
        () => {
          this.selectedTender = this.clonedSelectedTender;
          this.tenderService.openSnackBar(this.translate('BET.ERROR.FAILED_SAVE_BET'), this.SNACKBAR.ERROR);
          this.isDisabled = false;
        })
    );
  }


  private saveBetInTender(): Observable<Tender> {
    return this.getBetWithUser().pipe(
      switchMap((bet: TenderBet | null) => {
          if (!this.selectedTender.bets) {
            this.selectedTender.bets = [];
          }
          if (bet) {
            this.selectedTender.bets.push(bet);
            this.selectedTender.bestBet = bet;
          }
          return this.tenderService.editTender(this.selectedTender);
        }
      ));
  }


  private getBetWithUser(): Observable<TenderBet | null> {
    return this.authService.getAuthUser().pipe(
      map((user: TenderUser | null) => {
          if (user) {
            const bet: TenderBet = {
              tenderId: this.selectedTender.id,
              user: user,
              dateTime: new Date(),
              value: Number(this.betForm.value.betValue),
              comment: this.betForm.value.comment
            };
            return bet;
          } else {
            return null;
          }
        }
      ));
  }

}
