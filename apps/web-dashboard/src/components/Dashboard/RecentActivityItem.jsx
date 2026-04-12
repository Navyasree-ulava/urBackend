import React from 'react';
import { Clock } from 'lucide-react';

const RecentActivityItem = ({ activity }) => {
  const getStatusColor = (status) => {
    if (status >= 500) return '#ea5455';
    if (status >= 400) return '#FFBD2E';
    return '#3ECF8E';
  };

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div style={{ 
      padding: '12px 0', 
      borderBottom: '1px solid var(--color-border)',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
          {activity.method} <span style={{ color: 'var(--color-text-muted)', fontWeight: 400 }}>{activity.path}</span>
        </span>
        <div style={{ 
          width: '8px', height: '8px', borderRadius: '50%', 
          background: getStatusColor(activity.status),
          boxShadow: `0 0 8px ${getStatusColor(activity.status)}`
        }}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
        <span>{activity.projectName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={10} />
          {timeAgo(activity.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default RecentActivityItem;
