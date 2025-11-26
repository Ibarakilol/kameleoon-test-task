import type { RefObject } from 'react';
import html2canvas from 'html2canvas';

export const exportHTMLToPNG = async (ref: RefObject<HTMLElement | null>, fileName: string) => {
  if (!ref.current) {
    return;
  }

  try {
    const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true });
    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    const date = new Date().toISOString().split('T')[0];

    downloadLink.href = pngUrl;
    downloadLink.download = `${fileName}-${date}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (err) {
    console.error('Error exporting to PNG:', err);
  }
};
