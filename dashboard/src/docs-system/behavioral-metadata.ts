import type { ApiMetadata } from './metadata';

type BehavioralMetadata = Pick<ApiMetadata, 'design' | 'accessibility' | 'responsive'>;

export const behavioralMetadataMap: Record<string, BehavioralMetadata> = {
  '@skyra/ui::Button': {
    design: {
      variants: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
      states: ['hover', 'focus', 'active', 'disabled', 'loading'],
      rationale: 'Core action primitive. Designed to be highly visible and accessible.',
      dos: ['Use primary buttons for the main action on a page.'],
      donts: ['Do not use multiple primary buttons in the same view.']
    },
    accessibility: {
      semanticStructure: 'Renders a native <button> element.',
      keyboard: ['Space', 'Enter'],
      focus: 'Uses standard --skyra-focus-ring on :focus-visible.',
      aria: 'Supports aria-disabled when disabled without removing from tab order (improves screen reader context).'
    },
    responsive: {
      breakpointsSupported: ['all'],
      mobileBehavior: 'Typically spans 100% width on Mobile SM (375px) when inside forms, otherwise inline-flex.'
    }
  },
  '@skyra/data-table::DataTable': {
    design: {
      states: ['loading', 'empty', 'error']
    },
    accessibility: {
      semanticStructure: 'Renders native <table>, <thead>, <tbody>, <tr>, <th>, <td>.',
      keyboard: ['Tab to navigate interactive cells', 'Enter to activate row actions'],
      aria: 'Uses aria-sort for sortable columns.'
    },
    responsive: {
      breakpointsSupported: ['320', '375', '640', '768', '1024', '1280', '1536'],
      mobileBehavior: 'Table container scrolls horizontally (overflow-x: auto) to prevent breaking the viewport.',
      tabletBehavior: 'Displays full table.'
    }
  },
  '@skyra/dialogs::Dialog': {
    design: {
      states: ['open', 'closed']
    },
    accessibility: {
      semanticStructure: 'Uses HTMLDialogElement or ARIA role="dialog".',
      keyboard: ['Escape to close', 'Tab is trapped within dialog'],
      focus: 'Focus is automatically moved to the first focusable element when opened, and restored to the trigger when closed.',
      aria: 'Requires aria-labelledby and aria-describedby for screen readers.'
    },
    responsive: {
      breakpointsSupported: ['all'],
      mobileBehavior: 'Dialog scales to 100% width with standard margins (usually 16px) on mobile viewports.',
      desktopBehavior: 'Centered with max-width constrained by size variant.'
    }
  },
  '@skyra/dynamic-form::DynamicForm': {
    accessibility: {
      semanticStructure: 'Native <form> wrapping connected inputs and labels.',
      keyboard: ['Enter to submit form if a submit button is present'],
      aria: 'Validation errors are programmatically associated via aria-describedby.'
    },
    responsive: {
      breakpointsSupported: ['320', '375', '640', '768', '1024', '1280', '1536'],
      mobileBehavior: 'Multi-column layouts automatically collapse to a single column below 640px.',
      desktopBehavior: 'Supports multi-column grid layouts.'
    }
  },
  '@skyra/app-shell::ApplicationShell': {
    accessibility: {
      semanticStructure: 'Uses <header>, <main>, <nav>, and <aside> landmarks.',
      keyboard: ['Standard landmark navigation']
    },
    responsive: {
      breakpointsSupported: ['320', '375', '640', '768', '1024', '1280', '1536'],
      mobileBehavior: 'Sidebar is completely hidden. Mobile navigation requires a toggle button to open an overlay drawer.',
      desktopBehavior: 'Sidebar is visible and can be toggled between expanded (280px) and collapsed (72px).'
    }
  }
};
