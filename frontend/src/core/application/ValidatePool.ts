import { PoolMember, PoolValidation } from '../domain/Pooling';

export class ValidatePoolUseCase {
  execute(members: PoolMember[]): PoolValidation {
    const errors: string[] = [];
    
    if (members.length < 2) {
      errors.push('Pool must have at least 2 members');
    }

    const totalCB = members.reduce((sum, m) => sum + m.adjustedCB, 0);
    
    if (totalCB < 0) {
      errors.push('Total pool CB must be non-negative');
    }

    // Check if any member has invalid CB
    members.forEach(member => {
      if (isNaN(member.adjustedCB)) {
        errors.push(`Invalid CB for ${member.shipId}`);
      }
    });

    return {
      isValid: errors.length === 0,
      totalCB,
      errors
    };
  }
}
