export interface ApplyBankedInput {
  shipId: string;
  year: number;
  amount: number;
  totalBanked: number;
}

export interface ApplyBankedResult {
  shipId: string;
  year: number;
  appliedAmount: number;
  remainingBanked: number;
}

export class ApplyBanked {
  execute(input: ApplyBankedInput): ApplyBankedResult {
    if (input.amount <= 0) {
      throw new Error('Apply amount must be positive');
    }

    if (input.amount > input.totalBanked) {
      throw new Error('Cannot apply more than available banked surplus');
    }

    return {
      shipId: input.shipId,
      year: input.year,
      appliedAmount: input.amount,
      remainingBanked: input.totalBanked - input.amount
    };
  }
}
