'use client';
import React, { useState } from 'react';
import '@skyra-tech-platform/button';;
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
        <skyra-tech-button variant="primary">Primary</skyra-tech-button>
        <skyra-tech-button variant="orange">Orange</skyra-tech-button>
        <skyra-tech-button variant="outline">Outline</skyra-tech-button>
        <skyra-tech-button variant="ghost">Ghost</skyra-tech-button>
        <skyra-tech-button variant="danger">Danger</skyra-tech-button>
      </DemoBlock>

      <DemoBlock title="Sizes & Icons">
        <skyra-tech-button size="sm">Small</skyra-tech-button>
        <skyra-tech-button size="md" leftIcon={<Mail size={16} />}>Medium with Icon</skyra-tech-button>
        <skyra-tech-button size="lg" rightIcon={<ArrowRight size={18} />}>Large with Icon</skyra-tech-button>
        <skyra-tech-button size="md" variant="outline" icon-only aria-label="Delete"><Trash2 size={16} /></skyra-tech-button>
      </DemoBlock>

      <DemoBlock title="Interactive States">
        <skyra-tech-button disabled>Disabled</skyra-tech-button>
        <skyra-tech-button 
          loading={loading} 
          onClick={() => {
            setLoading(true);
            setTimeout(() => setLoading(false), 2000);
          }}
        >
          Click to Load
        </skyra-tech-button>
      </DemoBlock>
    </DemoSection>
  );
}
