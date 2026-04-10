import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import PickupCard from '../components/PickupCard';
import StatsCard from '../components/StatsCard';
import { Package, Recycle, Plus, History } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Pickup() {
  const navigate = useNavigate();
  const [pickups, setPickups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/pickup/my'),
      API.get('/pickup/stats'),
    ])
      .then(([pRes, sRes]) => {
        setPickups(pRes.data);
        setStats(sRes.data);
      })
      .catch(() => toast.error('Failed to load pickups'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#f7f6f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: '3px solid #22c55e', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f7f6f2', 
      paddingTop: '100px', 
      paddingBottom: '3rem',
      fontFamily: "'Outfit', sans-serif" 
    }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '0 1rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '4px' }}>
              <History size={14} /> My History
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#173404', margin: 0, lineHeight: 1 }}>My Pickups</h1>
            <p style={{ color: '#888780', fontSize: '14px', marginTop: '6px' }}>Track your recycling progress</p>
          </div>
          
          <button 
            onClick={() => navigate('/scan')}
            style={{
              background: '#22c55e',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 16px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
            }}
          >
            <Plus size={18} /> New Scan
          </button>
        </div>

        {/* Stats Section */}
        {stats && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '12px', 
            marginBottom: '2rem' 
          }}>
            <StatsCard label="Completed" value={stats.completed} icon={Recycle} color="brand" />
            <StatsCard label="Total Earned" value={`৳${stats.totalEarnings}`} icon={Package} color="amber" />
          </div>
        )}

        {/* List or Empty State */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pickups.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem', 
              background: 'white', 
              borderRadius: '16px', 
              border: '0.5px solid #D3D1C7' 
            }}>
              <div style={{ 
                width: '60px', height: '60px', background: '#f0fdf4', 
                borderRadius: '50%', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', margin: '0 auto 1.5rem' 
              }}>
                <Package size={28} color="#22c55e" />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2C2C2A', margin: 0 }}>No pickups yet</h3>
              <p style={{ color: '#888780', fontSize: '14px', marginTop: '8px', marginBottom: '1.5rem' }}>
                Scan your first waste item to start earning points.
              </p>
              <button 
                onClick={() => navigate('/scan')}
                style={{
                  background: '#22c55e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Scan Waste Now
              </button>
            </div>
          ) : (
            pickups.map(p => (
              <div key={p._id} style={{ animation: 'fadeUp 0.4s ease both' }}>
                 <PickupCard pickup={p} />
              </div>
            ))
          )}
        </div>
      </div>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}