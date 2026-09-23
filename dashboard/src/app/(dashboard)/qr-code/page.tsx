'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@skyra/ui';
import { QRCode } from '@skyra/qr';

export default function QRCodeShowcase() {
  const [value, setValue] = useState('https://skyra.tech');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [margin, setMargin] = useState(4);
  const [scale, setScale] = useState(4);
  const [darkColor, setDarkColor] = useState('#000000');
  const [lightColor, setLightColor] = useState('#ffffff');

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">QR Code</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Generic SVG QR code generator from @skyra/qr
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Payload Value</label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Enter URL or text..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Error Correction Level</label>
                <select
                  value={errorCorrectionLevel}
                  onChange={(e) => setErrorCorrectionLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Margin</label>
                  <input
                    type="number"
                    value={margin}
                    min={0}
                    max={10}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Scale (px/module)</label>
                  <input
                    type="number"
                    value={scale}
                    min={1}
                    max={20}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Foreground Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="h-10 w-10 p-1 border rounded"
                    />
                    <input
                      type="text"
                      value={darkColor}
                      onChange={(e) => setDarkColor(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Background Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="h-10 w-10 p-1 border rounded"
                    />
                    <input
                      type="text"
                      value={lightColor}
                      onChange={(e) => setLightColor(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 flex flex-col items-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center p-12 bg-slate-50 dark:bg-slate-900 border-t">
              {value ? (
                <QRCode
                  value={value}
                  errorCorrectionLevel={errorCorrectionLevel}
                  margin={margin}
                  scale={scale}
                  color={{ dark: darkColor, light: lightColor }}
                  className="shadow-md rounded-sm overflow-hidden bg-white"
                />
              ) : (
                <div className="text-muted-foreground italic text-center p-8">
                  Enter a value to generate a QR code.
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Implementation Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-slate-950 text-slate-50 p-4 rounded-md overflow-x-auto text-sm">
                <code>{`import { QRCode } from '@skyra/qr';

<QRCode 
  value="${value}"
  errorCorrectionLevel="${errorCorrectionLevel}"
  margin={${margin}}
  scale={${scale}}
  color={{ 
    dark: '${darkColor}', 
    light: '${lightColor}' 
  }}
/>`}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
