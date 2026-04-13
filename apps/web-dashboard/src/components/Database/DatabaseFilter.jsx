import React from 'react';
import { ArrowUpDown, Filter, Trash2, Plus } from 'lucide-react';

const DatabaseFilter = ({ 
  queryParams, setQueryParams, activeCollection, onClose 
}) => {
  return (
    <>
      <div className="fixed-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 1000 }} onClick={onClose} />
      <div className="filter-menu glass-panel" style={{ 
        position: 'absolute', right: 0, top: 'calc(100% + 8px)', width: '280px', 
        zIndex: 1001, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem',
        background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', 
        boxShadow: 'var(--shadow-premium)', borderRadius: '8px'
      }}>
        
        {/* Sort Section */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={12} /> SORT BY
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select 
              className="input-field" 
              value={queryParams.sort.replace('-', '')}
              onChange={(e) => {
                const isDesc = queryParams.sort.startsWith('-');
                setQueryParams(p => ({ ...p, sort: `${isDesc ? '-' : ''}${e.target.value}` }));
              }}
              style={{ flex: 1, height: '32px', padding: '0 8px', fontSize: '0.75rem' }}
            >
              <option value="createdAt">Created At</option>
              {activeCollection?.model?.map(f => (
                <option key={f.key} value={f.key}>{f.key}</option>
              ))}
            </select>
            <button 
              className="btn btn-secondary"
              style={{ padding: '0 8px', height: '32px' }}
              onClick={() => {
                const isDesc = queryParams.sort.startsWith('-');
                const field = queryParams.sort.replace('-', '');
                setQueryParams(p => ({ ...p, sort: isDesc ? field : `-${field}` }));
              }}
            >
              {queryParams.sort.startsWith('-') ? '↓' : '↑'}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        <div>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={12} /> FILTERS
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {queryParams.filters.map((filter, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <select 
                  className="input-field"
                  value={filter.field}
                  onChange={e => {
                    const newFilters = [...queryParams.filters];
                    newFilters[idx].field = e.target.value;
                    setQueryParams(p => ({ ...p, filters: newFilters }));
                  }}
                  style={{ width: '35%', height: '28px', padding: '0 4px', fontSize: '0.7rem' }}
                >
                  <option value="" disabled>Field</option>
                  {activeCollection?.model?.map(f => (
                    <option key={f.key} value={f.key}>{f.key}</option>
                  ))}
                </select>
                
                <select 
                  className="input-field"
                  value={filter.operator}
                  onChange={e => {
                    const newFilters = [...queryParams.filters];
                    newFilters[idx].operator = e.target.value;
                    setQueryParams(p => ({ ...p, filters: newFilters }));
                  }}
                  style={{ width: '25%', height: '28px', padding: '0 4px', fontSize: '0.7rem' }}
                >
                  <option value="=">=</option>
                  <option value="_gt">&gt;</option>
                  <option value="_lt">&lt;</option>
                </select>
                
                <input 
                  type="text"
                  className="input-field"
                  placeholder="Value"
                  value={filter.value}
                  onChange={e => {
                    const newFilters = [...queryParams.filters];
                    newFilters[idx].value = e.target.value;
                    setQueryParams(p => ({ ...p, filters: newFilters }));
                  }}
                  style={{ width: '30%', height: '28px', padding: '0 6px', fontSize: '0.7rem' }}
                />
                
                <button 
                  style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', display: 'flex' }}
                  onClick={() => {
                    setQueryParams(p => ({ ...p, filters: p.filters.filter((_, i) => i !== idx) }));
                  }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          
          <button 
            className="btn btn-ghost"
            style={{ width: '100%', fontSize: '0.7rem', marginTop: '8px', border: '1px dashed var(--color-border)' }}
            onClick={() => {
              setQueryParams(p => ({ 
                ...p, 
                filters: [...p.filters, { field: '', operator: '=', value: '' }] 
              }));
            }}
          >
            <Plus size={12} /> Add Filter
          </button>
        </div>
        
        <button 
          className="btn btn-primary" 
          style={{ width: '100%', height: '32px', fontSize: '0.75rem' }}
          onClick={onClose}
        >
          Apply Queries
        </button>
      </div>
    </>
  );
};

export default DatabaseFilter;
