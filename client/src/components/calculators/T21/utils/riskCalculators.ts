
export function calculateAgeBasedRisk(age: number): number {
  if (age < 20) return 0.0007;
  if (age > 45) return 0.0385;
  
  const baseRisk = Math.exp(-16.2395 + (0.286 * age));
  return baseRisk / (1 + baseRisk);
}

export function calculateFirstTrimesterRisk(
  baseRisk: number,
  nt: number,
  pappA: number,
  freeBetaHCG: number
): number {
  const ntFactor = Math.exp(0.318 * (nt - 2.0));
  const pappAFactor = Math.exp(-0.3619 * (Math.log10(pappA)));
  const hcgFactor = Math.exp(0.2642 * (Math.log10(freeBetaHCG)));
  
  return baseRisk * ntFactor * pappAFactor * hcgFactor;
}
