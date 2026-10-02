'use client';

import React from 'react';

export interface ApiRow {
  name: string;
  type?: string;
  defaultVal?: string;
  description: string;
  required?: boolean;
}

interface ApiTableProps {
  title?: string;
  headers?: string[];
  rows: ApiRow[];
}

export function ApiTable({ title, headers = ['Property', 'Type', 'Default', 'Description'], rows }: ApiTableProps) {
  const hasType = rows.some(r => r.type !== undefined);
  const hasDefault = rows.some(r => r.defaultVal !== undefined);

  return (
    <div style={{ marginBottom: '3rem' }}>
      {title && <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>{title}</h3>}
      <div className="api-table-container">
        <table className="api-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead className="api-thead">
            <tr style={{ background: 'var(--skyra-bg-muted)', borderBottom: '1px solid var(--skyra-border)' }}>
              {headers.map((h, i) => (
                <th key={i} style={{ 
                  padding: '0.75rem 1rem', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  color: 'var(--skyra-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr 
                key={i} 
                className="api-tr"
                style={{ borderBottom: i === rows.length - 1 ? 'none' : '1px solid var(--skyra-border)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {/* Property Name */}
                <td className="api-td" data-label="Property" style={{ padding: '1.25rem 1rem', verticalAlign: 'top', width: '25%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <code style={{ 
                      fontFamily: 'var(--skyra-font-mono)', 
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: 'var(--skyra-text)',
                      background: 'var(--skyra-bg-muted)',
                      padding: '0.2rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--skyra-border)',
                      wordBreak: 'break-all'
                    }}>
                      {row.name}
                    </code>
                    {row.required && (
                      <span style={{ fontSize: '0.65rem', color: 'var(--skyra-danger)', fontWeight: 700 }} title="Required">
                        *
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Type */}
                {hasType && (
                  <td className="api-td" data-label="Type" style={{ padding: '1.25rem 1rem', verticalAlign: 'top', width: '30%' }}>
                    {row.type ? (
                      <code style={{ 
                        fontFamily: 'var(--skyra-font-mono)', 
                        fontSize: '0.75rem', 
                        color: 'var(--skyra-primary)',
                        wordBreak: 'break-all'
                      }}>
                        {row.type}
                      </code>
                    ) : <span style={{ color: 'var(--skyra-border)' }}>—</span>}
                  </td>
                )}

                {/* Default */}
                {hasDefault && (
                  <td className="api-td" data-label="Default" style={{ padding: '1.25rem 1rem', verticalAlign: 'top', width: '15%' }}>
                    {row.defaultVal ? (
                      <code style={{ 
                        fontFamily: 'var(--skyra-font-mono)', 
                        fontSize: '0.75rem', 
                        color: 'var(--skyra-text-muted)',
                        wordBreak: 'break-all'
                      }}>
                        {row.defaultVal}
                      </code>
                    ) : <span style={{ color: 'var(--skyra-border)' }}>—</span>}
                  </td>
                )}

                {/* Description */}
                <td className="api-td" data-label="Description" style={{ padding: '1.25rem 1rem', verticalAlign: 'top', fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style>{`
        .api-table-container {
          border: 1px solid var(--skyra-border);
          border-radius: var(--skyra-radius-md);
          background: var(--skyra-surface);
          box-shadow: var(--skyra-shadow-sm);
        }
        @media (max-width: 768px) {
          .api-table, .api-thead, .api-tr, .api-td, .api-table tbody {
            display: block;
            width: 100%;
          }
          .api-thead {
            display: none;
          }
          .api-tr {
            padding: 1rem 0;
          }
          .api-td {
            padding: 0.5rem 1rem !important;
            text-align: left;
            position: relative;
          }
          .api-td::before {
            content: attr(data-label);
            display: block;
            font-size: 0.65rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--skyra-text-muted);
            margin-bottom: 0.25rem;
          }
        }
      `}</style>
    </div>
  );
}
