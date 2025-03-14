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

export interface RiskResult {
  risk: number;
  interpretation: string;
  details: string[];
  recommendations: string[];
}
