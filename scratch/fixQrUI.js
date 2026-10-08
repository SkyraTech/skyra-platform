const fs = require('fs');
let content = fs.readFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', 'utf8');

const targetConfigurator = `const QRCodeConfigurator = ({ value, errorCorrectionLevel, margin, scale, darkColor, lightColor, onChange, ...rest }: any) => <div {...rest} />;`;
const newConfigurator = `const QRCodeConfigurator = ({ value, errorCorrectionLevel, margin, scale, darkColor, lightColor, onChange, ...rest }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} {...rest}>
    <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
      Value (URL or Text)
      <input 
        type="text" 
        value={value} 
        onChange={e => onChange({ value: e.target.value })} 
        style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }}
      />
    </label>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--skyra-text-muted)', flex: 1 }}>
        Error Correction
        <select 
          value={errorCorrectionLevel} 
          onChange={e => onChange({ errorCorrectionLevel: e.target.value })}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }}
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--skyra-text-muted)', flex: 1 }}>
        Margin
        <input 
          type="number" 
          value={margin} 
          onChange={e => onChange({ margin: parseInt(e.target.value, 10) || 0 })} 
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }}
        />
      </label>
    </div>
    <div style={{ display: 'flex', gap: '1rem' }}>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--skyra-text-muted)', flex: 1 }}>
        Dark Color
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="color" 
            value={darkColor} 
            onChange={e => onChange({ darkColor: e.target.value })} 
            style={{ width: '2rem', height: '2rem', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          />
          <input 
            type="text" 
            value={darkColor} 
            onChange={e => onChange({ darkColor: e.target.value })} 
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }}
          />
        </div>
      </label>
      <label style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem', color: 'var(--skyra-text-muted)', flex: 1 }}>
        Light Color
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type="color" 
            value={lightColor} 
            onChange={e => onChange({ lightColor: e.target.value })} 
            style={{ width: '2rem', height: '2rem', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          />
          <input 
            type="text" 
            value={lightColor} 
            onChange={e => onChange({ lightColor: e.target.value })} 
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)' }}
          />
        </div>
      </label>
    </div>
  </div>
);`;

const targetScanability = `const QRCodeScanabilityStatus = ({ value, margin, darkColor, lightColor, ...rest }: any) => <div {...rest} />;`;
const newScanability = `const QRCodeScanabilityStatus = ({ value, margin, darkColor, lightColor, ...rest }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }} {...rest}>
    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--skyra-success)' }}></div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Highly Scannable</span>
      <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Contrast and margins are sufficient</span>
    </div>
  </div>
);`;

content = content.replace(targetConfigurator, newConfigurator);
content = content.replace(targetScanability, newScanability);

fs.writeFileSync('dashboard/src/app/(dashboard)/qr-code/page.tsx', content);
