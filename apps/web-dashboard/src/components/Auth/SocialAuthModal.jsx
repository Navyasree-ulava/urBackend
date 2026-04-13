import React from 'react';
import { X, Settings } from 'lucide-react';

const SocialAuthModal = ({ 
  isOpen, onClose, selectedProvider, setSelectedProvider, 
  authProviders, handleProviderFieldChange, handleSaveProviders, 
  isSavingProviders, siteUrl, githubCallbackUrl, googleCallbackUrl 
}) => {
  if (!isOpen) return null;

  const activeProvider = selectedProvider === 'google' ? authProviders.google : authProviders.github;
  const activeCallbackUrl = selectedProvider === 'google' ? googleCallbackUrl : githubCallbackUrl;

  return (
    <div
      className="modal-overlay"
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        className="glass-card modal-content"
        style={{ width: '100%', maxWidth: '600px', position: 'relative', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', borderRadius: '12px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="btn-icon" style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={20} color="var(--color-primary)" /> Social Auth Settings
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>
            Configure OAuth credentials for your application.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            className={`btn ${selectedProvider === 'github' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedProvider('github')}
            style={{ fontSize: '0.75rem', height: '30px' }}
          >
            GitHub
          </button>
          <button
            className={`btn ${selectedProvider === 'google' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setSelectedProvider('google')}
            style={{ fontSize: '0.75rem', height: '30px' }}
          >
            Google
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>{selectedProvider === 'google' ? 'Google Cloud' : 'GitHub App'}</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!activeProvider.enabled}
                onChange={(e) => handleProviderFieldChange(selectedProvider, 'enabled', e.target.checked)}
              />
              Enable Provider
            </label>
          </div>

          <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px', textTransform: 'uppercase' }}>Redirect Configuration</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.5' }}>
              Origin: <code style={{ color: 'var(--color-text-main)' }}>{siteUrl || 'Configure Site URL in Settings'}</code><br />
              Callback: <code style={{ color: 'var(--color-text-main)' }}>{activeCallbackUrl}</code>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Client ID</label>
            <input
              className="input-field"
              value={activeProvider.clientId}
              onChange={(e) => handleProviderFieldChange(selectedProvider, 'clientId', e.target.value)}
              placeholder="Enter your client id"
              style={{ fontSize: '0.8rem', height: '36px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Client Secret</label>
            <input
              type="password"
              className="input-field"
              value={activeProvider.clientSecret}
              onChange={(e) => handleProviderFieldChange(selectedProvider, 'clientSecret', e.target.value)}
              placeholder={activeProvider.hasClientSecret ? '•••••••• (Saved)' : 'Enter client secret'}
              style={{ fontSize: '0.8rem', height: '36px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '2rem' }}>
          <button className="btn btn-secondary" onClick={onClose} style={{ height: '32px', fontSize: '0.75rem' }}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSaveProviders}
            disabled={isSavingProviders}
            style={{ height: '32px', fontSize: '0.75rem' }}
          >
            {isSavingProviders ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SocialAuthModal;
