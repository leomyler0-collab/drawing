'use client';

import { useEffect, useState } from 'react';
import { clientAuth } from '@/utils/clientAuth';

export default function AuthDebugPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      // Initialize and load data
      clientAuth.initialize();
      loadDebugInfo();
    }
  }, []);

  const loadDebugInfo = () => {
    const allUsers = clientAuth.getAllUsers();
    setUsers(allUsers);
    
    const currentUser = clientAuth.getCurrentUser();
    setSession(currentUser);
  };

  const resetAuth = () => {
    if (confirm('This will delete all users and sessions. Continue?')) {
      localStorage.removeItem('spookysketch_users');
      localStorage.removeItem('spookysketch_session');
      alert('Auth reset! Refresh the page.');
      window.location.reload();
    }
  };

  const reinitializeAdmin = () => {
    localStorage.removeItem('spookysketch_users');
    clientAuth.initialize();
    loadDebugInfo();
    alert('Admin account recreated!');
  };

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-spooky-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-500 mb-8">🔐 Auth Debug Panel</h1>

        {/* Current Session */}
        <div className="spooky-card mb-6">
          <h2 className="text-xl font-bold text-orange-500 mb-4">Current Session</h2>
          {session ? (
            <div className="space-y-2 font-mono text-sm">
              <p>👤 <strong>Username:</strong> {session.username}</p>
              <p>📧 <strong>Email:</strong> {session.email}</p>
              <p>👑 <strong>Tier:</strong> <span className="text-orange-500">{session.tier.toUpperCase()}</span></p>
              <p>🆔 <strong>ID:</strong> {session.id}</p>
              <p>📅 <strong>Created:</strong> {new Date(session.createdAt).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-gray-400">No active session</p>
          )}
        </div>

        {/* All Users */}
        <div className="spooky-card mb-6">
          <h2 className="text-xl font-bold text-orange-500 mb-4">
            All Users ({users.length})
          </h2>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user, index) => (
                <div key={user.id} className="p-4 bg-spooky-bg rounded-lg border border-orange-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold">{user.avatar} {user.username}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.tier === 'admin' ? 'bg-orange-500 text-white' :
                      user.tier === 'vip' ? 'bg-purple-500 text-white' :
                      user.tier === 'pro' ? 'bg-blue-500 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {user.tier.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">📧 {user.email}</p>
                  <p className="text-sm text-gray-400">🆔 {user.id}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No users found</p>
          )}
        </div>

        {/* Admin Credentials */}
        <div className="spooky-card mb-6 border-2 border-orange-500">
          <h2 className="text-xl font-bold text-orange-500 mb-4">👑 Admin Login Info</h2>
          <div className="space-y-2 font-mono text-sm bg-spooky-bg p-4 rounded">
            <p>📧 <strong>Email:</strong> leomyler0@gmail.com</p>
            <p>🔒 <strong>Password:</strong> SuperBoy2020</p>
            <p className="text-yellow-500 mt-4">⚠️ Password is case-sensitive!</p>
          </div>
        </div>

        {/* LocalStorage Info */}
        <div className="spooky-card mb-6">
          <h2 className="text-xl font-bold text-orange-500 mb-4">💾 LocalStorage</h2>
          <div className="space-y-2 font-mono text-xs">
            <p>🗄️ <strong>Users Key:</strong> spookysketch_users</p>
            <p>🔑 <strong>Session Key:</strong> spookysketch_session</p>
            <p>📊 <strong>Users Stored:</strong> {users.length}</p>
            <p>✅ <strong>Session Active:</strong> {session ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="spooky-card">
          <h2 className="text-xl font-bold text-orange-500 mb-4">⚙️ Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={loadDebugInfo}
              className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={reinitializeAdmin}
              className="px-4 py-2 bg-orange-500 rounded-lg hover:bg-orange-600 transition-all"
            >
              👑 Recreate Admin
            </button>
            <button
              onClick={resetAuth}
              className="px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-all"
            >
              🗑️ Reset Everything
            </button>
            <a
              href="/login"
              className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition-all"
            >
              🔐 Go to Login
            </a>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <h3 className="font-bold text-orange-500 mb-2">📝 How to Use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
            <li>Check if admin account exists above</li>
            <li>If not, click &quot;Recreate Admin&quot;</li>
            <li>Open browser console (F12) for detailed logs</li>
            <li>Go to Login page and use admin credentials</li>
            <li>If issues persist, click &quot;Reset Everything&quot;</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
