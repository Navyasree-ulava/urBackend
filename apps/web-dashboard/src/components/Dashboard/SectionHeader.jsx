import React from 'react';

const SectionHeader = ({ title }) => {
  return (
    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <h2 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text-main)', letterSpacing: '-0.01em', textTransform: 'uppercase', opacity: 0.8 }}>{title}</h2>
      <div style={{ height: '1px', flex: 1, background: 'var(--color-border)', opacity: 0.5 }}></div>
    </div>
  );
};

export default SectionHeader;
