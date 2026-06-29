import { DealTypeOption } from './types';

export const DEAL_TYPES: DealTypeOption[] = [
  {
    id: 'ma_advisory',
    label: 'M&A Advisory',
    templatePrompt:
      'Sell-side M&A advisory for a mid-market SaaS company with $25M ARR, 85% gross margins, and 40% YoY growth, seeking strategic acquirers in the enterprise software space.',
  },
  {
    id: 'series_fundraise',
    label: 'Series Fundraise',
    templatePrompt:
      'Series B fundraise for a healthcare AI startup with $12M ARR, 130% net revenue retention, FDA-cleared diagnostic platform, targeting a $50M raise at $300M pre-money valuation.',
  },
  {
    id: 'lbo_buyout',
    label: 'LBO / Buyout',
    templatePrompt:
      'Leveraged buyout of a specialty chemicals manufacturer with $180M revenue, 22% EBITDA margins, and stable cash flows, targeting 3.5x entry multiple with 60% leverage.',
  },
  {
    id: 'ipo_readiness',
    label: 'IPO Readiness',
    templatePrompt:
      'IPO readiness assessment for a fintech payments platform with $200M ARR, processing $50B+ annually, 65% gross margins, expanding into cross-border payments.',
  },
  {
    id: 'market_entry',
    label: 'Market Entry',
    templatePrompt:
      'Market entry analysis for a European insurtech expanding into the US market, with €40M ARR, proprietary claims automation technology, and partnerships with 3 top-10 EU insurers.',
  },
];
