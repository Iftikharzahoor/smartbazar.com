import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { Users, Shield, UserMinus } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data.users);
      } catch (err) {
        console.warn('API fetch failed. Loading mock users list:', err);
        setUsers([
          { _id: 'u-1', name: 'John Doe', email: 'customer@shopmern.com', role: 'user' },
          { _id: 'u-2', name: 'ShopMERN Administrator', email: 'admin@shopmern.com', role: 'admin' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleToggle = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await api.put(`/users/${id}`, { role: nextRole });
      toast.success(`User role updated to ${nextRole}!`);
      setUsers(users.map(u => u._id === id ? { ...u, role: nextRole } : u));
    } catch (err) {
      toast.error('Failed to change role');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      <div className="border-b border-slate-100 pb-6 space-y-1">
        <h1 className="font-display font-extrabold text-3.5xl text-slate-900 flex items-center gap-2">
          <Users className="w-8 h-8 text-indigo-600" />
          Manage Users
        </h1>
        <p className="text-slate-400 text-sm font-light">Promote user accounts to administrators or revoke privilege levels.</p>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500 font-medium">Loading user accounts...</div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-xs">
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Privilege Level</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-slate-800">{u.name}</td>
                  <td className="py-5 px-6 text-slate-600 font-medium">{u.email}</td>
                  <td className="py-5 px-6">
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-bold ${
                      u.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-5 px-6 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleRoleToggle(u._id, u.role)}
                      className="px-3 py-1.5 border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50/20 text-slate-600 hover:text-indigo-600 rounded-lg font-semibold text-xs active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      {u.role === 'admin' ? 'Demote User' : 'Promote Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
