'use client';
import React, { useState } from 'react';
import { Checkbox, Alert, Spinner, Divider, Card, PhoneInputField, LogoUploader } from '@skyra/ui';
import { DemoSection, DemoBlock } from './DemoSection';

export function MiscDemo() {
  const [checked, setChecked] = useState(false);
  const [phone, setPhone] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  return (
    <DemoSection 
      title="Miscellaneous & Layout" 
      desc="Cards, alerts, spinners, and specialized inputs."
    >
      <DemoBlock title="Card & Checkbox">
        <Card style={{ maxWidth: '300px', width: '100%' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Settings</h4>
          <Checkbox 
            label="Enable notifications" 
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            helper="You can change this later."
          />
        </Card>
      </DemoBlock>

      <DemoBlock title="Alerts">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <Alert variant="info" title="Information">This is an informational alert.</Alert>
          {showAlert && (
            <Alert variant="success" title="Success" onDismiss={() => setShowAlert(false)}>
              Operation completed successfully. (Dismissible)
            </Alert>
          )}
          <Alert variant="warning">Warning: Check your configuration.</Alert>
          <Alert variant="danger" title="Error">Failed to save changes.</Alert>
        </div>
      </DemoBlock>

      <DemoBlock title="Specialized Inputs">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%', maxWidth: '300px' }}>
          <PhoneInputField 
            label="Phone Number" 
            value={phone}
            onChange={setPhone}
          />
          <LogoUploader 
            onUpload={async (file) => {
              // Mock adapter
              await new Promise(r => setTimeout(r, 1500));
              return URL.createObjectURL(file);
            }}
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Loaders & Dividers">
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </div>
          <Divider label="OR CONTINUE WITH" />
        </div>
      </DemoBlock>
    </DemoSection>
  );
}
