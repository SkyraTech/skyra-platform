/**
 * @id qr-react-basic
 * @title React QR Code
 * @apiId @skyra/qr::QRCode
 * @packageId @skyra/qr
 * @capabilityId qr/react
 */
import React from 'react';
import { QRCode } from '@skyra/qr/react';

export default function QRReactExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <p>Scan to visit Skyra Platform:</p>
      <QRCode 
        value="https://skyra.com" 
        width={200}
      />
    </div>
  );
}
