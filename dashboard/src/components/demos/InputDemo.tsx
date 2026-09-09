'use client';
import React, { useState } from 'react';
import { Input, Textarea } from '@skyra/ui';
import { Search, Mail } from 'lucide-react';
import { DemoSection, DemoBlock } from './DemoSection';

export function InputDemo() {
  const [val, setVal] = useState('');
  
  return (
    <DemoSection 
      title="Input & Textarea" 
      desc="Standard text entry fields with support for labels, validation states, and adornments."
      erpSource="[B] PLATFORM EXTRACTION (ui.css .form-input, .form-textarea)"
    >
      <DemoBlock title="Standard Input">
        <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Email Address" 
            required 
            placeholder="john@example.com"
            leftAdornment={<Mail size={16} />}
            value={val}
            onChange={(e) => setVal(e.target.value)}
          />
          <Input 
            label="Search Query" 
            placeholder="Search documents..."
            rightAdornment={<Search size={16} />}
          />
          <Input 
            label="Disabled Field" 
            value="Cannot edit this"
            disabled
          />
          <Input 
            label="Username" 
            required 
            error="This username is already taken"
            defaultValue="johndoe"
          />
        </div>
      </DemoBlock>

      <DemoBlock title="Textarea">
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <Textarea 
            label="Description" 
            placeholder="Enter a detailed description..."
            helper="Maximum 500 characters."
            rows={4}
          />
        </div>
      </DemoBlock>
    </DemoSection>
  );
}
