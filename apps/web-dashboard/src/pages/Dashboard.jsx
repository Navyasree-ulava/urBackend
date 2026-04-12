import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, Activity, Zap, Database, HardDrive, LayoutGrid } from 'lucide-react';

import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useLayout } from '../context/LayoutContext';

import DashboardShell from '../components/Dashboard/DashboardShell';
import DashboardHeader from '../components/Dashboard/DashboardHeader';
import SectionHeader from '../components/Dashboard/SectionHeader';
import ProjectGrid from '../components/Dashboard/ProjectGrid';
import EmptyState from '../components/Dashboard/EmptyState';
import SkeletonLoader from '../components/Dashboard/SkeletonLoader';
import RecentActivityItem from '../components/Dashboard/RecentActivityItem';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const { setHeaderContent } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, statsRes, activityRes] = await Promise.all([
          api.get('/api/projects'),
          api.get('/api/analytics/stats'),
          api.get('/api/analytics/activity')
        ]);
        
        setProjects(projectsRes.data);
        setGlobalStats(statsRes.data);
        setActivity(activityRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Could not load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) fetchData();
  }, [user]);

  // Inject search bar into global header
  useEffect(() => {
    setHeaderContent(
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', maxWidth: '600px' }}>
        <div className="auth-input-wrap" style={{ flex: 1 }}>
          <Search size={18} style={{ left: '14px', position: 'absolute', color: 'var(--color-text-muted)', zIndex: 1 }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search projects..."
            style={{ paddingLeft: '2.8rem', height: '38px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    );
    return () => setHeaderContent(null);
  }, [searchTerm, setHeaderContent]);

  const handleCreateProject = () => navigate('/create-project');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate global stats directly from projects array for 100% accuracy
  const totalDatabaseUsed = projects.reduce((acc, p) => acc + (p.databaseUsed || 0), 0);
  const totalStorageUsed = projects.reduce((acc, p) => acc + (p.storageUsed || 0), 0);
  const totalRequests = globalStats?.totalRequests || 0;

  const formatSize = (bytes) => {
    if (!bytes) return '0 MB';
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  return (
    <DashboardShell>
      <DashboardHeader onCreateProject={handleCreateProject} />

      {/* Global Usage Overview Belt - More Compact */}
      {!isLoading && (
        <div className="glass-card" style={{ 
          padding: '1rem 1.5rem', 
          borderRadius: '12px', 
          marginBottom: '1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1.5rem',
          background: 'linear-gradient(135deg, rgba(62, 207, 142, 0.05) 0%, rgba(123, 97, 255, 0.05) 100%)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LayoutGrid size={12} /> Total Projects
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{projects.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={12} /> Database Used
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatSize(totalDatabaseUsed)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HardDrive size={12} /> Storage Used
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>{formatSize(totalStorageUsed)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={12} /> API Requests
            </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)' }}>{totalRequests}</span>
          </div>
        </div>
      )}

      {/* Main Split Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem' }} className="dashboard-split-layout">
        <style>{`
          @media (max-width: 1100px) {
            .dashboard-split-layout {
              grid-template-columns: 1fr !important;
            }
            .activity-sidebar {
              display: none;
            }
          }
        `}</style>

        {/* Left Column: Projects */}
        <div>
          <SectionHeader title={searchTerm ? `Search Results (${filteredProjects.length})` : "Your Projects"} />
          
          {isLoading ? (
            <SkeletonLoader />
          ) : projects.length === 0 ? (
            <EmptyState onCreateProject={handleCreateProject} />
          ) : (
            <ProjectGrid
              projects={filteredProjects}
              onCreateProject={handleCreateProject}
            />
          )}
        </div>

        {/* Right Column: Activity Sidebar */}
        <div className="activity-sidebar">
          <SectionHeader title="Recent Activity" />
          <div className="glass-card custom-scrollbar" style={{ 
            padding: '1.25rem', 
            borderRadius: '12px', 
            maxHeight: '600px', 
            overflowY: 'auto',
            background: 'var(--color-bg-card)',
            border: '1px solid var(--color-border)'
          }}>
            {activity.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
                No recent activity found.
              </p>
            ) : (
              activity.map(item => (
                <RecentActivityItem key={item.id} activity={item} />
              ))
            )}
            <button className="btn btn-ghost" style={{ width: '100%', marginTop: '1rem', fontSize: '0.75rem', opacity: 0.6 }}>
              View All Logs
            </button>
          </div>

          <div className="glass-card" style={{ 
            marginTop: '2rem', 
            padding: '1.25rem', 
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(123, 97, 255, 0.1) 0%, rgba(0,0,0,0) 100%)',
            border: '1px solid rgba(123, 97, 255, 0.2)'
          }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={14} color="#7B61FF" /> Upgrade to Pro
            </h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', lineHeight: '1.4', marginBottom: '1rem' }}>
              Get unlimited projects, custom domains, and advanced analytics.
            </p>
            <button className="btn btn-primary" style={{ width: '100%', height: '36px', fontSize: '0.8rem', background: '#7B61FF', borderColor: '#7B61FF' }}>
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
