/**
 * @id qr-react-basic
 * @title React QR Code
 * @apiId @skyra/ui::QRCode
 * @packageId @skyra/ui
 * @capabilityId ui/components
 */
import React from 'react';
import '@skyra-tech-platform/qr';;

export default function QRReactExample() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      <p>Scan to visit Skyra Platform:</p>
      <skyra-tech-qr-code 
        value="https://skyra.com" 
        width={200}
      />
    </div>
  );
}
