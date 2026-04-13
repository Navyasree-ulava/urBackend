import React from 'react';
import { User, Search, Settings, UserPlus } from 'lucide-react';

const AuthHeader = ({ 
  searchTerm, setSearchTerm, isAuthEnabled, hasUserCollection, 
  onConfigureFields, onAddUser 
}) => {
  return (
    <div className="page-header" style={{ marginBottom: '2rem', borderBottom: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <h1 className="page-title" style={{ fontSize: '1.5rem', marginBottom: '4px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={20} color="var(--color-primary)" /> Authentication
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Manage users and authentication providers.</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '240px' }}>
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            placeholder="Search users..."
            className="input-field"
            style={{ paddingLeft: '32px', height: '32px', fontSize: '0.75rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isAuthEnabled && hasUserCollection && (
          <>
            <button 
              className="btn btn-secondary" 
              style={{ height: '32px', padding: '0 10px', fontSize: '0.75rem', gap: '6px' }}
              onClick={onConfigureFields}
            >
              <Settings size={14} /> <span className="hide-mobile">Fields</span>
            </button>
            <button 
              className="btn btn-primary" 
              style={{ height: '32px', padding: '0 12px', fontSize: '0.75rem', gap: '6px' }}
              onClick={onAddUser}
            >
              <UserPlus size={14} /> <span className="hide-mobile">Add User</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthHeader;
