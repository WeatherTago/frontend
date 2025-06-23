// src/styles/emotion.d.ts
import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: {
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        700: string;
        800: string;
        900: string;
        950: string;
      };
      gray: {
        0: string;
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
        950: string;
      };
      subway: {
        line1: string;
        line2: string;
        line3: string;
        line4: string;
        line5: string;
        line6: string;
        line7: string;
        line8: string;
        line9: string;
      };
      secondary: {
        blue: string;
        purple: string;
      };
      text: string;
    };
    spacing: {
      sm: number;
      md: number;
      lg: number;
    };
    typography: {
      header1: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
      subtitle1: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
      subtitle2: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
      body1: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
      body2: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
      caption: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
      footnote: {
        fontSize: number;
        lineHeight: number;
        fontWeight: string;
      };
    };
  }
}
