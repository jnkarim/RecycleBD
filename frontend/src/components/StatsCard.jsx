const COLORS = {
  brand: { bar: '#639922', icon: '#EAF3DE', kanji: '緑のポイント' },
  amber: { bar: '#BA7517', icon: '#FAEEDA', kanji: '廃棄物リサイクル' },
  teal:  { bar: '#1D9E75', icon: '#E1F5EE', kanji: '二酸化炭素削減' },
  blue:  { bar: '#378ADD', icon: '#E6F1FB', kanji: '回収完了' },
  purple:{ bar: '#7F77DD', icon: '#EEEDFE', kanji: '達成' },
  red:   { bar: '#E24B4A', icon: '#FCEBEB', kanji: 'キャンセル' },
};

export default function StatsCard({ label, value, sub, icon: Icon, color = 'brand' }) {
  const c = COLORS[color] || COLORS.brand;
  return (
    <div style={{
      background: '#ffffff',
      border: '0.5px solid #D3D1C7',
      borderRadius: '12px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Japanese left-bar accent */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '3px', background: c.bar, borderRadius: '3px 0 0 3px'
      }} />

      {Icon && (
        <div style={{
          width: '36px', height: '36px', borderRadius: '8px',
          background: c.icon, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }}>
          <Icon size={17} color={c.bar} />
        </div>
      )}

      <div>
        <p style={{ fontSize: '10px', color: '#888780', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
          {label}
        </p>
        <p style={{ fontSize: '20px', fontWeight: 600, color: '#2C2C2A', lineHeight: 1 }}>
          {value}
        </p>
        {sub && <p style={{ fontSize: '11px', color: '#888780', marginTop: '2px' }}>{sub}</p>}
        <p style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '9px', color: '#B4B2A9', letterSpacing: '0.05em', marginTop: '3px' }}>
          {c.kanji}
        </p>
      </div>
    </div>
  );
}