import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(process.cwd(), '..', '..'); // Points to skyra-platform or workspace root
const CHANGESET_DIR = path.resolve(process.cwd(), '..', '.changeset'); // assuming apps/skyra-platform/.changeset
const OUT_FILE = path.resolve(process.cwd(), 'src/docs-system/data/releases.json');

function parseChangesets() {
  if (!fs.existsSync(CHANGESET_DIR)) {
    console.warn(`Changeset directory not found at ${CHANGESET_DIR}`);
    return [];
  }

  const files = fs.readdirSync(CHANGESET_DIR).filter(f => f.endsWith('.md') && f !== 'README.md');
  const releases = [];

  for (const file of files) {
    const content = fs.readFileSync(path.join(CHANGESET_DIR, file), 'utf-8');
    
    // Naive frontmatter parser
    const parts = content.split('---');
    if (parts.length < 3) continue;

    const frontmatter = parts[1].trim();
    const body = parts.slice(2).join('---').trim();

    // Parse packages from frontmatter
    // Format: "@skyra/app-shell": patch
    const packageLines = frontmatter.split('\n').filter(line => line.trim());
    const packages = [];

    for (const line of packageLines) {
      const match = line.match(/"([^"]+)":\s*(patch|minor|major)/);
      if (match) {
        packages.push({
          packageId: match[1],
          packageName: match[1],
          bump: match[2]
        });
      }
    }

    if (packages.length === 0) continue;

    // Parse changes from body
    // Split by bullet points
    const lines = body.split('\n');
    let currentChange = null;
    const changes = [];

    // Simple heuristic to extract title and description
    const titleMatch = body.match(/^([^#\n]+)/);
    const summary = titleMatch ? titleMatch[1].trim() : 'Updated package dependencies';

    for (const line of lines) {
      if (line.trim().startsWith('-')) {
        let text = line.trim().substring(1).trim();
        let type = 'changed';
        
        const lower = text.toLowerCase();
        if (lower.startsWith('fix') || lower.startsWith('resolve')) type = 'fixed';
        if (lower.startsWith('add') || lower.startsWith('feat')) type = 'added';
        if (lower.startsWith('remove') || lower.startsWith('delete')) type = 'removed';
        if (lower.startsWith('deprecate')) type = 'deprecated';
        if (lower.startsWith('security')) type = 'security';

        // Check for breaking changes
        const breaking = lower.includes('breaking change');

        currentChange = {
          id: `change-${Math.random().toString(36).substring(2, 9)}`,
          type,
          title: text,
          breaking
        };
        changes.push(currentChange);
      } else if (currentChange && line.trim()) {
        currentChange.description = (currentChange.description || '') + ' ' + line.trim();
      }
    }

    // fallback if no bullets
    if (changes.length === 0 && summary) {
       let type = 'changed';
       const lower = summary.toLowerCase();
       if (lower.startsWith('fix')) type = 'fixed';
       if (lower.startsWith('add') || lower.startsWith('feat')) type = 'added';
       
       changes.push({
          id: `change-${Math.random().toString(36).substring(2, 9)}`,
          type,
          title: summary,
          breaking: false
       });
    }

    // Map to ReleaseMetadata structure
    const releaseId = `pending-${path.parse(file).name}`;
    
    releases.push({
      id: releaseId,
      version: 'Pending Release',
      date: new Date().toISOString().split('T')[0],
      summary: summary,
      packages: packages.map(pkg => ({
        packageId: pkg.packageId,
        packageName: pkg.packageId,
        changes: changes
      }))
    });
  }

  return releases;
}

function run() {
  const releasesArray = parseChangesets();
  
  // Convert array to Record dictionary
  const releasesRecord = {};
  releasesArray.forEach(r => {
    releasesRecord[r.id] = r;
  });

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(releasesRecord, null, 2));
  console.log(`Successfully generated metadata for ${releasesArray.length} pending releases.`);
}

run();
