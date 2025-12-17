import React from 'react';
import QRCode from 'qrcode.react';

export default function QRCodeGenerator({ vendorId }) {
  if (!vendorId) return null;
  const link = `${process.env.NEXT_PUBLIC_CLIENT_URL || 'http://localhost:3000'}/customer/${vendorId}/menu`;

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <div><QRCode value={link} size={200} /></div>
      <div>
        <a href={link} target="_blank" rel="noreferrer">Open link</a>
        <div style={{ marginTop: 8 }}>
          <button onClick={() => {
            // download png from canvas
            const canvas = document.querySelector('canvas');
            if (!canvas) return;
            const url = canvas.toDataURL('image/png');
            const a = document.createElement('a');
            a.href = url;
            a.download = `${vendorId}-qrcode.png`;
            a.click();
          }}>Download PNG</button>
        </div>
      </div>
    </div>
  );
}
