import { ComplianceBalance } from '../domain/Compliance';

export interface CBInput {
  shipId: string;
  year: number;
  actualIntensity: number;
  fuelConsumption: number;
}

export class ComputeCB {
  private readonly TARGET_INTENSITY_2025 = 89.3368; // gCO2e/MJ
  private readonly ENERGY_CONVERSION_FACTOR = 41000; // MJ/t

  execute(input: CBInput): ComplianceBalance {
    const energyInScope = input.fuelConsumption * this.ENERGY_CONVERSION_FACTOR;
    const cbGco2eq = (this.TARGET_INTENSITY_2025 - input.actualIntensity) * energyInScope;

    return {
      shipId: input.shipId,
      year: input.year,
      cbGco2eq: Math.round(cbGco2eq * 100) / 100,
      targetIntensity: this.TARGET_INTENSITY_2025,
      actualIntensity: input.actualIntensity,
      energyInScope: Math.round(energyInScope * 100) / 100
    };
  }
}
