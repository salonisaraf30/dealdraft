'use client';

export default function EmptyState() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '64px 24px',
        textAlign: 'center',
      }}
    >
      {/* Icon composition */}
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '24px',
          position: 'relative',
        }}
      >
        <svg
          width="36"
          height="36"
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="6" y="4" width="24" height="28" rx="3" fill="var(--bg-secondary)" stroke="var(--border-active)" strokeWidth="1.5" />
          <line x1="10" y1="11" x2="26" y2="11" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="16" x2="22" y2="16" stroke="var(--border-active)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="21" x2="24" y2="21" stroke="var(--border-active)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="10" y1="26" x2="20" y2="26" stroke="var(--border-active)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="28" cy="27" r="6" fill="var(--bg-primary)" stroke="var(--accent)" strokeWidth="1.5" />
          <path d="M26 27l1.5 1.5L30 25" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2
        style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        Describe a deal to generate a memo
      </h2>

      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          maxWidth: '380px',
          lineHeight: '1.6',
          marginBottom: '28px',
        }}
      >
        DealDraft uses AI to create structured investment memos from natural
        language prompts — in seconds.
      </p>

      {/* Feature pills */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {['Structured Sections', 'Financial Analysis', 'One-Click Regenerate'].map((feat) => (
          <span
            key={feat}
            style={{
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--bg-secondary)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              letterSpacing: '0.01em',
            }}
          >
            {feat}
          </span>
        ))}
      </div>
    </div>
  );
}
