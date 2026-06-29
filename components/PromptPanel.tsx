'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DealType } from '@/lib/types';
import { DEAL_TYPES } from '@/lib/constants';

interface Props {
  onGenerate: (prompt: string, dealType?: DealType) => void;
  isLoading: boolean;
}

export default function PromptPanel({ onGenerate, isLoading }: Props) {
  const [selectedType, setSelectedType] = useState<DealType | null>(null);
  const [prompt, setPrompt] = useState('');

  const handleDealTypeSelect = (id: DealType) => {
    if (selectedType === id) {
      setSelectedType(null);
      return;
    }
    setSelectedType(id);
    const option = DEAL_TYPES.find((d) => d.id === id);
    if (option) setPrompt(option.templatePrompt);
  };

  const handleSubmit = () => {
    if (!prompt.trim() || isLoading) return;
    onGenerate(prompt.trim(), selectedType ?? undefined);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '24px',
      }}
    >
      {/* Deal type pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {DEAL_TYPES.map((dt) => {
          const active = selectedType === dt.id;
          return (
            <button
              key={dt.id}
              onClick={() => handleDealTypeSelect(dt.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: active ? '1px solid var(--accent)' : '1px solid var(--border)',
                backgroundColor: active ? 'var(--accent-subtle)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: active ? '500' : '400',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {dt.label}
            </button>
          );
        })}
      </div>

      {/* Textarea */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe the deal... e.g., 'Series B for a healthcare AI startup with $8M ARR, 120% NRR, targeting $40M raise'"
        rows={4}
        style={{
          width: '100%',
          resize: 'vertical',
          backgroundColor: 'var(--bg-primary)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '12px 14px',
          color: 'var(--text-primary)',
          fontSize: '0.9375rem',
          lineHeight: '1.6',
          fontFamily: 'inherit',
          outline: 'none',
          marginBottom: '12px',
          minHeight: '90px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-active)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
      />

      {/* Generate button */}
      <button
        onClick={handleSubmit}
        disabled={!prompt.trim() || isLoading}
        style={{
          width: '100%',
          padding: '11px',
          borderRadius: '6px',
          border: 'none',
          backgroundColor:
            !prompt.trim() || isLoading ? 'rgba(201, 168, 76, 0.4)' : 'var(--accent)',
          color: !prompt.trim() || isLoading ? 'rgba(255,255,255,0.5)' : '#1a1200',
          fontSize: '0.9375rem',
          fontWeight: '600',
          cursor: !prompt.trim() || isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'background-color 0.15s ease',
        }}
        onMouseEnter={(e) => {
          if (!isLoading && prompt.trim()) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent-hover)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && prompt.trim()) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--accent)';
          }
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
            Generating...
          </>
        ) : (
          'Generate Memo'
        )}
      </button>

      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'center' }}>
        ⌘+Enter to generate
      </p>
    </div>
  );
}
