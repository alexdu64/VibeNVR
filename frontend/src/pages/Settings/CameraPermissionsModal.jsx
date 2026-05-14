import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const CameraPermissionsModal = ({
    isOpen,
    onClose,
    targetUser,
    cameras,
    token,
    showToast,
}) => {
    // perms: { [camera_id]: { can_view, can_replay, can_control } }
    const [perms, setPerms] = useState({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isOpen || !targetUser) return;

        const fetchPerms = async () => {
            setLoading(true);
            // Initialize all cameras to no access
            const initial = {};
            cameras.forEach(c => {
                initial[c.id] = { can_view: false, can_replay: false, can_control: false };
            });
            try {
                const res = await fetch(`/api/users/${targetUser.id}/camera-permissions`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    data.forEach(p => {
                        initial[p.camera_id] = {
                            can_view: p.can_view,
                            can_replay: p.can_replay,
                            can_control: p.can_control,
                        };
                    });
                }
            } catch (err) {
                showToast('Failed to load permissions', 'error');
            } finally {
                setPerms(initial);
                setLoading(false);
            }
        };

        fetchPerms();
    }, [isOpen, targetUser]);

    const setField = (cameraId, field, value) => {
        setPerms(prev => {
            const current = prev[cameraId] ?? { can_view: false, can_replay: false, can_control: false };
            const updated = { ...current, [field]: value };
            // can_view = false forces can_replay and can_control off
            if (field === 'can_view' && !value) {
                updated.can_replay = false;
                updated.can_control = false;
            }
            return { ...prev, [cameraId]: updated };
        });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const permissions = Object.entries(perms)
                .filter(([, p]) => p.can_view || p.can_replay || p.can_control)
                .map(([camera_id, p]) => ({
                    camera_id: parseInt(camera_id, 10),
                    can_view: p.can_view,
                    can_replay: p.can_replay,
                    can_control: p.can_control,
                }));

            const res = await fetch(`/api/users/${targetUser.id}/camera-permissions`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ permissions }),
            });

            if (res.ok) {
                showToast('Permissions saved', 'success');
                onClose();
            } else {
                const data = await res.json();
                showToast('Failed: ' + data.detail, 'error');
            }
        } catch (err) {
            showToast('Error: ' + err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const isAdmin = targetUser?.role === 'admin';

    return (
        <div className="fixed inset-0 bg-black/50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative bg-card border border-border rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center mb-4 border-b border-border pb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        Camera Permissions: {targetUser?.username}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                {isAdmin ? (
                    <div className="py-6 text-center text-muted-foreground">
                        <Shield className="w-10 h-10 mx-auto mb-3 text-primary opacity-60" />
                        <p className="font-medium">Admins have full access to all cameras.</p>
                        <p className="text-sm mt-1">Permissions cannot be restricted for admin users.</p>
                    </div>
                ) : loading ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">Loading permissions…</div>
                ) : cameras.length === 0 ? (
                    <div className="py-8 text-center text-muted-foreground text-sm">No cameras configured.</div>
                ) : (
                    <>
                        {/* Column headers */}
                        <div className="grid grid-cols-[1fr_72px_72px_80px] gap-x-2 px-1 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <span>Camera</span>
                            <span className="text-center">View</span>
                            <span className="text-center">Replay</span>
                            <span className="text-center">Control</span>
                        </div>

                        {/* Camera rows */}
                        <div className="max-h-[50vh] overflow-y-auto space-y-1 pr-1">
                            {cameras.map(cam => {
                                const p = perms[cam.id] ?? { can_view: false, can_replay: false, can_control: false };
                                return (
                                    <div
                                        key={cam.id}
                                        className="grid grid-cols-[1fr_72px_72px_80px] gap-x-2 items-center px-3 py-2.5 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
                                    >
                                        <span className="text-sm font-medium truncate" title={cam.name}>{cam.name}</span>

                                        {/* can_view */}
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={p.can_view}
                                                onChange={e => setField(cam.id, 'can_view', e.target.checked)}
                                                className="w-4 h-4 rounded border-input cursor-pointer accent-primary"
                                            />
                                        </div>

                                        {/* can_replay — disabled when can_view is false */}
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={p.can_replay}
                                                disabled={!p.can_view}
                                                onChange={e => setField(cam.id, 'can_replay', e.target.checked)}
                                                className="w-4 h-4 rounded border-input cursor-pointer accent-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                            />
                                        </div>

                                        {/* can_control — disabled when can_view is false */}
                                        <div className="flex justify-center">
                                            <input
                                                type="checkbox"
                                                checked={p.can_control}
                                                disabled={!p.can_view}
                                                onChange={e => setField(cam.id, 'can_control', e.target.checked)}
                                                className="w-4 h-4 rounded border-input cursor-pointer accent-primary disabled:opacity-30 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving…' : 'Save Permissions'}
                            </Button>
                        </div>
                    </>
                )}

                {/* Footer for admin (close only) */}
                {isAdmin && (
                    <div className="flex justify-end pt-4 border-t border-border mt-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Close
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
