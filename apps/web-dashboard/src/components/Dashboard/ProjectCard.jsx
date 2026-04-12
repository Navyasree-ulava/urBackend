import React from 'react';
import { Link } from 'react-router-dom';
import { Database, HardDrive, ArrowRight, Shield, Globe, Clock } from 'lucide-react';
import UsageProgressBar from './UsageProgressBar';

const ProjectCard = ({ project }) => {
  const cardStyle = {
    background: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: '10px',
    padding: '1.25rem', // Reduced padding
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    cursor: 'pointer'
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Link
      to={`/project/${project._id}`}
      className="dashboard-card-link"
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      <div className="dashboard-card group glass-card" style={cardStyle}>
        {/* Top Section: Icon & Status */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{
            width: '36px', height: '36px', // Smaller icon wrap
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(62, 207, 142, 0.1), rgba(0,0,0,0))',
            color: 'var(--color-primary)',
            border: '1px solid rgba(62, 207, 142, 0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Database size={16} /> {/* Smaller icon */}
          </div>
          
          <div className={`badge badge-${project.health === 'warning' ? 'warning' : 'success'}`} style={{ padding: '2px 8px', fontSize: '0.65rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }}></span>
            {project.health === 'warning' ? 'Degraded' : 'Active'}
          </div>
        </div>

        {/* Info Section */}
        <div style={{ marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--color-text-main)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
            {project.name}
            </h3>
            <p style={{
            color: 'var(--color-text-muted)',
            fontSize: '0.8rem', // Smaller text
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
            }}>
            {project.description || "No description provided."}
            </p>
        </div>

        {/* Usage Metrics */}
        <div style={{ flex: 1 }}>
            <UsageProgressBar 
                label="Database" 
                used={project.metrics?.database?.used || project.databaseUsed || 0} 
                limit={project.metrics?.database?.limit || project.databaseLimit || 20 * 1024 * 1024} 
            />
            <UsageProgressBar 
                label="Storage" 
                used={project.metrics?.storage?.used || project.storageUsed || 0} 
                limit={project.metrics?.storage?.limit || project.storageLimit || 20 * 1024 * 1024} 
            />
        </div>

        {/* Footer Metrics */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          paddingTop: '0.75rem',
          marginTop: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'var(--color-text-muted)',
          fontSize: '0.7rem' // Smaller footer text
        }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={11} />
                <span>{formatDate(project.updatedAt)}</span>
            </div>
            {project.isAuthEnabled && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)' }}>
                    <Shield size={11} />
                    <span>Auth</span>
                </div>
            )}
          </div>
          <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
