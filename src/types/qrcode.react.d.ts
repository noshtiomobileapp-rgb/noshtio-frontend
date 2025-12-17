declare module "qrcode.react" {
  import React from "react";

  export interface QRCodeProps {
    value: string;
    size?: number;
    includeMargin?: boolean;
    bgColor?: string;
    fgColor?: string;
    level?: "L" | "M" | "Q" | "H";
    style?: React.CSSProperties;
  }

  export const QRCodeCanvas: React.FC<QRCodeProps>;
  export const QRCodeSVG: React.FC<QRCodeProps>;
}
