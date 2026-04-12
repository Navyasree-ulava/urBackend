import React from 'react';
import { Plus } from 'lucide-react';

const DashboardHeader = ({ title = "Overview", subtitle = "Manage and monitor your projects in real-time.", onCreateProject }) => {
  return (
    <div className="page-header" style={{ marginBottom: '1rem', borderBottom: 'none' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '4px', letterSpacing: '-0.02em' }}>{title}</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
            {subtitle}
          </p>
        </div>
        <button
          onClick={onCreateProject}
          className="btn btn-primary"
          style={{ padding: '6px 14px', gap: '6px', fontSize: '0.8rem', height: '36px' }}
        >
          <Plus size={14} /> New Project
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
