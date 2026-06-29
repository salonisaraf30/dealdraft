'use client';

import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { MemoSection as MemoSectionType } from '@/lib/types';
import { renderMarkdown } from '@/lib/renderMarkdown';

interface Props {
  section: MemoSectionType;
  onRegenerate: (sectionTitle: string) => void;
  animationDelay: number;
}

export default function MemoSection({ section, onRegenerate, animationDelay }: Props) {
  const [hovered, setHovered] = useState(false);
  const [flashing, setFlashing] = useState(false);

  const handleRegenerate = () => {
    onRegenerate(section.title);
    // Gold flash after regeneration
    setTimeout(() => {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 800);
    }, 100);
  };

  return (
    <div
      className="animate-fade-up"
      style={{
        animationDelay: `${animationDelay}ms`,
        opacity: 0,
        marginBottom: '32px',
        borderLeft: flashing ? '3px solid var(--accent)' : '3px solid transparent',
        paddingLeft: flashing ? '12px' : '0',
        transition: 'border-color 0.4s ease, padding-left 0.4s ease',
      }}
    >
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid #e2e8f0',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <h2
          style={{
            fontSize: '0.8125rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#374151',
          }}
        >
          {section.number}. {section.title}
        </h2>

        <button
          onClick={handleRegenerate}
          disabled={section.isRegenerating}
          style={{
            opacity: hovered || section.isRegenerating ? 1 : 0,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0',
            backgroundColor: 'transparent',
            cursor: section.isRegenerating ? 'not-allowed' : 'pointer',
            fontSize: '0.75rem',
            color: '#6b7280',
            transition: 'opacity 0.15s ease, background-color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f9fafb';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          }}
        >
          <RotateCw
            size={12}
            style={{
              animation: section.isRegenerating ? 'spin 0.8s linear infinite' : 'none',
            }}
          />
          {section.isRegenerating ? 'Regenerating...' : 'Regenerate'}
        </button>
      </div>

      {/* Section content */}
      <div
        className="memo-prose"
        style={{
          opacity: section.isRegenerating ? 0.4 : 1,
          transition: 'opacity 0.3s ease',
          position: 'relative',
        }}
      >
        {section.isRegenerating && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: '2px solid #e2e8f0',
                borderTopColor: '#9ca3af',
              }}
              className="animate-spin"
            />
          </div>
        )}
        {renderMarkdown(section.content)}
      </div>
    </div>
  );
}
