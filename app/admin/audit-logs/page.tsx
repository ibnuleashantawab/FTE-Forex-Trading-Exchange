'use client';

import React, { useState, useEffect } from 'react';
import { mockStore } from '@/lib/data/mockStore';
import { AuditLog } from '@/types';
import { ShieldAlert, FileText, Code, Clock } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const refreshData = () => {
    setLogs(mockStore.getAuditLogs());
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> Immutable System Audit & Security Trail (SRS §7.8 & §12)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">Privileged Action Audit Logs</h1>
          <p className="text-sm text-silver-400 mt-1">
            Complete audit trail recording admin identity, timestamps, IP metadata, affected entities, and before/after state snapshots.
          </p>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-silver-300">
            <thead className="bg-obsidian-850 text-silver-400 uppercase font-bold text-[10px] tracking-wider border-b border-obsidian-750">
              <tr>
                <th className="p-3.5">Log ID</th>
                <th className="p-3.5">Admin Email</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity & ID</th>
                <th className="p-3.5">Before Snapshot</th>
                <th className="p-3.5">After Snapshot</th>
                <th className="p-3.5">Timestamp & IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-obsidian-800">
              {logs.map(l => (
                <tr key={l.id} className="hover:bg-obsidian-850/60 transition-all">
                  <td className="p-3.5 font-mono text-gold-300 font-bold">{l.id}</td>
                  <td className="p-3.5 text-white font-bold">{l.adminEmail}</td>
                  <td className="p-3.5 font-bold">
                    <span className="bg-gold-500/10 text-gold-300 border border-gold-500/30 px-2 py-0.5 rounded text-[10px]">
                      {l.action}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-silver-300">{l.entity} #{l.entityId}</td>
                  <td className="p-3.5 font-mono text-[10px] text-silver-400 max-w-[200px] truncate">
                    {l.beforeSnapshot ? JSON.stringify(l.beforeSnapshot) : '-'}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-emerald-400 max-w-[200px] truncate">
                    {l.afterSnapshot ? JSON.stringify(l.afterSnapshot) : '-'}
                  </td>
                  <td className="p-3.5 text-silver-400 text-[11px]">
                    <div className="font-semibold text-white">{new Date(l.createdAt).toLocaleString()}</div>
                    <div className="font-mono text-silver-500 text-[10px]">{l.ipAddress}</div>
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-silver-500">
                    No audit logs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
