import { SubscriptionData } from './initialData';

export interface SubscriptionItemExtended extends SubscriptionData {
  provider?: string;
  categoryName?: string;
  notes?: string;
  cancelUrl?: string;
  cancelSteps?: string;
  trialEndDate?: string | null;
  flaggedLowUsage?: boolean;
  status?: 'ACTIVE' | 'TRIAL' | 'TO_CANCEL' | 'VERIFIED_CANCELLED';
  reminderDays?: number;
}

export function calculateNormalizedMonthlyPrice(sub: SubscriptionItemExtended): number {
  const price = sub.amount;
  switch (sub.frequency) {
    case 'weekly':
      return price * 4.33;
    case 'bimonthly':
      return price / 2;
    case 'yearly':
      return price / 12;
    case 'monthly':
    default:
      return price;
  }
}

export function calculateFinancialSummary(subscriptions: SubscriptionItemExtended[]) {
  const activeSubs = subscriptions.filter(
    (s) => !s.status || s.status === 'ACTIVE' || s.status === 'TRIAL' || s.status === 'TO_CANCEL'
  );

  const totalMonthlySpend = activeSubs.reduce((acc, sub) => acc + calculateNormalizedMonthlyPrice(sub), 0);
  const annualProjection = totalMonthlySpend * 12;

  const lowUsageCount = activeSubs.filter((s) => s.flaggedLowUsage).length;
  const potentialSavingsMonthly = activeSubs
    .filter((s) => s.flaggedLowUsage || s.status === 'TO_CANCEL')
    .reduce((acc, sub) => acc + calculateNormalizedMonthlyPrice(sub), 0);

  const trialsExpiringSoon = activeSubs.filter((s) => {
    if (!s.trialEndDate) return false;
    const trialDate = new Date(s.trialEndDate);
    const now = new Date();
    const diffDays = Math.ceil((trialDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return diffDays >= 0 && diffDays <= 7;
  });

  return {
    totalMonthlySpend: Math.round(totalMonthlySpend),
    annualProjection: Math.round(annualProjection),
    activeCount: activeSubs.length,
    lowUsageCount,
    potentialSavingsMonthly: Math.round(potentialSavingsMonthly),
    trialsExpiringSoon,
  };
}

export function getUpcomingRenewals(subscriptions: SubscriptionItemExtended[], daysHorizon = 30) {
  const now = new Date();
  const cutoff = new Date();
  cutoff.setDate(now.getDate() + daysHorizon);

  return subscriptions
    .filter((sub) => {
      const day = sub.billingDay || 1;
      const renewalDate = new Date(now.getFullYear(), now.getMonth(), day);
      if (renewalDate < now) {
        renewalDate.setMonth(renewalDate.getMonth() + 1);
      }
      return renewalDate <= cutoff;
    })
    .sort((a, b) => (a.billingDay || 1) - (b.billingDay || 1));
}
