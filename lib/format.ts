export function formatPrice(cents: number): string {
  return `£${(cents / 100).toFixed(2)}`;
}

export function calculateDeliveryFee(totalWeightKg: number): number {
  if (totalWeightKg <= 0) return 0;
  if (totalWeightKg <= 10) return 1000; // £10 in pence
  if (totalWeightKg <= 20) return 2000; // £20 in pence
  return 3000; // £30, anything above 20kg
}
