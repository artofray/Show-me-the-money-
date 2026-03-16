
export interface Politician {
  id: string;
  name: string;
  state: string;
  chamber: 'House' | 'Senate';
  party: 'Republican' | 'Democrat' | 'Independent';
  imageUrl?: string;
  website?: string;
  positions?: string[];
}

export interface DonorIndustry {
  industry: string;
  amount: number;
  percentage: number;
}

export interface AnalysisResult {
  summary: string;
  keyInsights: string[];
  donors: DonorIndustry[];
  sources: { title: string; uri: string }[];
}
