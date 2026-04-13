import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    Trash2, AlertTriangle, Save, CheckCircle, Copy, Server, Globe, Plus, X,
    Settings, HardDrive, Database, Mail, Shield
} from "lucide-react";
import { API_URL } from "../config";
import ConfirmationModal from "./ConfirmationModal";
import SectionHeader from "../components/Dashboard/SectionHeader";

/* ─── Reusable compact form-field wrapper ─── */
function FormField({ label, hint, children }) {
    return (
        <div className="form-group">
            {label && (
                <label className="form-label" style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                    {label}
                </label>
            )}
            {children}
            {hint && <small style={{ display: 'block', marginTop: '5px', fontSize: '0.68rem', color: 'var(--color-text-muted)', lineHeight: 1.4 }}>{hint}</small>}
        </div>
    );
}

/* ─── Compact input style ─── */
const inputStyle = {
    width: '100%',
    padding: '7px 10px',
    background: 'var(--color-bg-input)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.8rem',
};

/* ─── Section card wrapper ─── */
function SettingsCard({ title, icon: Icon, iconColor, accentColor, children, style = {} }) {
    return (
        <div className="glass-card" style={{ borderRadius: '8px', position: 'relative', overflow: 'hidden', ...style }}>
            {accentColor && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: accentColor }} />
            )}
            <div style={{ padding: '1rem', paddingLeft: accentColor ? '1.25rem' : '1rem' }}>
                {title && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '1rem' }}>
                        {Icon && <Icon size={14} color={iconColor || 'var(--color-primary)'} />}
                        <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>{title}</h3>
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}

export default function ProjectSettings() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [hasResendKey, setHasResendKey] = useState(false);
    const [resendKeyValue, setResendKeyValue] = useState("");
    const [resendFromEmailValue, setResendFromEmailValue] = useState("");
    const [resendKeyLoading, setResendKeyLoading] = useState(false);

    const [newName, setNewName] = useState("");
    const [siteUrl, setSiteUrl] = useState("");
    const [renaming, setRenaming] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/api/projects/${projectId}`);
                setProject(res.data);
                setHasResendKey(!!res.data?.hasResendApiKey);
                setResendFromEmailValue(res.data.resendFromEmail || "");
                setNewName(res.data.name);
                setSiteUrl(res.data.siteUrl || "");
            } catch {
                toast.error("Failed to load project");
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [projectId, user]);

    const handleRename = async () => {
        if (!newName.trim()) return toast.error("Project name cannot be empty");
        setRenaming(true);
        try {
            await api.patch(`/api/projects/${projectId}`, { name: newName, siteUrl });
            toast.success("Project settings saved!");
            setProject((prev) => ({ ...prev, name: newName, siteUrl }));
        } catch {
            toast.error("Failed to save project settings");
        } finally {
            setRenaming(false);
        }
    };

    const handleResendKeySave = async () => {
        const trimmedKey = resendKeyValue.trim();
        const trimmedEmail = resendFromEmailValue.trim();
        const payload = {};
        if (trimmedKey) payload.resendApiKey = trimmedKey;
        if (trimmedEmail !== project?.resendFromEmail) payload.resendFromEmail = trimmedEmail;
        if (Object.keys(payload).length === 0) return toast.error("Nothing to update.");

        setResendKeyLoading(true);
        try {
            await api.patch(`/api/projects/${projectId}`, payload);
            toast.success("Mail settings saved.");
            const updates = {};
            if (payload.resendApiKey) { setResendKeyValue(""); setHasResendKey(true); updates.hasResendApiKey = true; }
            if (payload.resendFromEmail !== undefined) updates.resendFromEmail = payload.resendFromEmail;
            setProject((prev) => (prev ? { ...prev, ...updates } : prev));
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to save mail settings");
        } finally {
            setResendKeyLoading(false);
        }
    };

    const handleDeleteProject = async () => {
        if (deleteConfirm !== project.name) return toast.error("Project name does not match");
        try {
            await api.delete(`/api/projects/${projectId}`);
            toast.success("Project deleted");
            navigate("/dashboard");
        } catch {
            toast.error("Failed to delete project");
        }
    };

    if (loading) return (
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="spinner" />
        </div>
    );

    return (
        <div className="container" style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '3rem' }}>

            {/* Page header */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(62, 207, 142, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(62, 207, 142, 0.15)' }}>
                    <Settings size={16} color="var(--color-primary)" />
                </div>
                <div>
                    <h1 style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Project Settings</h1>
                    <p style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                        Configuration for <strong style={{ color: 'var(--color-text-main)' }}>{project?.name}</strong>
                    </p>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* General Information */}
                <div>
                    <SectionHeader title="General" />
                    <SettingsCard title="Project Info" icon={Settings} iconColor="var(--color-primary)">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', alignItems: 'end' }}>
                            <FormField label="Project Name">
                                <input
                                    type="text"
                                    className="input-field"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    style={inputStyle}
                                />
                            </FormField>
                            <FormField
                                label="Site URL"
                                hint={<>Used by Social Auth to redirect to <code>/auth/callback</code></>}
                            >
                                <input
                                    type="url"
                                    className="input-field"
                                    value={siteUrl}
                                    onChange={(e) => setSiteUrl(e.target.value)}
                                    placeholder="https://your-app.com"
                                    style={inputStyle}
                                />
                            </FormField>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleRename}
                                className="btn btn-primary"
                                disabled={renaming || (newName === project?.name && siteUrl === (project?.siteUrl || ""))}
                                style={{ height: '30px', fontSize: '0.75rem', padding: '0 14px' }}
                            >
                                {renaming ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </SettingsCard>
                </div>

                {/* Mail */}
                <div>
                    <SectionHeader title="Mail" />
                    <SettingsCard title="Custom Mail (Resend BYOK)" icon={Mail} iconColor="#c084fc" accentColor="#a855f7" style={{ borderColor: 'rgba(168,85,247,0.2)' }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                            Upload a per-project Resend API key to send mail from your own account. The key is encrypted at rest and never exposed after saving.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <FormField label={
                                <span>
                                    Resend API Key{' '}
                                    <span style={{ fontWeight: 600, color: hasResendKey ? '#22c55e' : '#f97316', fontSize: '0.65rem' }}>
                                        · {hasResendKey ? 'Configured' : 'Not configured'}
                                    </span>
                                </span>
                            }>
                                <input
                                    type="password"
                                    className="input-field"
                                    placeholder="Paste new key to update"
                                    value={resendKeyValue}
                                    onChange={(e) => setResendKeyValue(e.target.value)}
                                    style={{ ...inputStyle, fontFamily: 'monospace' }}
                                />
                            </FormField>
                            <FormField label="Default From Address" hint={<>Blank defaults to <code>onboarding@resend.dev</code></>}>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Acme <info@acme.com>"
                                    value={resendFromEmailValue}
                                    onChange={(e) => setResendFromEmailValue(e.target.value)}
                                    style={inputStyle}
                                />
                            </FormField>
                        </div>
                        <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={handleResendKeySave}
                                className="btn btn-primary"
                                disabled={resendKeyLoading || (!resendKeyValue.trim() && resendFromEmailValue.trim() === (project?.resendFromEmail || ""))}
                                style={{ height: '30px', fontSize: '0.75rem', padding: '0 14px' }}
                            >
                                {resendKeyLoading ? "Saving..." : "Save Mail Settings"}
                            </button>
                        </div>
                    </SettingsCard>
                </div>

                {/* External Configuration */}
                <div>
                    <SectionHeader title="Integrations" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <AllowedDomainsForm project={project} projectId={projectId} onProjectUpdate={setProject} />
                        <DatabaseConfigForm project={project} projectId={projectId} onProjectUpdate={setProject} />
                        <StorageConfigForm project={project} projectId={projectId} onProjectUpdate={setProject} />
                    </div>
                </div>

                {/* Danger Zone */}
                <div>
                    <SectionHeader title="Danger Zone" />
                    <div className="glass-card" style={{ borderRadius: '8px', border: '1px solid rgba(234,84,85,0.25)', background: 'rgba(234,84,85,0.02)', padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '7px', alignItems: 'center', marginBottom: '0.75rem', color: '#ea5455' }}>
                            <AlertTriangle size={14} />
                            <h3 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Delete Project</h3>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1rem', fontSize: '0.75rem', lineHeight: 1.5 }}>
                            This will permanently delete <strong style={{ color: '#fff' }}>{project?.name}</strong> and all associated data including collections, files, and users. This action cannot be undone.
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'end', maxWidth: '480px' }}>
                            <FormField label={<>Type <strong style={{ textDecoration: 'underline', color: '#ea5455' }}>{project?.name}</strong> to confirm</>}>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder={project?.name}
                                    value={deleteConfirm}
                                    onChange={(e) => setDeleteConfirm(e.target.value)}
                                    style={{ ...inputStyle, border: '1px solid rgba(234,84,85,0.3)' }}
                                />
                            </FormField>
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn"
                                disabled={deleteConfirm !== project?.name}
                                style={{ height: '30px', fontSize: '0.75rem', padding: '0 12px', background: '#ea5455', color: '#fff', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', marginBottom: '0' }}
                            >
                                <Trash2 size={12} /> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <ConfirmationModal
                    open={showModal}
                    title="Delete Project"
                    message="Are you sure you want to delete this project? This action cannot be undone."
                    onConfirm={() => { handleDeleteProject(); setShowModal(false); }}
                    onCancel={() => setShowModal(false)}
                />
            )}

            <style>{`
                .spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.1); border-left-color: var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* DatabaseConfigForm                                              */
/* ─────────────────────────────────────────────────────────────── */
function DatabaseConfigForm({ project, projectId, onProjectUpdate }) {
    const [dbUri, setDbUri] = useState("");
    const [loading, setLoading] = useState(false);
    const isConfigured = project?.resources?.db?.isExternal || false;
    const [showForm, setShowForm] = useState(!isConfigured);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [serverIp, setServerIp] = useState(null);

    useEffect(() => {
        setShowForm(!( project?.resources?.db?.isExternal || false));
        const fetchIp = async () => {
            try { const res = await api.get(`/api/server-ip`); setServerIp(res.data.ip); }
            catch (e) { console.error("Failed to fetch server IP", e); }
        };
        fetchIp();
    }, [project]);

    const copyIp = () => {
        if (serverIp) { navigator.clipboard.writeText(serverIp); toast.success("Server IP copied!"); }
    };

    const handleUpdate = async () => {
        if (!dbUri) return toast.error("Database URI is required");
        setLoading(true);
        try {
            await api.patch(`/api/projects/${projectId}/byod-config`, { dbUri });
            toast.success("Database configuration updated!");
            setShowForm(false);
            setDbUri("");
        } catch (err) {
            const errorMsg = err.response?.data?.error || "Failed to update DB config";
            if (errorMsg.includes("whitelist Server IP")) {
                toast.error(<div><b>Access Denied!</b><br />{errorMsg}</div>, { duration: 6000 });
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const executeRemove = async () => {
        try {
            await api.delete(`/api/projects/${projectId}/byod-config/db`, { data: { projectId } });
            toast.success("External database configuration removed!");
            onProjectUpdate(prev => ({ ...prev, resources: { ...prev.resources, db: { ...prev.resources.db, isExternal: false } } }));
            setShowForm(true);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to remove DB config");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsCard title="Database (MongoDB)" icon={Database} iconColor="var(--color-primary)" accentColor="var(--color-primary)">
            {showRemoveModal && (
                <ConfirmationModal
                    open={showRemoveModal}
                    title="Remove Database Config"
                    message="Remove the external database configuration? This will switch back to the internal database."
                    onConfirm={() => { executeRemove(); setShowRemoveModal(false); }}
                    onCancel={() => setShowRemoveModal(false)}
                />
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Connect your own MongoDB cluster for full data ownership.</p>

            {isConfigured && !showForm ? (
                <div style={{ background: 'rgba(16,185,129,0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#10B981', fontWeight: 600, fontSize: '0.78rem' }}>
                        <CheckCircle size={13} /> Connected to external MongoDB
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary" onClick={() => setShowForm(true)} style={{ height: '26px', fontSize: '0.7rem', padding: '0 10px' }}>Update URI</button>
                        <button className="btn btn-danger" onClick={() => setShowRemoveModal(true)} disabled={loading} style={{ height: '26px', fontSize: '0.7rem', padding: '0 10px' }}>
                            {loading ? "Removing..." : "Remove"}
                        </button>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>MongoDB Connection URI</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="mongodb+srv://user:pass@cluster.mongodb.net/..."
                            value={dbUri}
                            onChange={(e) => setDbUri(e.target.value)}
                            style={{ ...inputStyle, fontFamily: 'monospace' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                            <Server size={11} />
                            <span>Public IP: <code style={{ background: 'rgba(255,255,255,0.08)', padding: '1px 5px', borderRadius: '3px', fontSize: '0.68rem' }}>{serverIp || "..."}</code></span>
                            {serverIp && (
                                <button onClick={copyIp} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--color-primary)', padding: 0 }}>
                                    <Copy size={11} />
                                </button>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {isConfigured && <button className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ height: '28px', fontSize: '0.72rem', padding: '0 10px' }}>Cancel</button>}
                            <button onClick={handleUpdate} className="btn btn-primary" disabled={loading} style={{ height: '28px', fontSize: '0.72rem', padding: '0 12px' }}>
                                {loading ? "Connecting..." : "Connect Database"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SettingsCard>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* StorageConfigForm                                               */
/* ─────────────────────────────────────────────────────────────── */
const INITIAL_STORAGE_CONFIG = {
    storageProvider: "supabase",
    storageUrl: "", storageKey: "",
    s3AccessKeyId: "", s3SecretAccessKey: "", s3Region: "", s3Endpoint: "", s3Bucket: "", publicUrlHost: "",
};

function StorageConfigForm({ project, projectId, onProjectUpdate }) {
    const [config, setConfig] = useState(INITIAL_STORAGE_CONFIG);
    const [loading, setLoading] = useState(false);
    const isConfigured = project?.resources?.storage?.isExternal || false;
    const [showForm, setShowForm] = useState(!isConfigured);
    const [showRemoveModal, setShowRemoveModal] = useState(false);

    useEffect(() => { setShowForm(!(project?.resources?.storage?.isExternal || false)); }, [project]);

    useEffect(() => {
        if (config.storageProvider === "supabase") {
            setConfig(prev => ({ ...prev, s3AccessKeyId: "", s3SecretAccessKey: "", s3Region: "", s3Endpoint: "", s3Bucket: "", publicUrlHost: "" }));
        } else if (["s3", "cloudflare_r2"].includes(config.storageProvider)) {
            setConfig(prev => ({ ...prev, storageUrl: "", storageKey: "" }));
        }
    }, [config.storageProvider]);

    const handleChange = (e) => setConfig({ ...config, [e.target.name]: e.target.value });

    const handleUpdate = async () => {
        if (config.storageProvider === "supabase" && (!config.storageUrl || !config.storageKey)) return toast.error("URL and Key are required");
        if (config.storageProvider === "s3" && (!config.s3AccessKeyId || !config.s3SecretAccessKey || !config.s3Region || !config.s3Bucket)) return toast.error("S3 keys, region, and bucket are required");
        if (config.storageProvider === "cloudflare_r2" && (!config.s3AccessKeyId || !config.s3SecretAccessKey || !config.s3Endpoint || !config.s3Bucket || !config.publicUrlHost)) return toast.error("R2 keys, endpoint, bucket, and publicUrlHost are required");

        setLoading(true);
        try {
            await api.patch(`/api/projects/${projectId}/byod-config`, config);
            toast.success("Storage configuration updated!");
            setShowForm(false);
            setConfig(INITIAL_STORAGE_CONFIG);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update Storage config");
        } finally {
            setLoading(false);
        }
    };

    const executeRemove = async () => {
        setLoading(true);
        try {
            await api.delete(`/api/projects/${projectId}/byod-config/storage`, { data: { projectId } });
            toast.success("External storage configuration removed!");
            onProjectUpdate(prev => ({ ...prev, resources: { ...prev.resources, storage: { ...prev.resources.storage, isExternal: false } } }));
            setConfig(INITIAL_STORAGE_CONFIG);
            setShowForm(true);
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to remove Storage config");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SettingsCard title="Storage (BYOS)" icon={HardDrive} iconColor="#34d399" accentColor="#34d399">
            {showRemoveModal && (
                <ConfirmationModal
                    open={showRemoveModal}
                    title="Remove Storage Config"
                    message="Remove the external storage configuration? This will switch back to internal storage."
                    onConfirm={() => { executeRemove(); setShowRemoveModal(false); }}
                    onCancel={() => setShowRemoveModal(false)}
                />
            )}
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>Connect your own Supabase, AWS S3, or Cloudflare R2 storage bucket.</p>

            {isConfigured && !showForm ? (
                <div style={{ background: 'rgba(16,185,129,0.08)', padding: '10px 12px', borderRadius: '6px', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#10B981', fontWeight: 600, fontSize: '0.78rem' }}>
                        <CheckCircle size={13} /> External storage connected
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary" onClick={() => setShowForm(true)} style={{ height: '26px', fontSize: '0.7rem', padding: '0 10px' }}>Update Config</button>
                        <button className="btn btn-danger" onClick={() => setShowRemoveModal(true)} disabled={loading} style={{ height: '26px', fontSize: '0.7rem', padding: '0 10px' }}>
                            {loading ? "Removing..." : "Remove"}
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Storage Provider</label>
                        <select
                            name="storageProvider"
                            className="input-field"
                            value={config.storageProvider}
                            onChange={handleChange}
                            style={{ ...inputStyle, maxWidth: '220px' }}
                        >
                            <option value="supabase">Supabase</option>
                            <option value="s3">AWS S3</option>
                            <option value="cloudflare_r2">Cloudflare R2</option>
                        </select>
                    </div>

                    <div style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid var(--color-border)', display: 'grid', gap: '10px' }}>
                        {config.storageProvider === "supabase" && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Supabase Project URL</label>
                                    <input type="text" name="storageUrl" className="input-field" value={config.storageUrl} onChange={handleChange} placeholder="https://abc.supabase.co" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Service Role Key</label>
                                    <input type="password" name="storageKey" className="input-field" value={config.storageKey} onChange={handleChange} placeholder="eyJhb..." style={{ ...inputStyle, fontFamily: 'monospace' }} />
                                </div>
                            </div>
                        )}

                        {(config.storageProvider === "s3" || config.storageProvider === "cloudflare_r2") && (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Bucket Name</label>
                                        <input type="text" name="s3Bucket" className="input-field" value={config.s3Bucket} onChange={handleChange} placeholder="my-assets" style={inputStyle} />
                                    </div>
                                    {config.storageProvider === "s3" ? (
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Region</label>
                                            <input type="text" name="s3Region" className="input-field" value={config.s3Region} onChange={handleChange} placeholder="ap-south-1" style={inputStyle} />
                                        </div>
                                    ) : (
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>S3 API Endpoint</label>
                                            <input type="text" name="s3Endpoint" className="input-field" value={config.s3Endpoint} onChange={handleChange} placeholder="https://<account>.r2.cloudflarestorage.com" style={inputStyle} />
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Access Key ID</label>
                                        <input type="text" name="s3AccessKeyId" className="input-field" value={config.s3AccessKeyId} onChange={handleChange} placeholder="AKIA..." style={{ ...inputStyle, fontFamily: 'monospace' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Secret Access Key</label>
                                        <input type="password" name="s3SecretAccessKey" className="input-field" value={config.s3SecretAccessKey} onChange={handleChange} placeholder="wJalr..." style={{ ...inputStyle, fontFamily: 'monospace' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                        Public URL Host / CDN Domain{' '}
                                        <span style={{ color: 'var(--color-text-muted)', fontSize: '0.65rem', opacity: 0.8 }}>{config.storageProvider === "cloudflare_r2" ? "(Required)" : "(Optional)"}</span>
                                    </label>
                                    <input type="text" name="publicUrlHost" className="input-field" value={config.publicUrlHost} onChange={handleChange} placeholder="https://cdn.my-company.com" style={inputStyle} />
                                    <small style={{ display: 'block', marginTop: '4px', fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>Custom domain or CDN (e.g. CloudFront, R2 Dev Domain)</small>
                                </div>
                            </>
                        )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        {isConfigured && <button className="btn btn-secondary" onClick={() => setShowForm(false)} style={{ height: '28px', fontSize: '0.72rem', padding: '0 10px' }}>Cancel</button>}
                        <button onClick={handleUpdate} className="btn btn-primary" disabled={loading} style={{ height: '28px', fontSize: '0.72rem', padding: '0 12px' }}>
                            {loading ? "Saving..." : "Connect Storage"}
                        </button>
                    </div>
                </div>
            )}
        </SettingsCard>
    );
}

/* ─────────────────────────────────────────────────────────────── */
/* AllowedDomainsForm                                              */
/* ─────────────────────────────────────────────────────────────── */
function AllowedDomainsForm({ project, projectId, onProjectUpdate }) {
    const [domains, setDomains] = useState(project?.allowedDomains || []);
    const [newDomain, setNewDomain] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => { if (project?.allowedDomains) setDomains(project.allowedDomains); }, [project]);

    const handleUpdate = async (updatedDomains) => {
        setLoading(true);
        try {
            await api.patch(`/api/projects/${projectId}/allowed-domains`, { domains: updatedDomains });
            toast.success("Allowed domains updated!");
            setDomains(updatedDomains);
            onProjectUpdate((prev) => ({ ...prev, allowedDomains: updatedDomains }));
        } catch (err) {
            toast.error(err.response?.data?.error || "Failed to update allowed domains");
        } finally {
            setLoading(false);
        }
    };

    const addDomain = () => {
        let domain = newDomain.trim();
        if (!domain) return;
        if (domain !== "*" && domain.endsWith("/")) domain = domain.slice(0, -1);
        if (domains.includes(domain)) return toast.error("Domain already added");
        const updated = domain === "*" ? ["*"] : [...domains.filter(d => d !== "*"), domain];
        handleUpdate(updated);
        setNewDomain("");
    };

    const removeDomain = (d) => handleUpdate(domains.filter(x => x !== d));

    return (
        <SettingsCard title="Allowed Domains (CORS)" icon={Globe} iconColor="#6366f1" accentColor="#6366f1">
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                Restrict which websites can send requests using your <strong>Publishable API Key</strong>.{' '}
                Use <code>*</code> to allow all, or specify like <code>https://example.com</code>.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="https://mywebsite.com or *.mywebsite.com"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addDomain(); } }}
                    style={{ ...inputStyle, flex: 1 }}
                />
                <button
                    onClick={addDomain}
                    className="btn btn-secondary"
                    disabled={loading || !newDomain.trim()}
                    style={{ height: '30px', fontSize: '0.75rem', padding: '0 12px', gap: '4px', flexShrink: 0 }}
                >
                    <Plus size={12} /> Add
                </button>
            </div>

            {domains.length === 0 ? (
                <div style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.72rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px dashed var(--color-border)' }}>
                    No domains configured — your publishable key won't work on the web. Add <code>*</code> to allow all.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {domains.map((domain) => (
                        <div key={domain} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px', background: 'var(--color-bg-input)', border: '1px solid var(--color-border)', borderRadius: '4px' }}>
                            <div style={{ fontSize: '0.75rem' }}>
                                {domain === "*" ? (
                                    <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem' }}>
                                        <AlertTriangle size={11} color="#10b981" /> ALLOW ALL (*)
                                    </span>
                                ) : (
                                    <span style={{ fontFamily: 'monospace', fontSize: '0.72rem' }}>{domain}</span>
                                )}
                            </div>
                            <button
                                onClick={() => removeDomain(domain)}
                                disabled={loading}
                                style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', borderRadius: '3px' }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#ea5455'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                            >
                                <X size={13} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </SettingsCard>
    );
}
