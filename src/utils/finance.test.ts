import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateEmi,
  calculatePricePerSqFt,
  formatCurrency,
  formatListingPrice,
  generateLeadId,
} from './finance';

test('calculateEmi computes accurate monthly payment and totals for standard mortgage', () => {
  // $500,000 at 6% for 30 years => ~$2,998/month
  const result = calculateEmi(500000, 6, 30);
  assert.equal(result.monthlyEmi, 2998);
  assert.ok(result.totalInterest > 570000);
  assert.equal(result.principalPercent + result.interestPercent, 100);
});

test('calculateEmi handles zero interest rate gracefully', () => {
  const result = calculateEmi(120000, 0, 10);
  assert.equal(result.monthlyEmi, 1000);
  assert.equal(result.totalInterest, 0);
  assert.equal(result.principalPercent, 100);
});

test('calculatePricePerSqFt handles positive and zero areas safely', () => {
  assert.equal(calculatePricePerSqFt(900000, 2000), 450);
  assert.equal(calculatePricePerSqFt(900000, 0), 0);
});

test('formatCurrency and formatListingPrice produce clean readable strings', () => {
  assert.equal(formatCurrency(1450000), '$1,450,000');
  assert.equal(formatCurrency(1450000, true), '$1.45M');
  assert.equal(formatListingPrice(4800, 'monthly'), '$4,800 / mo');
});

test('generateLeadId returns unique structured lead identifier', () => {
  const id = generateLeadId(5, 1700000012345);
  assert.equal(id, 'LD-0106-2345');
});
