import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import ConfirmationModal from "./ConfirmationModal";
import AddRecordDrawer from "../components/AddRecordDrawer";
import CollectionTable from "../components/CollectionTable";
import DatabaseSidebar from "../components/DatabaseSidebar";
import RowDetailDrawer from "../components/RowDetailDrawer";
import RecordList from "../components/RecordList";
import { Database as DbIcon, FileText, Shield, X } from "lucide-react";

import DatabaseHeader from "../components/Database/DatabaseHeader";
import DatabaseFilter from "../components/Database/DatabaseFilter";

export default function Database() {
  const { projectId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [collections, setCollections] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [viewMode, setViewMode] = useState("table"); // Default to table for pro feel
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [collectionToDelete, setCollectionToDelete] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecord, setEditingRecord] = useState(null);

  const [queryParams, setQueryParams] = useState({
      page: 1,
      limit: 50,
      sort: '-createdAt',
      filters: []
  });
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [rlsEnabled, setRlsEnabled] = useState(false);
  const [rlsMode, setRlsMode] = useState("public-read");
  const [rlsOwnerField] = useState("userId");
  const [isRlsDialogOpen, setIsRlsDialogOpen] = useState(false);

  // ... (Keeping core logic: fetchProject, fetchData, handleSaveRls, etc. - mapped to new components)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/api/projects/${projectId}`);
        const withRlsDefaults = (res.data.collections || []).map(c => ({
            ...c,
            rls: {
              enabled: typeof c.rls?.enabled === 'boolean' ? c.rls.enabled : false,
              mode: c.rls?.mode === 'owner-write-only' ? 'public-read' : (c.rls?.mode || 'public-read'),
              ownerField: c.rls?.ownerField || 'userId',
              requireAuthForWrite: typeof c.rls?.requireAuthForWrite === 'boolean' ? c.rls.requireAuthForWrite : true
            }
        }));
        setProject(res.data);
        setCollections(withRlsDefaults);
        const queryCol = searchParams.get("collection");
        if (queryCol) {
          const found = withRlsDefaults.find(c => c.name === queryCol);
          if (found) setActiveCollection(found);
        } else if (withRlsDefaults.length > 0) {
          setActiveCollection(withRlsDefaults.find(c => c.name !== 'users') || withRlsDefaults[0]);
        }
      } catch { toast.error("Failed to load project"); }
    };
    fetchProject();
  }, [projectId, user, searchParams]);

  const fetchData = useCallback(async () => {
    if (!activeCollection) return;
    setLoadingData(true);
    try {
      let queryStr = `?page=${queryParams.page}&limit=${queryParams.limit}&sort=${queryParams.sort}`;
      queryParams.filters.forEach(f => {
         if (f.field && f.value !== '') queryStr += `&${f.field}${f.operator === '=' ? '' : f.operator}=${encodeURIComponent(f.value)}`;
      });
      const res = await api.get(`/api/projects/${projectId}/collections/${activeCollection.name}/data${queryStr}`);
      setData(res.data);
    } catch { toast.error("Failed to load data"); }
    finally { setLoadingData(false); }
  }, [activeCollection, projectId, queryParams]);

  useEffect(() => {
    if (!activeCollection) return;
    setSearchParams({ collection: activeCollection.name });
    fetchData();
  }, [activeCollection, fetchData, setSearchParams]);

  const handleSaveRls = async () => {
    try {
      await api.patch(`/api/projects/${projectId}/collections/${activeCollection.name}/rls`, {
        enabled: rlsEnabled, mode: rlsMode, ownerField: rlsOwnerField, requireAuthForWrite: true
      });
      toast.success("RLS settings saved");
      return true;
    } catch { toast.error("Failed to save RLS"); return false; }
  };

  const handleDeleteRecord = async (id) => {
    try {
      await api.delete(`/api/projects/${projectId}/collections/${activeCollection.name}/data/${id}`);
      setData(prev => prev.filter(item => item._id !== id));
      toast.success("Document deleted");
    } catch { toast.error("Failed to delete document"); }
  };

  return (
    <div className="db-layout" style={{ height: 'calc(100vh - var(--header-height))', display: 'flex', background: 'var(--color-bg-main)' }}>
      <DatabaseSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        // Filter out 'users' collection from database sidebar
        collections={collections.filter(c => c.name !== 'users')}
        activeCollection={activeCollection}
        setActiveCollection={setActiveCollection}
        project={project}
        navigate={navigate}
        projectId={projectId}
        onRequestDelete={setCollectionToDelete}
      />

      <main className="db-main" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '12px 12px 12px 0', border: '1px solid var(--color-border)', borderRadius: '8px', background: 'var(--color-bg-card)' }}>
        {activeCollection ? (
          <>
            <DatabaseHeader 
              project={project}
              activeCollection={activeCollection}
              dataLength={data.length}
              viewMode={viewMode}
              setViewMode={setViewMode}
              showFilterMenu={showFilterMenu}
              setShowFilterMenu={setShowFilterMenu}
              filtersCount={queryParams.filters.length}
              onRefresh={fetchData}
              onRlsClick={() => setIsRlsDialogOpen(true)}
              onAddRecord={() => {
                if (activeCollection?.name === 'users') {
                  toast.error('Use the Auth page to add/manage users.');
                  return;
                }
                setIsAddModalOpen(true);
              }}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />

            <div className="db-content" style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              {showFilterMenu && (
                <DatabaseFilter 
                  queryParams={queryParams}
                  setQueryParams={setQueryParams}
                  activeCollection={activeCollection}
                  onClose={() => setShowFilterMenu(false)}
                />
              )}

              {loadingData ? (
                <div style={{ padding: '2rem', textAlign: 'center' }} className="spinner"></div>
              ) : data.length === 0 ? (
                <div className="empty-state" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                  <FileText size={48} />
                  <p style={{ marginTop: '1rem' }}>No records found</p>
                </div>
              ) : viewMode === "list" ? (
                <RecordList data={data} activeCollection={activeCollection} onView={setSelectedRecord} />
              ) : viewMode === "table" ? (
                <CollectionTable data={data} activeCollection={activeCollection} onDelete={(id) => { setSelectedId(id); setShowModal(true); }} onView={setSelectedRecord} onEdit={(rec) => { if (activeCollection?.name === 'users') return; setEditingRecord(rec); setIsAddModalOpen(true); }} />
              ) : (
                <div style={{ height: '100%', overflow: 'auto', padding: '1.5rem', background: '#050505', color: 'var(--color-primary)', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}>
            <DbIcon size={64} />
          </div>
        )}
      </main>

      {/* RowDetailDrawer: hide Edit for users collection */}
      <RowDetailDrawer
        isOpen={!!selectedRecord}
        onClose={() => setSelectedRecord(null)}
        record={selectedRecord}
        fields={activeCollection?.model || []}
        onEdit={activeCollection?.name === 'users' ? null : (rec) => { setEditingRecord(rec); setIsAddModalOpen(true); }}
      />
      
      {isAddModalOpen && (
        <AddRecordDrawer
          isOpen={true}
          onClose={() => { setIsAddModalOpen(false); setEditingRecord(null); }}
          onSubmit={async (val) => {
            try {
              if (editingRecord) await api.patch(`/api/projects/${projectId}/collections/${activeCollection.name}/data/${editingRecord._id}`, val);
              else await api.post(`/api/projects/${projectId}/collections/${activeCollection.name}/data`, val);
              toast.success("Success"); setIsAddModalOpen(false); fetchData();
            } catch { toast.error("Error saving"); }
          }}
          fields={activeCollection?.model || []}
          initialData={editingRecord}
        />
      )}

      {/* Confirmation Modals */}
      {showModal && <ConfirmationModal open={showModal} title="Delete Record" message="Confirm delete?" onConfirm={() => { handleDeleteRecord(selectedId); setShowModal(false); }} onCancel={() => setShowModal(false)} />}
      {collectionToDelete && <ConfirmationModal open={!!collectionToDelete} title="Delete Collection" message={`Delete ${collectionToDelete.name}?`} onConfirm={async () => { await api.delete(`/api/projects/${projectId}/collections/${collectionToDelete.name}`); setCollections(c => c.filter(x => x.name !== collectionToDelete.name)); setCollectionToDelete(null); }} onCancel={() => setCollectionToDelete(null)} />}

      {/* RLS Dialog */}
      {isRlsDialogOpen && (
        <div className="rls-dialog-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div className="glass-card" style={{ width: '400px', padding: '1.5rem', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>RLS Settings</h3>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsRlsDialogOpen(false)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={rlsEnabled} onChange={e => setRlsEnabled(e.target.checked)} /> Enable Security Rules
              </label>
              <select className="input-field" value={rlsMode} onChange={e => setRlsMode(e.target.value)} style={{ height: '36px' }}>
                <option value="public-read">public-read (anyone can read)</option>
                <option value="private">private (only owner can read)</option>
              </select>
              <button className="btn btn-primary" onClick={async () => { if (await handleSaveRls()) setIsRlsDialogOpen(false); }}>Save Rules</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
