import { z } from "zod";

export const TrisomyRiskSchema = z.object({
  age: z.number().min(15).max(50),
  weight: z.number().min(35).max(200).optional(),
  height: z.number().min(120).max(220).optional(),
  gestationalAge: z.number().min(11).max(14).optional(),
  bpd: z.number().min(10).max(100).optional(),
  nuchalTranslucency: z.number().min(0.5).max(6.5).optional(),
  nasalBone: z.boolean().optional(),
  ductusFlow: z.enum(['normal', 'reversed', 'absent']).optional(),
  tricuspidFlow: z.enum(['normal', 'regurgitation']).optional(),
  previousT21: z.boolean().optional(),
  ethnicity: z.enum(['caucasian', 'afro', 'asian', 'oriental', 'mixed']).optional(),
  smoking: z.boolean().optional(),
  diabetes: z.boolean().optional(),
  pappa: z.number().min(0.1).max(10).optional(),
  bhcg: z.number().min(0.1).max(10).optional(),
});

export type TrisomyRisk = z.infer<typeof TrisomyRiskSchema>;


export const ExtendedTrisomyRiskSchema = z.object({
  maternalAge: z.string(),
  gestationalWeeks: z.string(),
  gestationalDays: z.string().default('0'),
  bileAcids: z.string(),
  totalBilirubin: z.string(),
  got: z.string(),
  gpt: z.string(),
  pappA: z.string(),
  freeBetaHCG: z.string(),
  nuchalTranslucency: z.string(),
  heartRate: z.string(),
  crownRumpLength: z.string(),
  nasalBone: z.string().default('normal'),
  tricuspidRegurgitation: z.string().default('normal'),
  ductusVenosus: z.string().default('normal'),
  previousT21: z.boolean().default(false)
});

export type ExtendedTrisomyRisk = z.infer<typeof ExtendedTrisomyRiskSchema>;

export interface MarkerValues {
  maternalAge: string;
  gestationalAge: string;
  nuchalTranslucency: string;
  pappA: string;
  freeBetaHCG: string;
  afp: string;
  uE3: string;
  inhibinA: string;
  hCG: string;
}

export interface RiskResults {
  baselineRisk: RiskInterpretation;
  firstTrimesterRisk: RiskInterpretation;
  secondTrimesterRisk: RiskInterpretation;
}

export interface RiskInterpretation {
  risk: number;
  interpretation: string;
  details: string[];
}

export interface RiskResult {
  risk: number;
  interpretation: string;
  details: string[];
  recommendations: string[];
}