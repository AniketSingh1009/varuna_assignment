import { PoolCreationRequest, PoolCreationResult, PoolMember } from '../domain/Pool';

export class CreatePool {
  execute(request: PoolCreationRequest): Omit<PoolCreationResult, 'poolId'> {
    // Validate total CB >= 0
    const totalCB = request.members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (totalCB < 0) {
      throw new Error('Pool total CB must be non-negative');
    }

    // Sort members by CB descending (surplus first)
    const sorted = [...request.members].sort((a, b) => b.cbBefore - a.cbBefore);

    // Greedy allocation
    const members: Omit<PoolMember, 'poolId'>[] = sorted.map(m => ({
      shipId: m.shipId,
      cbBefore: m.cbBefore,
      cbAfter: m.cbBefore
    }));

    // Transfer surplus to deficits
    for (let i = 0; i < members.length; i++) {
      if (members[i].cbAfter <= 0) continue;

      for (let j = 0; j < members.length; j++) {
        if (members[j].cbAfter >= 0) continue;

        const surplus = members[i].cbAfter;
        const deficit = Math.abs(members[j].cbAfter);
        const transfer = Math.min(surplus, deficit);

        members[i].cbAfter -= transfer;
        members[j].cbAfter += transfer;

        if (members[i].cbAfter === 0) break;
      }
    }

    // Validate constraints
    for (const member of members) {
      const original = request.members.find(m => m.shipId === member.shipId)!;
      
      if (original.cbBefore < 0 && member.cbAfter < original.cbBefore) {
        throw new Error(`Deficit ship ${member.shipId} cannot exit worse`);
      }
      
      if (original.cbBefore > 0 && member.cbAfter < 0) {
        throw new Error(`Surplus ship ${member.shipId} cannot exit negative`);
      }
    }

    return {
      year: request.year,
      members: members as PoolMember[]
    };
  }
}
