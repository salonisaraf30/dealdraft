'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PromptPanel from '@/components/PromptPanel';
import MemoDocument from '@/components/MemoDocument';
import LoadingState from '@/components/LoadingState';
import EmptyState from '@/components/EmptyState';
import { DealType, GeneratedMemo } from '@/lib/types';

export default function Home() {
  const [memo, setMemo] = useState<GeneratedMemo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState('');

  const handleGenerate = async (prompt: string, dealType?: DealType) => {
    setIsLoading(true);
    setError(null);
    setCurrentPrompt(prompt);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, dealType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Generation failed');
      }

      setMemo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateSection = async (sectionTitle: string) => {
    if (!memo) return;

    // Mark section as regenerating
    setMemo((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        sections: prev.sections.map((s) =>
          s.title === sectionTitle ? { ...s, isRegenerating: true } : s
        ),
      };
    });

    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: currentPrompt,
          sectionTitle,
          existingMemo: memo,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Regeneration failed');
      }

      setMemo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.title === sectionTitle
              ? { ...s, content: data.content, isRegenerating: false }
              : s
          ),
        };
      });
    } catch (err) {
      // Restore section on error
      setMemo((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          sections: prev.sections.map((s) =>
            s.title === sectionTitle ? { ...s, isRegenerating: false } : s
          ),
        };
      });
      setError(err instanceof Error ? err.message : 'Regeneration failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Header />

      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px 64px',
        }}
      >
        {/* Prompt panel */}
        <div style={{ maxWidth: '720px', margin: '0 auto 32px' }}>
          <PromptPanel onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              maxWidth: '720px',
              margin: '0 auto 20px',
              padding: '12px 16px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.3)',
              borderRadius: '6px',
              color: '#fca5a5',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              style={{
                background: 'none',
                border: 'none',
                color: '#fca5a5',
                cursor: 'pointer',
                fontSize: '1rem',
                padding: '0 0 0 12px',
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Content area */}
        {isLoading ? (
          <LoadingState />
        ) : memo ? (
          <MemoDocument memo={memo} onRegenerateSection={handleRegenerateSection} />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}
