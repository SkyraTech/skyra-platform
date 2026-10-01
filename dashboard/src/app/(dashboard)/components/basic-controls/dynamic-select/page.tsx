import { DynamicSelect, Card, CardContent, CardHeader, CardTitle, CardDescription } from '@skyra/ui';

export default function DynamicSelectShowcase() {
  const options = [
    { value: 'react', label: 'React', description: 'Meta' },
    { value: 'vue', label: 'Vue', description: 'Evan You' },
    { value: 'angular', label: 'Angular', description: 'Google' },
    { value: 'svelte', label: 'Svelte', description: 'Rich Harris' },
    { value: 'solid', label: 'Solid', description: 'Ryan Carniato' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dynamic Select</h1>
        <p className="text-muted-foreground mt-2">
          Framework-independent custom element implementation with search, grouping, and multi-select.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Usage</CardTitle>
            <CardDescription>Default single select without search.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm">
              <DynamicSelect 
                options={options}
                label="Favorite Framework"
                placeholder="Choose one..."
                onChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Search & Clearable */}
        <Card>
          <CardHeader>
            <CardTitle>Search & Clearable</CardTitle>
            <CardDescription>Single select with search enabled.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm">
              <DynamicSelect 
                options={options}
                label="Search Framework"
                placeholder="Search..."
                searchable
                clearable
                onChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Multi-Select */}
        <Card>
          <CardHeader>
            <CardTitle>Multiple Selection</CardTitle>
            <CardDescription>Multi-select with token chips.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm">
              <DynamicSelect 
                options={options}
                mode="multiple"
                label="Tech Stack"
                placeholder="Select multiple..."
                searchable
                clearable
                onChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Multi-Select */}
        <Card>
          <CardHeader>
            <CardTitle>Select All & Allow Create</CardTitle>
            <CardDescription>With "Select All" toggle and dynamic creation.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full max-w-sm">
              <DynamicSelect 
                options={options}
                mode="multiple"
                label="Advanced Selection"
                placeholder="Select or create..."
                searchable
                selectAll
                allowCreate
                maxVisibleValues={2}
                onChange={() => {}}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
