export type DealType =
  | 'ma_advisory'
  | 'series_fundraise'
  | 'lbo_buyout'
  | 'ipo_readiness'
  | 'market_entry';

export interface DealTypeOption {
  id: DealType;
  label: string;
  templatePrompt: string;
}

export interface MemoSection {
  id: string;
  number: number;
  title: string;
  content: string;
  isRegenerating: boolean;
}

export interface GeneratedMemo {
  dealTitle: string;
  dealType: string;
  subtitle: string;
  generatedAt: string;
  sections: MemoSection[];
}

export interface GenerateRequest {
  prompt: string;
  dealType?: DealType;
}

export interface RegenerateRequest {
  prompt: string;
  dealType?: DealType;
  sectionTitle: string;
  existingMemo: GeneratedMemo;
}
