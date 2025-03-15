
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
export function calculateFirstTrimesterRisk(params: {
  maternalAge: number;
  gestationalAge: number;
  crl: number;
  nt: number;
  bhcg: number;
  pappa: number;
  previousT21: boolean;
}) {
  // Basic risk calculation based on maternal age
  let baseRisk = Math.exp(-16.51 + 0.286 * params.maternalAge);
  
  // Adjust for previous T21
  if (params.previousT21) {
    baseRisk *= 2.5;
  }

  // Adjust for biochemical markers (simplified calculation)
  const ntMoM = params.nt / 2.0; // Assuming 2.0mm is median NT for CRL
  const bhcgMoM = params.bhcg / 1.0; // Simplified MoM calculation
  const pappaMoM = params.pappa / 1.0; // Simplified MoM calculation

  // Combined risk calculation
  const combinedRisk = baseRisk * ntMoM * bhcgMoM * (1/pappaMoM);
  
  return Math.min(combinedRisk, 1);
}
