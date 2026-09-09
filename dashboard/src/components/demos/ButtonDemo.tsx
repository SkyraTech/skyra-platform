'use client';
import React, { useState } from 'react';
import { Button } from '@skyra/ui';
import { Mail, ArrowRight, Trash2 } from 'lucide-react';
import { DemoSection, DemoBlock } from './DemoSection';

export function ButtonDemo() {
  const [loading, setLoading] = useState(false);

  return (
    <DemoSection 
      title="Button" 
      desc="The primary interaction primitive. Includes support for multiple variants, sizes, and a loading state."
      erpSource="[B] PLATFORM EXTRACTION (ui.css .btn-*)"
    >
      <DemoBlock title="Variants">
        <Button variant="primary">Primary</Button>
        <Button variant="orange">Orange</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger">Danger</Button>
      </DemoBlock>

      <DemoBlock title="Sizes & Icons">
        <Button size="sm">Small</Button>
        <Button size="md" leftIcon={<Mail size={16} />}>Medium with Icon</Button>
        <Button size="lg" rightIcon={<ArrowRight size={18} />}>Large with Icon</Button>
        <Button size="md" variant="outline" iconOnly aria-label="Delete"><Trash2 size={16} /></Button>
      </DemoBlock>

      <DemoBlock title="Interactive States">
        <Button disabled>Disabled</Button>
        <Button 
          isLoading={loading} 
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          Click to Load
        </Button>
      </DemoBlock>
    </DemoSection>
  );
}
