import { TenderUser } from './tender-user.type';
import { TenderUnit } from './tender-unit.type';
import { TenderCurrency } from './tender-currency.type';
import { TenderBet } from './tender-bet.type';

export interface Tender {
  id?: string;                          // id in the database
  dateCreate?: string | Date;           // date of tender creation
  dateStart: string | Date;             // launch date of the tender
  dateEnd: string | Date;               // end date of the tender
  title: string;                        // title
  description: string;                  // description
  user?: TenderUser | null;             // user who created this tender
  isShowBestBet: boolean;               // to show the best bet or not
  stepValue: number;                    // step of the bet
  bestBet?: TenderBet;                  // the best bet
  currentBet?: TenderBet;               // the bet entered but not yet saved by the user
  bets?: TenderBet[];                   // all bets for this tender
  currency: TenderCurrency;             // currency
  quantity: number;                     // quantity of goods
  unit: TenderUnit;                     // in what units the goods are measured
}
