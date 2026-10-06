/**
 * @id ui-button-basic
 * @title Basic Button
 * @apiId @skyra/ui::Button
 * @packageId @skyra/ui
 */
import React from 'react';
import '@skyra-tech-platform/button';;

export default function ButtonBasicExample() {
  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <skyra-tech-button variant="primary" onClick={() => alert('Clicked primary!')}>
        Primary
      </skyra-tech-button>
      <skyra-tech-button variant="ghost" onClick={() => alert('Clicked ghost!')}>
        Ghost
      </skyra-tech-button>
      <skyra-tech-button variant="outline" onClick={() => alert('Clicked outline!')}>
        Outline
      </skyra-tech-button>
      <skyra-tech-button variant="danger" onClick={() => alert('Clicked danger!')}>
        Danger
      </skyra-tech-button>
    </div>
  );
}
