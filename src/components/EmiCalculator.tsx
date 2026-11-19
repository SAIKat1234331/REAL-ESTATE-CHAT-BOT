import React, { useMemo, useState } from 'react';
import { calculateEmi, formatCurrency } from '../utils/finance';

interface EmiCalculatorProps {
  propertyPrice: number;
}

export const EmiCalculator: React.FC<EmiCalculatorProps> = ({ propertyPrice }) => {
  const defaultDownPercent = 20;
  const [downPaymentPercent, setDownPaymentPercent] = useState(defaultDownPercent);
  const [interestRate, setInterestRate] = useState(6.25);
  const [tenureYears, setTenureYears] = useState(25);

  const downPaymentAmount = Math.round((propertyPrice * downPaymentPercent) / 100);
  const loanPrincipal = Math.max(0, propertyPrice - downPaymentAmount);

  const result = useMemo(
    () => calculateEmi(loanPrincipal, interestRate, tenureYears),
    [loanPrincipal, interestRate, tenureYears]
  );

  return (
    <section className="bg-white border border-[#E6EAF0] rounded-[12px] p-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-5 border-b border-[#E6EAF0]">
        <div>
          <h3 className="text-lg font-semibold text-[#142D4E]">Mortgage &amp; EMI Estimator</h3>
          <p className="text-sm text-[#778397]">
            Indicative monthly installment calculation for planning purposes.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-[#778397]">Estimated Monthly Payment</p>
          <p className="font-display text-2xl font-bold text-[#142D4E] tabular-nums">
            {formatCurrency(result.monthlyEmi)}
            <span className="text-sm font-normal text-[#778397]"> / mo</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <label htmlFor="emi-down-payment" className="font-medium text-[#202B3C]">
              Down Payment ({downPaymentPercent}%)
            </label>
            <span className="font-mono tabular-nums text-[#778397]">
              {formatCurrency(downPaymentAmount)}
            </span>
          </div>
          <input
            id="emi-down-payment"
            type="range"
            min={10}
            max={60}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-[#142D4E]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <label htmlFor="emi-interest-rate" className="font-medium text-[#202B3C]">
              Interest Rate (p.a.)
            </label>
            <span className="font-mono tabular-nums text-[#778397]">{interestRate.toFixed(2)}%</span>
          </div>
          <input
            id="emi-interest-rate"
            type="range"
            min={3}
            max={12}
            step={0.25}
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
            className="w-full accent-[#142D4E]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <label htmlFor="emi-tenure" className="font-medium text-[#202B3C]">
              Loan Tenure
            </label>
            <span className="font-mono tabular-nums text-[#778397]">{tenureYears} Years</span>
          </div>
          <input
            id="emi-tenure"
            type="range"
            min={5}
            max={30}
            step={1}
            value={tenureYears}
            onChange={(e) => setTenureYears(Number(e.target.value))}
            className="w-full accent-[#142D4E]"
          />
        </div>
      </div>

      {/* Proportion Bar */}
      <div className="mt-6">
        <div className="h-2.5 w-full bg-[#F5F7FA] rounded-full overflow-hidden flex">
          <div
            style={{ width: `${result.principalPercent}%` }}
            className="bg-[#142D4E] h-full transition-all duration-200"
          />
          <div
            style={{ width: `${result.interestPercent}%` }}
            className="bg-[#4778B8]/55 h-full transition-all duration-200"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-xs text-[#778397]">Loan Principal ({result.principalPercent}%)</p>
            <p className="font-semibold text-[#202B3C] tabular-nums mt-0.5">
              {formatCurrency(loanPrincipal)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#778397]">Total Interest ({result.interestPercent}%)</p>
            <p className="font-semibold text-[#202B3C] tabular-nums mt-0.5">
              {formatCurrency(result.totalInterest)}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#778397]">Total Payable</p>
            <p className="font-semibold text-[#142D4E] tabular-nums mt-0.5">
              {formatCurrency(result.totalPayable)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
