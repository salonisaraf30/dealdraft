'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'Analyzing deal structure...',
  'Drafting executive summary...',
  'Building financial overview...',
  'Assessing market landscape...',
  'Evaluating risks & opportunities...',
  'Finalizing memo...',
];

export default function LoadingState() {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          clearInterval(interval);
          return prev;
        }
        setCompletedSteps((c) => [...c, prev]);
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '64px 24px',
      }}
    >
      {/* Spinner */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '2px solid var(--border)',
          borderTopColor: 'var(--accent)',
          marginBottom: '36px',
        }}
        className="animate-spin"
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '340px' }}>
        {STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(i);
          const isActive = activeStep === i;
          const isPending = !isCompleted && !isActive;

          return (
            <div
              key={step}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: isPending ? 0.3 : 1,
                transition: 'opacity 0.4s ease',
              }}
            >
              {/* Status dot */}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  backgroundColor: isCompleted
                    ? 'var(--success)'
                    : isActive
                    ? 'var(--accent)'
                    : 'var(--border-active)',
                  transition: 'background-color 0.3s ease',
                }}
              />
              <span
                style={{
                  fontSize: '0.875rem',
                  color: isActive
                    ? 'var(--text-primary)'
                    : isCompleted
                    ? 'var(--text-secondary)'
                    : 'var(--text-muted)',
                  fontWeight: isActive ? '500' : '400',
                }}
              >
                {step}
              </span>
              {isCompleted && (
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ marginLeft: 'auto', flexShrink: 0 }}
                >
                  <path
                    d="M2.5 7l3 3 6-6"
                    stroke="var(--success)"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
