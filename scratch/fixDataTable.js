const fs = require('fs');
const path = 'c:/Users/VAMSHIKA/source/repos/skyra-tech-projects/skyra-platform/dashboard/src/app/(dashboard)/data-table/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const target = `        onAdd={() => alert('Add Record clicked!')}
        rowActions={(item) => (
          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '4px' }} 
              onClick={() => alert(\`View Reference: \${item.reference}\`)}
              aria-label={\`View \${item.reference}\`}
            >
              <Eye size={15} />
            </button>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '4px' }} 
              onClick={() => alert(\`Edit Reference: \${item.reference}\`)}
              aria-label={\`Edit \${item.reference}\`}
            >
              <Edit size={15} />
            </button>
            <button 
              type="button"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-danger)', padding: '4px' }} 
              onClick={() => alert(\`Delete Reference: \${item.reference}\`)}
              aria-label={\`Delete \${item.reference}\`}
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
        bulkActions={(selected) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <skyra-tech-button 
              variant="outline" 
              size="sm" 
              onClick={() => handleExportSelected(selected)}
            >
              <Download size={13} style={{ marginRight: '4px' }} />
              Export Selected ({selected.length})
            </skyra-tech-button>
            <skyra-tech-button 
              variant="danger" 
              size="sm" 
              onClick={() => alert(\`Simulating deletion of \${selected.length} records.\`)}
            >
              Delete Selected
            </skyra-tech-button>
          </div>
        )}
      />`.replace(/\r\n/g, '\n');

const replacement = `        onAdd={() => alert('Add Record clicked!')}
      >
        {activeData.map((item) => (
          <React.Fragment key={item.reference}>
            <span slot={\`amount-\${item.reference}\`} style={{ fontWeight: 600 }}>\${Number(item.amount).toLocaleString()}</span>
            <div slot={\`status-\${item.reference}\`}>
              <StatusBadge statusMap={STATUS_MAP} status={String(item.status)} size="sm" />
            </div>
            {featureConfig.rowActions && (
              <div slot={\`row-actions-\${item.reference}\`} style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '4px' }} 
                  onClick={() => alert(\`View Reference: \${item.reference}\`)}
                  aria-label={\`View \${item.reference}\`}
                >
                  <Eye size={15} />
                </button>
                <button 
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', padding: '4px' }} 
                  onClick={() => alert(\`Edit Reference: \${item.reference}\`)}
                  aria-label={\`Edit \${item.reference}\`}
                >
                  <Edit size={15} />
                </button>
                <button 
                  type="button"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-danger)', padding: '4px' }} 
                  onClick={() => alert(\`Delete Reference: \${item.reference}\`)}
                  aria-label={\`Delete \${item.reference}\`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
        {featureConfig.bulkActions && (
          <div slot="bulk-actions" style={{ display: 'flex', gap: '0.5rem' }}>
            <skyra-tech-button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const selected = activeData.filter(r => tableState.selection[r.reference] || tableState.selection[r.id]);
                handleExportSelected(selected);
              }}
            >
              <Download size={13} style={{ marginRight: '4px' }} />
              Export Selected
            </skyra-tech-button>
            <skyra-tech-button 
              variant="danger" 
              size="sm" 
              onClick={() => alert(\`Simulating deletion of selected records.\`)}
            >
              Delete Selected
            </skyra-tech-button>
          </div>
        )}
      </skyra-tech-data-table>`.replace(/\n/g, '\r\n');

content = content.replace(/\r\n/g, '\n').replace(target, replacement).replace(/\n/g, '\r\n');
fs.writeFileSync(path, content);
console.log("Done");
