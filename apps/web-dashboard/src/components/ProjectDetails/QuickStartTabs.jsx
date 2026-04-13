import React, { useState } from 'react';
import { Copy, Terminal, Code2, Globe, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const QuickStartTabs = ({ publicUrl }) => {
  const [activeTab, setActiveTab] = useState('sdk');

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Snippet copied!");
  };

  const snippets = {
    sdk: `// Install: npm install @urbackend/sdk
import urBackend from '@urbackend/sdk';

const client = urBackend({ 
  apiKey: 'YOUR_PUBLISHABLE_KEY' 
});

// Insert data (Public Collection)
const data = await client.db.insert('posts', { 
  title: 'Hello World' 
});`,
    
    auth: `// The 'users' collection is special. Use Auth API:
import urBackend from '@urbackend/sdk';

const client = urBackend({ apiKey: 'YOUR_PUBLISHABLE_KEY' });

// Sign up a new user
const { accessToken } = await client.auth.signup({
  email: 'user@example.com',
  password: 'password123'
});`,

    curl: `curl -X POST "${publicUrl}/api/data/posts" \\
  -H "x-api-key: YOUR_PUBLISHABLE_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "Hello World"}'`
  };

  const tabs = [
    { id: 'sdk', label: 'SDK (JS/Node)', icon: Code2 },
    { id: 'auth', label: 'Auth (Users)', icon: Shield },
    { id: 'curl', label: 'cURL', icon: Terminal },
  ];

  return (
    <div className="glass-card" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
      <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--color-border)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: activeTab === tab.id ? 'rgba(62, 207, 142, 0.05)' : 'transparent',
              color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-muted)',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>
      <div style={{ position: 'relative', background: '#0a0a0a' }}>
        <pre style={{ 
          padding: '1.25rem', 
          margin: 0, 
          fontSize: '0.7rem', 
          color: '#d4d4d4', 
          overflowX: 'auto',
          fontFamily: 'monospace',
          lineHeight: '1.6'
        }}>
          <code>{snippets[activeTab]}</code>
        </pre>
        <button
          onClick={() => copyToClipboard(snippets[activeTab])}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#888',
            padding: '6px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <Copy size={14} />
        </button>
      </div>
    </div>
  );
};

export default QuickStartTabs;
