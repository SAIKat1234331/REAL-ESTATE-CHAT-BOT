export interface EmiCalculationResult {
  monthlyEmi: number;
  totalInterest: number;
  totalPayable: number;
  principalPercent: number;
  interestPercent: number;
}

export function calculateEmi(
  principal: number,
  annualInterestRatePercent: number,
  tenureYears: number
): EmiCalculationResult {
  const safePrincipal = Math.max(0, principal);
  const safeYears = Math.max(1, tenureYears);
  const months = Math.round(safeYears * 12);
  const safeRate = Math.max(0, annualInterestRatePercent);

  if (safePrincipal === 0) {
    return {
      monthlyEmi: 0,
      totalInterest: 0,
      totalPayable: 0,
      principalPercent: 100,
      interestPercent: 0,
    };
  }

  if (safeRate === 0) {
    const monthlyEmi = Math.round(safePrincipal / months);
    return {
      monthlyEmi,
      totalInterest: 0,
      totalPayable: safePrincipal,
      principalPercent: 100,
      interestPercent: 0,
    };
  }

  const monthlyRate = safeRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, months);
  const emi = (safePrincipal * monthlyRate * factor) / (factor - 1);
  const monthlyEmi = Math.round(emi);
  const totalPayable = Math.round(emi * months);
  const totalInterest = Math.max(0, totalPayable - safePrincipal);
  const principalPercent = Math.round((safePrincipal / totalPayable) * 100);
  const interestPercent = 100 - principalPercent;

  return {
    monthlyEmi,
    totalInterest,
    totalPayable,
    principalPercent,
    interestPercent,
  };
}

export function formatCurrency(amount: number, compact = false): string {
  if (compact) {
    if (amount >= 1_000_000) {
      const m = amount / 1_000_000;
      return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(2)}M`;
    }
    if (amount >= 1_000) {
      const k = amount / 1_000;
      return `$${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
    }
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatListingPrice(price: number, priceUnit: 'total' | 'monthly'): string {
  const formatted = formatCurrency(price);
  return priceUnit === 'monthly' ? `${formatted} / mo` : formatted;
}

export function calculatePricePerSqFt(price: number, areaSqFt: number): number {
  if (!areaSqFt || areaSqFt <= 0) return 0;
  return Math.round(price / areaSqFt);
}

export function generateLeadId(existingCount: number, timestampMs = Date.now()): string {
  const suffix = String(timestampMs).slice(-4);
  const seq = String(existingCount + 101).padStart(4, '0');
  return `LD-${seq}-${suffix}`;
}

export function generatePropertyId(existingCount: number): string {
  const seq = String(existingCount + 101).padStart(4, '0');
  return `ME-PRP-${seq}`;
}
