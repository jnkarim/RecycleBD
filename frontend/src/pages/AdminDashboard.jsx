import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { FaUsers, FaBuilding, FaTruck, FaRecycle, FaCheckCircle, FaTimesCircle, FaUserShield, FaWeightHanging } from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'companies', 'pickups'
  const [actualWeights, setActualWeights] = useState({});

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, pickupsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users'),
        API.get('/admin/pickups')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPickups(pickupsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleVerifyCompany = async (id) => {
    try {
      const res = await API.patch(`/admin/verify-company/${id}`);
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      toast.error('Failed to update verification');
    }
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      await API.patch(`/admin/change-role/${id}`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to change role');
    }
  };

  const handleCompletePickup = async (id, defaultWeight) => {
    const weightToSubmit = actualWeights[id] || defaultWeight;
    try {
      const res = await API.patch(`/admin/pickup/${id}/complete`, { actualWeight: weightToSubmit });
      toast.success(res.data.message);
      fetchData(); // Data reload
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete pickup');
    }
  };

  if (loading) return <div className="min-h-screen bg-[#070e1a] flex items-center justify-center text-green-500">Loading Admin Panel...</div>;

  const displayUsers = activeTab === 'users' ? users.filter(u => u.role !== 'company') : users.filter(u => u.role === 'company');

  return (
    <div className="min-h-screen bg-[#070e1a] pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-['Outfit'] text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black font-['Syne'] mb-2 flex items-center gap-3">
            <FaUserShield className="text-green-500" /> Admin Control Panel
          </h1>
          <p className="text-slate-400">Manage users, approve companies, and process waste pickups.</p>
        </div>

        {/* ─── STATS CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-[#0d1b2e] border border-white/5 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-blue-500/10 text-blue-500"><FaUsers /></div>
            <div><p className="text-slate-400 text-sm font-semibold">Total Users</p><p className="text-2xl font-black font-['Syne']">{stats?.totalUsers || 0}</p></div>
          </div>
          <div className="bg-[#0d1b2e] border border-white/5 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-purple-500/10 text-purple-500"><FaBuilding /></div>
            <div><p className="text-slate-400 text-sm font-semibold">Companies</p><p className="text-2xl font-black font-['Syne']">{stats?.companies || 0}</p></div>
          </div>
          <div className="bg-[#0d1b2e] border border-white/5 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-orange-500/10 text-orange-500"><FaTruck /></div>
            <div><p className="text-slate-400 text-sm font-semibold">Total Pickups</p><p className="text-2xl font-black font-['Syne']">{stats?.pickups || 0}</p></div>
          </div>
          <div className="bg-[#0d1b2e] border border-white/5 rounded-2xl p-6 flex items-center gap-4 shadow-lg">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl bg-green-500/10 text-green-500"><FaRecycle /></div>
            <div><p className="text-slate-400 text-sm font-semibold">Waste Recycled</p><p className="text-2xl font-black font-['Syne']">{stats?.totalWasteKg || 0} kg</p></div>
          </div>
        </div>

        {/* ─── TABS ─── */}
        <div className="flex gap-4 mb-6 border-b border-white/10 pb-4 overflow-x-auto">
          <button onClick={() => setActiveTab('users')} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold transition-all ${activeTab === 'users' ? 'bg-green-500 text-[#070e1a]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Normal Users & Staff</button>
          <button onClick={() => setActiveTab('companies')} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold transition-all ${activeTab === 'companies' ? 'bg-green-500 text-[#070e1a]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Companies</button>
          <button onClick={() => setActiveTab('pickups')} className={`px-6 py-2 whitespace-nowrap rounded-full font-bold transition-all ${activeTab === 'pickups' ? 'bg-green-500 text-[#070e1a]' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}>Pickups & Points</button>
        </div>

        {/* ─── DATA TABLE ─── */}
        <div className="bg-[#0d1b2e] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            
            {/* User & Company Table */}
            {activeTab !== 'pickups' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">Name</th>
                    <th className="p-4 font-semibold">Email & Phone</th>
                    {activeTab === 'companies' && <th className="p-4 font-semibold">Status</th>}
                    <th className="p-4 font-semibold">Role</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {displayUsers.map(user => (
                    <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{activeTab === 'companies' ? user.companyName || user.name : user.name}</p>
                        <p className="text-xs text-slate-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 text-sm text-slate-300">
                        <p>{user.email}</p><p className="text-xs text-slate-500">{user.phone}</p>
                      </td>
                      {activeTab === 'companies' && (
                        <td className="p-4">
                          <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md w-fit ${user.companyVerified ? 'text-green-500 bg-green-500/10' : 'text-orange-500 bg-orange-500/10'}`}>
                            {user.companyVerified ? <><FaCheckCircle /> Verified</> : <><FaTimesCircle /> Pending</>}
                          </span>
                        </td>
                      )}
                      <td className="p-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded">{user.role}</span>
                      </td>
                      <td className="p-4 text-right">
                        {activeTab === 'companies' ? (
                          <button onClick={() => handleVerifyCompany(user._id)} className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${user.companyVerified ? 'bg-red-500/10 text-red-500' : 'bg-green-500 text-[#070e1a]'}`}>
                            {user.companyVerified ? 'Revoke' : 'Verify Now'}
                          </button>
                        ) : (
                          <select value={user.role} onChange={(e) => handleChangeRole(user._id, e.target.value)} disabled={user.role === 'admin'} className="bg-black/40 border border-white/10 text-slate-300 text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer">
                            <option value="user">User</option><option value="manager">Manager</option><option value="collector">Collector</option>
                            {user.role === 'admin' && <option value="admin">Admin</option>}
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                  {displayUsers.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No data found</td></tr>}
                </tbody>
              </table>
            )}

            {/* Pickups Table */}
            {activeTab === 'pickups' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/20 text-slate-400 text-sm uppercase tracking-wider">
                    <th className="p-4 font-semibold">User details</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Est. Weight</th>
                    <th className="p-4 font-semibold">Actual Weight (kg)</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pickups.map(pickup => (
                    <tr key={pickup._id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <p className="font-bold">{pickup.user?.name || 'Unknown User'}</p>
                        <p className="text-xs text-slate-500">{new Date(pickup.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 text-sm font-bold capitalize text-green-400">{pickup.category || pickup.wasteCategory || 'Mixed'}</td>
                      <td className="p-4 text-sm text-slate-300">{pickup.estimatedWeight} kg</td>
                      
                      <td className="p-4">
                        {pickup.status === 'completed' ? (
                          <span className="text-green-500 font-bold">{pickup.actualWeight} kg</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <FaWeightHanging className="text-slate-500 text-xs" />
                            <input 
                              type="number" 
                              min="0.1" 
                              step="0.1"
                              placeholder={pickup.estimatedWeight}
                              value={actualWeights[pickup._id] !== undefined ? actualWeights[pickup._id] : pickup.estimatedWeight}
                              onChange={(e) => setActualWeights({...actualWeights, [pickup._id]: e.target.value})}
                              className="w-20 bg-black/40 border border-white/10 text-white text-sm rounded-lg px-2 py-1 outline-none focus:border-green-500 transition-all"
                            />
                          </div>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {pickup.status === 'completed' ? (
                          <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1.5 rounded-lg flex items-center justify-end gap-1 w-fit ml-auto">
                            <FaCheckCircle /> +{pickup.pointsEarned || 0} GP
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleCompletePickup(pickup._id, pickup.estimatedWeight)}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-green-500 text-[#070e1a] hover:bg-green-600 transition-all shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                          >
                            Mark Done
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {pickups.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-slate-500">No pending pickups</td></tr>}
                </tbody>
              </table>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}