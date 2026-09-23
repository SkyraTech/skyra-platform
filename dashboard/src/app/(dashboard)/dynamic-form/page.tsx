'use client';

import React, { useState, useRef } from 'react';
import {
  DynamicForm,
  FieldsetDef,
  DynamicFormHandle,
  DynamicFormFeatures,
  FormDraftState,
} from '@skyra/dynamic-form';
import { Button, Alert } from '@skyra/ui';
import {
  Settings,
  RotateCcw,
  Send,
  AlertTriangle,
  FileCode,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

const SHOWCASE_SCHEMA: FieldsetDef[] = [
  {
    id: 'personal',
    title: '1. Personal & Professional Profile',
    subtitle: 'Demonstrates basic inputs, custom validators, and required fields',
    fields: [
      {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Alex',
      },
      {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        required: true,
        placeholder: 'e.g. Morgan',
      },
      {
        name: 'workEmail',
        label: 'Work Email',
        type: 'text',
        required: true,
        placeholder: 'alex.morgan@enterprise.io',
        validate: (val) => {
          if (!val) return undefined;
          return /\S+@\S+\.\S+/.test(String(val))
            ? undefined
            : 'Please enter a valid business email address';
        },
      },
      {
        name: 'role',
        label: 'Primary Role',
        type: 'select',
        required: true,
        options: [
          { value: 'engineer', label: 'Software Engineer' },
          { value: 'manager', label: 'Engineering Manager' },
          { value: 'designer', label: 'Product Designer' },
          { value: 'contractor', label: 'Independent Contractor' },
        ],
      },
    ],
  },
  {
    id: 'conditional',
    title: '2. Conditional Visibility & Dependencies',
    subtitle: 'Fields react in real-time to selections made in Section 1',
    fields: [
      {
        name: 'teamSize',
        label: 'Managed Team Size',
        type: 'number',
        placeholder: 'Number of direct reports',
        visibleWhen: { field: 'role', operator: 'equals', value: 'manager' },
        required: true,
      },
      {
        name: 'primaryTechStack',
        label: 'Primary Technology Stack',
        type: 'select',
        options: [
          { value: 'react', label: 'TypeScript / React / Next.js' },
          { value: 'python', label: 'Python / FastAPI / PyTorch' },
          { value: 'go', label: 'Go / Kubernetes / Cloud' },
        ],
        visibleWhen: { field: 'role', operator: 'equals', value: 'engineer' },
      },
      {
        name: 'contractHourlyRate',
        label: 'Contract Hourly Rate ($)',
        type: 'number',
        placeholder: '150',
        visibleWhen: { field: 'role', operator: 'equals', value: 'contractor' },
      },
      {
        name: 'billingRegion',
        label: 'Billing Region',
        type: 'select',
        options: [
          { value: 'na', label: 'North America' },
          { value: 'eu', label: 'Europe / UK' },
          { value: 'apac', label: 'Asia Pacific' },
        ],
      },
      {
        name: 'billingCountry',
        label: 'Billing Country',
        type: 'text',
        placeholder: 'Specific country for regional tax compliance',
        dependsOn: {
          field: 'billingRegion',
          onChange: (region) => {
            // Automatically clear or preset child field when parent changes
            return {
              billingCountry: region === 'na' ? 'United States' : '',
            };
          },
        },
      },
      {
        name: 'seats',
        label: 'Software License Seats',
        type: 'number',
        defaultValue: 5,
        min: 1,
        max: 500,
        dependsOn: {
          field: 'seats',
          onChange: (seats, allVals) => {
            const unitPrice = Number(allVals.licenseUnitPrice || 40);
            return {
              totalEstimatedCost: Number(seats || 0) * unitPrice,
            };
          },
        },
      },
      {
        name: 'totalEstimatedCost',
        label: 'Total Estimated Monthly Cost ($)',
        type: 'number',
        readOnly: true,
        defaultValue: 200,
        description: 'Auto-calculated via dependsOn rule (Seats × $40)',
      },
    ],
  },
  {
    id: 'nested',
    title: '3. Nested Schemas & Dot Paths',
    subtitle: 'Maps hierarchical values (e.g. organization.address.city)',
    fields: [
      {
        name: 'organization.companyName',
        label: 'Company Name',
        type: 'text',
        required: true,
        placeholder: 'Acme Corporation',
      },
      {
        name: 'organization.address.city',
        label: 'Headquarters City',
        type: 'text',
        placeholder: 'San Francisco',
      },
      {
        name: 'organization.address.country',
        label: 'Headquarters Country',
        type: 'text',
        placeholder: 'United States',
      },
    ],
  },
  {
    id: 'repeatable',
    title: '4. Repeatable Collections',
    subtitle: 'Dynamic repeatable groups with min/max validation and stable keys',
    fields: [
      {
        name: 'projects',
        label: 'Key Projects',
        type: 'repeatable',
        repeatableConfig: {
          min: 1,
          max: 4,
          addButtonText: 'Add New Project',
          removeButtonText: 'Remove Project',
          itemTitle: (idx, item) => {
            const itemObj = item as Record<string, unknown>;
            return itemObj?.projectName ? `Project: ${String(itemObj.projectName)}` : `Project #${idx + 1}`;
          },
          fields: [
            {
              name: 'projectName',
              label: 'Project Name',
              type: 'text',
              required: true,
              placeholder: 'Skyra Platform Migration',
            },
            {
              name: 'projectStatus',
              label: 'Status',
              type: 'select',
              options: [
                { value: 'active', label: 'Active / In Progress' },
                { value: 'planning', label: 'Planning Stage' },
                { value: 'completed', label: 'Delivered' },
              ],
            },
          ],
        },
      },
    ],
  },
];

const INITIAL_FORM_VALUES: Record<string, unknown> = {
  firstName: 'Jordan',
  lastName: 'Lee',
  workEmail: 'jordan.lee@skyratech.io',
  role: 'engineer',
  primaryTechStack: 'react',
  billingRegion: 'na',
  billingCountry: 'United States',
  seats: 5,
  totalEstimatedCost: 200,
  organization: {
    companyName: 'Skyra Tech Labs',
    address: {
      city: 'Austin',
      country: 'United States',
    },
  },
  projects: [
    { projectName: 'Design System Hardening', projectStatus: 'active' },
    { projectName: 'Enterprise DynamicForm Engine', projectStatus: 'active' },
  ],
};

export default function DynamicFormPage() {
  const formRef = useRef<DynamicFormHandle>(null);

  // Live inspection state
  const [currentValues, setCurrentValues] = useState<Record<string, unknown>>(INITIAL_FORM_VALUES);
  const [isDirty, setIsDirty] = useState(false);
  const [dirtyFieldList, setDirtyFieldList] = useState<string[]>([]);
  const [submittedPayload, setSubmittedPayload] = useState<Record<string, unknown> | null>(null);
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({});
  const [serverBannerError, setServerBannerError] = useState<string | null>(null);
  const [submitSuccessNotice, setSubmitSuccessNotice] = useState(false);

  // Feature modularity toggles
  const [features, setFeatures] = useState<DynamicFormFeatures>({
    validation: true,
    conditionalFields: true,
    dependencies: true,
    repeatableGroups: true,
    nestedFields: true,
    dirtyTracking: true,
    draftState: true,
    submissionState: true,
    validationSummary: true,
    serverErrors: true,
    unsavedChanges: true,
  });

  const toggleFeature = (key: keyof DynamicFormFeatures) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Form handlers
  const handleValuesChange = (newVals: Record<string, unknown>) => {
    setCurrentValues(newVals);
    if (formRef.current) {
      setIsDirty(formRef.current.isDirty);
      setDirtyFieldList(Object.keys(formRef.current.dirtyFields || {}));
    }
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitSuccessNotice(false);
    setServerBannerError(null);

    // Simulate network submission delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmittedPayload(values);
    setSubmitSuccessNotice(true);
    if (formRef.current) {
      setIsDirty(false);
      setDirtyFieldList([]);
    }
  };

  const handleSimulateServerError = () => {
    setServerErrors({
      workEmail: 'Email is flagged by corporate policy as restricted',
      'organization.companyName': 'Company name requires verification badge',
    });
    setServerBannerError('Backend rejected registration: domain verification failed.');
  };

  const handleResetForm = () => {
    formRef.current?.reset(INITIAL_FORM_VALUES);
    setCurrentValues(INITIAL_FORM_VALUES);
    setServerErrors({});
    setServerBannerError(null);
    setSubmittedPayload(null);
    setSubmitSuccessNotice(false);
    setIsDirty(false);
    setDirtyFieldList([]);
  };

  const handleSaveDraft = () => {
    if (!formRef.current) return;
    const draft: FormDraftState = formRef.current.getFormState();
    localStorage.setItem('skyra_form_draft_demo', JSON.stringify(draft));
    alert('Form snapshot saved to browser localStorage!');
  };

  const handleLoadDraft = () => {
    if (!formRef.current) return;
    const saved = localStorage.getItem('skyra_form_draft_demo');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        formRef.current.restoreFormState(draft);
        setCurrentValues(draft.values);
        alert('Draft restored successfully from localStorage!');
      } catch {
        alert('Invalid draft format in storage');
      }
    } else {
      alert('No saved draft found. Click "Save Draft" first.');
    }
  };

  return (
    <div
      className="dash-page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        maxWidth: '1440px',
        margin: '0 auto',
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--skyra-border)',
          paddingBottom: '1.25rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '1.75rem',
                fontWeight: 700,
                fontFamily: 'var(--skyra-font-display)',
                color: 'var(--skyra-text)',
              }}
            >
              Enterprise DynamicForm Engine
            </h1>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '0.2rem 0.5rem',
                borderRadius: 'var(--skyra-radius-full, 9999px)',
                background: 'var(--skyra-primary-light, rgba(14, 165, 233, 0.1))',
                color: 'var(--skyra-primary)',
              }}
            >
              Phase 6 • Complete QA
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
            Config-driven, accessible form architecture with zero external engine dependencies, nested dot-paths, repeatable collections, and real-time inspector.
          </p>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="outline" size="sm" onClick={handleSaveDraft}>
            <Save size={14} style={{ marginRight: '6px' }} />
            Save Draft
          </Button>
          <Button variant="outline" size="sm" onClick={handleLoadDraft}>
            <FileCode size={14} style={{ marginRight: '6px' }} />
            Load Draft
          </Button>
          <Button variant="outline" size="sm" onClick={handleSimulateServerError}>
            <AlertTriangle size={14} style={{ marginRight: '6px' }} />
            Simulate Server Error
          </Button>
          <Button variant="ghost" size="sm" onClick={handleResetForm}>
            <RotateCcw size={14} style={{ marginRight: '6px' }} />
            Reset
          </Button>
        </div>
      </div>

      {/* ── Feature Modularity Switches Bar ── */}
      <div
        style={{
          background: 'var(--skyra-surface)',
          border: '1px solid var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-lg)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sliders size={16} color="var(--skyra-primary)" />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
            Feature Modularity Toggles (Opt-in Architecture)
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(Object.keys(features) as Array<keyof DynamicFormFeatures>).map((featKey) => {
            const active = Boolean(features[featKey]);
            return (
              <button
                key={featKey}
                type="button"
                onClick={() => toggleFeature(featKey)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  borderRadius: 'var(--skyra-radius-md)',
                  border: `1px solid ${active ? 'var(--skyra-primary)' : 'var(--skyra-border)'}`,
                  background: active ? 'var(--skyra-primary-light, rgba(14, 165, 233, 0.1))' : 'var(--skyra-bg)',
                  color: active ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {featKey}: {active ? 'ON' : 'OFF'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Alerts & Status Banners ── */}
      {submitSuccessNotice && (
        <Alert
          variant="success"
          title="Submission Completed Successfully"
          onDismiss={() => setSubmitSuccessNotice(false)}
        >
          Form validated and delivered payload to submission handler. Inspect payload in the right panel.
        </Alert>
      )}

      {/* ── Main Two-Column Layout ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 420px',
          gap: '1.5rem',
          alignItems: 'start',
        }}
        className="skyra-showcase-grid"
      >
        {/* Style for mobile responsiveness */}
        <style>{`
          @media (max-width: 1024px) {
            .skyra-showcase-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}</style>

        {/* Left Column: Dynamic Form Component */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <DynamicForm
            formRef={formRef}
            fieldsets={SHOWCASE_SCHEMA}
            initialValues={INITIAL_FORM_VALUES}
            onValuesChange={handleValuesChange}
            onSubmit={handleSubmit}
            features={features}
            serverErrors={serverErrors}
            serverError={serverBannerError || undefined}
            submitLabel="Submit Enterprise Record"
            showDangerZone
            dangerZoneTitle="Danger Zone: Decommission Enterprise Record"
            dangerZoneLabel="Decommission"
            onDangerAction={() => alert('Danger zone action triggered!')}
          />
        </div>

        {/* Right Column: Live State Inspector Panel */}
        <div
          style={{
            position: 'sticky',
            top: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-xl)',
            padding: '1.25rem',
            boxShadow: 'var(--skyra-shadow-sm)',
          }}
        >
          {/* Panel Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--skyra-border)',
              paddingBottom: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} color="var(--skyra-primary)" />
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
                Live Form State Inspector
              </h3>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: isDirty ? 'var(--skyra-warning-dark, #b45309)' : 'var(--skyra-success, #16a34a)',
                background: isDirty ? 'var(--skyra-warning-light, rgba(245, 158, 11, 0.1))' : 'var(--skyra-success-light, rgba(34, 197, 94, 0.1))',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--skyra-radius-full, 9999px)',
              }}
            >
              {isDirty ? 'DIRTY (Unsaved)' : 'PRISTINE'}
            </span>
          </div>

          {/* Dirty Fields List */}
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--skyra-text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Modified Fields ({dirtyFieldList.length}):
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {dirtyFieldList.length === 0 ? (
                <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', fontStyle: 'italic' }}>
                  No fields modified yet
                </span>
              ) : (
                dirtyFieldList.map((f) => (
                  <span
                    key={f}
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--skyra-font-mono, monospace)',
                      background: 'var(--skyra-bg)',
                      border: '1px solid var(--skyra-border)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: 'var(--skyra-radius-sm, 4px)',
                      color: 'var(--skyra-text)',
                    }}
                  >
                    {f}
                  </span>
                ))
              )}
            </div>
          </div>

          {/* Real-time Values JSON View */}
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--skyra-text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Current State Values (Structured Tree):
            </span>
            <pre
              style={{
                margin: 0,
                padding: '0.75rem',
                background: 'var(--skyra-bg)',
                border: '1px solid var(--skyra-border)',
                borderRadius: 'var(--skyra-radius-md)',
                fontSize: '0.72rem',
                fontFamily: 'var(--skyra-font-mono, monospace)',
                color: 'var(--skyra-text)',
                maxHeight: '280px',
                overflowY: 'auto',
              }}
            >
              {JSON.stringify(currentValues, null, 2)}
            </pre>
          </div>

          {/* Submitted Payload Box */}
          {submittedPayload && (
            <div>
              <span style={{ fontSize: '0.78rem', color: 'var(--skyra-success)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                Last Dispatched Submit Payload:
              </span>
              <pre
                style={{
                  margin: 0,
                  padding: '0.75rem',
                  background: 'var(--skyra-bg)',
                  border: '1px solid var(--skyra-success)',
                  borderRadius: 'var(--skyra-radius-md)',
                  fontSize: '0.72rem',
                  fontFamily: 'var(--skyra-font-mono, monospace)',
                  color: 'var(--skyra-text)',
                  maxHeight: '200px',
                  overflowY: 'auto',
                }}
              >
                {JSON.stringify(submittedPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
