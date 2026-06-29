# DealDraft

AI-powered deal memo generator that turns natural language deal descriptions
into structured, professional investment memos.

Built as a portfolio project demonstrating frontend engineering for AI-powered
financial workflows — the exact problem space of [Farsight AI](https://farsight-ai.com).

## Features

- **Prompt → Memo:** Describe any deal and get a formatted investment memo
- **Deal Templates:** Pre-built prompts for M&A, Series Fundraise, LBO, IPO, Market Entry
- **Section Regeneration:** Regenerate individual sections without redoing the full memo
- **Institutional Design:** Document rendering that mirrors real deal materials

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Claude API (Anthropic — claude-sonnet-4-6)
- Deployed on Vercel

## Run Locally

```bash
git clone https://github.com/salonisaraf30/dealdraft.git
cd dealdraft
npm install
echo "ANTHROPIC_API_KEY=your-key" > .env.local
npm run dev
```

## Built By

[Saloni Saraf](https://linkedin.com/in/salonisaraf02) — MS Computer Science (AI),
Stevens Institute of Technology

---

*This project demonstrates building interfaces for AI-generated financial content,
handling structured AI outputs, and creating clean, production-grade React/TypeScript
applications.*
