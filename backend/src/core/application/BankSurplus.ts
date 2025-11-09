import { BankEntry } from '../domain/Banking';

export interface BankSurplusInput {
  shipId: string;
  year: number;
  amount: number;
  availableCB: number;
}

export class BankSurplus {
  execute(input: BankSurplusInput): BankEntry {
    if (input.amount <= 0) {
      throw new Error('Bank amount must be positive');
    }

    if (input.amount > input.availableCB) {
      throw new Error('Cannot bank more than available surplus');
    }

    return {
      shipId: input.shipId,
      year: input.year,
      amountGco2eq: input.amount
    };
  }
}
