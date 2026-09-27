/**
 * @id ui-button-basic
 * @title Basic Button
 * @apiId @skyra/ui::Button
 * @packageId @skyra/ui
 */
import React from 'react';
import { Button } from '@skyra/ui';

export default function ButtonBasicExample() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary" onClick={() => alert('Clicked primary!')}>
        Primary
      </Button>
      <Button variant="ghost" onClick={() => alert('Clicked ghost!')}>
        Ghost
      </Button>
      <Button variant="outline" onClick={() => alert('Clicked outline!')}>
        Outline
      </Button>
      <Button variant="danger" onClick={() => alert('Clicked danger!')}>
        Danger
      </Button>
    </div>
  );
}
