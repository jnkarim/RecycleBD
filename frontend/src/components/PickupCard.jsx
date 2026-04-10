import { Clock, MapPin, Weight, Banknote, CheckCircle, XCircle, Loader, Truck } from 'lucide-react';

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     kanji: '保留中',  bg: '#FAEEDA', color: '#633806', border: '#FAC775', icon: Clock },
  accepted:    { label: 'Accepted',    kanji: '受付済',  bg: '#E6F1FB', color: '#0C447C', border: '#B5D4F4', icon: Truck },
  in_progress: { label: 'In Progress', kanji: '処理中',  bg: '#EEEDFE', color: '#3C3489', border: '#AFA9EC', icon: Loader },
  completed:   { label: 'Completed',   kanji: '回収済み', bg: '#EAF3DE', color: '#3B6D11', border: '#C0DD97', icon: CheckCircle },
  cancelled:   { label: 'Cancelled',   kanji: 'キャンセル', bg: '#FCEBEB', color: '#791F1F', border: '#F7C1C1', icon: XCircle },
};

const CATEGORY_COLORS = {
  plastic: '#378ADD', paper: '#BA7517', metal: '#888780',
  glass: '#1D9E75', ewaste: '#7F77DD', rubber: '#5F5E5A',
  textile: '#D4537E', cardboard: '#BA7517', aluminum: '#888780',
  copper: '#854F0B', mixed: '#888780',
};

const meta = { fontSize: '12px', color: '#5F5E5A', display: 'flex', alignItems: 'center', gap: '6px' };

export default function PickupCard({ pickup, action, actionLabel, actionColor = 'brand' }) {
  const cfg = STATUS_CONFIG[pickup.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const catColor = CATEGORY_COLORS[pickup.wasteCategory] || '#888780';
  const date = new Date(pickup.scheduledTime);

  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid #D3D1C7',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      fontFamily: "'DM Sans', sans-serif",
      transition: 'border-color 0.15s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#97C459'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#D3D1C7'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: catColor, flexShrink: 0 }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#2C2C2A', textTransform: 'capitalize' }}>
            {pickup.wasteCategory}
          </span>
        </div>
        <span style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '3px 9px', borderRadius: '100px',
          fontSize: '11px', fontWeight: 500,
          background: cfg.bg, color: cfg.color, border: `0.5px solid ${cfg.border}`
        }}>
          <StatusIcon size={11} /> {cfg.label}
        </span>
      </div>

      {/* Divider */}
      <div style={{ height: '0.5px', background: '#F1EFE8' }} />

      {/* Meta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
        <div style={meta}>
          <Weight size={13} style={{ opacity: 0.6 }} />
          {pickup.actualWeight ?? pickup.estimatedWeight} kg
          {pickup.actualWeight == null && <span style={{ color: '#B4B2A9', fontSize: '11px' }}>(est.)</span>}
        </div>
        <div style={meta}>
          <Banknote size={13} style={{ opacity: 0.6 }} />
          {pickup.finalPrice ? `৳${pickup.finalPrice}` : `~৳${pickup.estimatedPrice}`}
        </div>
        <div style={{ ...meta, gridColumn: '1 / -1', overflow: 'hidden' }}>
          <MapPin size={13} style={{ opacity: 0.6, flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pickup.address}</span>
        </div>
        <div style={{ ...meta, gridColumn: '1 / -1' }}>
          <Clock size={13} style={{ opacity: 0.6 }} />
          {date.toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}
          {date.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Collector / User */}
      {pickup.collector?.name && (
        <p style={{ fontSize: '11px', color: '#888780' }}>
          Collector — <span style={{ color: '#3B6D11', fontWeight: 500 }}>{pickup.collector.name}</span>
        </p>
      )}
      {pickup.user?.name && (
        <p style={{ fontSize: '11px', color: '#888780' }}>
          User — <span style={{ color: '#2C2C2A', fontWeight: 500 }}>{pickup.user.name}</span> · {pickup.user.phone}
        </p>
      )}

      {/* Action buttons */}
      {action && pickup.status === 'pending' && (
        <button onClick={() => action(pickup._id)} style={{
          width: '100%', padding: '8px', borderRadius: '8px',
          background: '#3B6D11', color: 'white', border: 'none',
          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {actionLabel}
        </button>
      )}
      {action && pickup.status === 'accepted' && actionLabel === 'Mark Complete' && (
        <button onClick={() => action(pickup._id)} style={{
          width: '100%', padding: '8px', borderRadius: '8px',
          background: '#1D9E75', color: 'white', border: 'none',
          fontSize: '13px', fontWeight: 500, cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          Mark Complete
        </button>
      )}

      {/* Japanese footer accent - Fixed to RecycleBD */}
      <p style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '9px', color: '#B4B2A9', textAlign: 'right', letterSpacing: '0.1em' }}>
        {cfg.kanji} · RecycleBD
      </p>
    </div>
  );
}